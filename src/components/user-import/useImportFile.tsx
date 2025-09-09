import { parse as parseCsv, unparse as unparseCsv, ParseResult } from "papaparse";
import { ChangeEvent, useState } from "react";
import { useTranslate, useNotify, HttpError } from "react-admin";

import { ImportLine, ParsedStats, Progress, ImportResult, ChangeStats } from "./types";
import dataProvider from "../../synapse/dataProvider";
import { returnMXID } from "../../utils/mxid";
import { generateRandomMXID } from "../../utils/mxid";
import { generateRandomPassword } from "../../utils/password";

const LOGGING = true;

const EXPECTED_FIELDS = ["id", "displayname"].sort();

const useImportFile = () => {
  const [csvData, setCsvData] = useState<ImportLine[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [stats, setStats] = useState<ParsedStats | null>(null);
  const [dryRun, setDryRun] = useState(true);

  const [progress, setProgress] = useState<Progress>(null);

  const [importResults, setImportResults] = useState<ImportResult | null>(null);
  const [skippedRecords, setSkippedRecords] = useState<string>("");

  const [conflictMode, setConflictMode] = useState<"stop" | "skip">("stop");
  const [passwordMode, setPasswordMode] = useState(true);
  const [useridMode, setUseridMode] = useState<"update" | "ignore">("update");

  const translate = useTranslate();
  const notify = useNotify();

  const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (progress !== null) return;

    setCsvData([]);
    setErrors([]);
    setStats(null);
    setImportResults(null);
    const file = e.target.files ? e.target.files[0] : null;
    if (!file) return;
    /* Let's refuse some unreasonably big files instead of freezing
     * up the browser */
    if (file.size > 100000000) {
      const message = translate("import_users.errors.unreasonably_big", {
        size: (file.size / (1024 * 1024)).toFixed(2),
      });
      notify(message);
      setErrors([message]);
      return;
    }
    try {
      parseCsv<ImportLine>(file, {
        header: true,
        skipEmptyLines: true /* especially for a final EOL in the csv file */,
        complete: result => {
          if (result.errors) {
            setErrors(result.errors.map(e => e.toString()));
          }
          /* Papaparse is very lenient, we may be able to salvage
           * the data in the file. */
          verifyCsv(result);
        },
      });
    } catch {
      setErrors(["Unknown error"]);
      return null;
    }
  };

  const verifyCsv = ({ data, meta, errors }: ParseResult<ImportLine>) => {
    /* First, verify the presence of required fields */
    meta.fields = meta.fields?.map(f => f.trim().toLowerCase());
    const missingFields = EXPECTED_FIELDS.filter(eF => !meta.fields?.find(mF => eF === mF));

    if (missingFields.length > 0) {
      setErrors([translate("import_users.error.required_field", { field: missingFields[0] })]);
      return false;
    }

    /* Collect some stats to prevent sneaky csv files from adding admin
       users or something.
     */
    const stats: ParsedStats = {
      user_types: { default: 0 },
      is_guest: 0,
      admin: 0,
      deactivated: 0,
      password: 0,
      avatar_url: 0,
      id: 0,

      total: data.length,
    };

    const errorMessages = errors.map(e => e.message);
    // sanitize the data first
    data = data.map(line => {
      const newLine = {} as ImportLine;
      for (const [key, value] of Object.entries(line)) {
        newLine[key.trim().toLowerCase()] = value;
      }
      return newLine;
    });

    // process the data
    data.forEach((line, idx) => {
      if (line.user_type === undefined || line.user_type === "") {
        stats.user_types.default++;
      } else {
        stats.user_types[line.user_type] += 1;
      }
      /* XXX correct the csv export that react-admin offers for the users
       * resource so it gives sensible field names and doesn't duplicate
       * id as "name"?
       */
      if (meta.fields?.includes("name")) {
        delete line.name;
      }
      if (meta.fields?.includes("user_type")) {
        delete line.user_type;
      }
      if (meta.fields?.includes("is_admin")) {
        delete line.is_admin;
      }

      ["is_guest", "admin", "deactivated"].forEach(f => {
        if (line[f] === "true") {
          stats[f]++;
          line[f] = true; // we need true booleans instead of strings
        } else {
          if (line[f] !== "false" && line[f] !== "") {
            console.log("invalid value", line[f], "for field " + f + " in row " + idx);
            errorMessages.push(
              translate("import_users.error.invalid_value", {
                field: f,
                row: idx,
              })
            );
          }
          line[f] = false; // default values to false
        }
      });

      if (line.password !== undefined && line.password !== "") {
        stats.password++;
      }

      if (line.avatar_url !== undefined && line.avatar_url !== "") {
        stats.avatar_url++;
      }

      if (line.id !== undefined && line.id !== "") {
        stats.id++;
      }
    });

    if (errorMessages.length > 0) {
      setErrors(errorMessages);
      return false;
    }

    setStats(stats);
    setCsvData(data);

    return true;
  };

  const onConflictModeChanged = async (e: ChangeEvent<HTMLSelectElement>) => {
    if (progress !== null) {
      return;
    }

    const value = e.target.value as "stop" | "skip";
    setConflictMode(value);
  };

  const onPasswordModeChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (progress !== null) {
      return;
    }

    setPasswordMode(e.target.checked);
  };

  const onUseridModeChanged = (e: ChangeEvent<HTMLSelectElement>) => {
    if (progress !== null) {
      return;
    }

    const value = e.target.value as "update" | "ignore";
    setUseridMode(value);
  };

  const onDryRunModeChanged = (e: ChangeEvent<HTMLInputElement>) => {
    if (progress !== null) {
      return;
    }
    setDryRun(e.target.checked);
  };

  const runImport = async () => {
    if (progress !== null) {
      notify("import_users.errors.already_in_progress");
      return;
    }

    const results = await doImport();
    setImportResults(results);
    // offer CSV download of skipped or errored records
    // (so that the user doesn't have to filter out successful
    // records manually when fixing stuff in the CSV)
    setSkippedRecords(unparseCsv(results.skippedRecords));
    if (LOGGING) console.log("Skipped records:");
    if (LOGGING) console.log(skippedRecords);
  };

  const doImport = async (): Promise<ImportResult> => {
    const skippedRecords: ImportLine[] = [];
    const erroredRecords: ImportLine[] = [];
    const succeededRecords: ImportLine[] = [];
    const changeStats: ChangeStats = {
      total: 0,
      id: 0,
      is_guest: 0,
      admin: 0,
      password: 0,
    };
    let entriesDone = 0;
    const entriesCount = csvData.length;
    try {
      setProgress({ done: entriesDone, limit: entriesCount });
      for (const entry of csvData) {
        const userRecord = { ...entry };
        // No need to do a bunch of cryptographic random number getting if
        // we are using neither a generated password nor a generated user id.
        if (useridMode === "ignore" || userRecord.id === undefined || userRecord.id === "") {
          userRecord.id = generateRandomMXID();
        }
        if (passwordMode === false || entry.password === undefined || entry.password === "") {
          userRecord.password = generateRandomPassword();
        }
        // we want to ensure that the ID is always full MXID, otherwise randomly-generated MXIDs will be in the full
        // form, but the ones from the CSV will be localpart-only.
        userRecord.id = returnMXID(userRecord.id);

        // if there are 3PIDs, convert them to objects ("medium:address,..." -> [{medium,address},...])
        if (userRecord.threepids !== undefined && userRecord.threepids !== "") {
          const threepids = userRecord.threepids.split(",").map(m => m.trim());
          const threepidObjs = [];
          for (const threepid of threepids) {
            const parts = threepid.split(":");
            if (parts.length !== 2) {
              continue;
            }
            const medium = parts[0].trim().toLowerCase();
            const address = parts[1].trim();
            if (address === "") {
              continue;
            }
            threepidObjs.push({ medium, address });
          }
          userRecord.threepids = threepidObjs;
        }

        /* TODO record update stats (especially admin no -> yes, deactivated x -> !x, ... */

        /* For these modes we will consider the ID that's in the record.
         * If the mode is "stop", we will not continue adding more records, and
         * we will offer information on what was already added and what was
         * skipped.
         *
         * If the mode is "skip", we record the record for later, but don't
         * send it to the server.
         *
         * If the mode is "update", we change fields that are reasonable to
         * update.
         *  - If the "password mode" is "true" (i.e. "use passwords from csv"):
         *    - if the record has a password
         *      - send the password along with the record
         *    - if the record has no password
         *      - generate a new password
         *  - If the "password mode" is "false"
         *    - never generate a new password to update existing users with
         */

        /* We just act as if there are no IDs in the CSV, so every user will be
         * created anew.
         * We do a simple retry loop so that an accidental hit on an existing ID
         * doesn't trip us up.
         */
        if (LOGGING) console.log("will check for existence of record " + JSON.stringify(userRecord));
        let retries = 0;
        const submitRecord = async (recordData: ImportLine) => {
          try {
            await dataProvider.getOne("users", { id: recordData.id });

            if (LOGGING) console.log("already existed");

            if (conflictMode === "stop") {
              throw new Error(
                translate("import_users.error.id_exits", {
                  id: recordData.id,
                })
              );
            }

            if (conflictMode === "skip" || useridMode === "update") {
              skippedRecords.push(recordData);
              return;
            }

            const newRecordData = Object.assign({}, recordData, {
              id: generateRandomMXID(),
            });
            retries++;

            if (retries > 512) {
              console.warn("retry loop got stuck? pathological situation?");
              skippedRecords.push(recordData);
              return;
            }

            await submitRecord(newRecordData);
          } catch (e) {
            if (!(e instanceof HttpError) || (e.status && e.status !== 404)) {
              throw e;
            }

            if (LOGGING) console.log("OK to create record " + recordData.id + " (" + recordData.displayname + ").");

            if (!dryRun) {
              await dataProvider.create("users", { data: recordData });
            }
            succeededRecords.push(recordData);
          }
        };

        await submitRecord(userRecord);
        entriesDone++;
        setProgress({ done: entriesDone, limit: csvData.length });
      }

      setProgress(null);
    } catch (e) {
      setErrors([
        translate("import_users.error.at_entry", {
          entry: entriesDone + 1,
          message: e instanceof Error ? e.message : String(e),
        }),
      ]);
      setProgress(null);
    }

    return {
      skippedRecords,
      erroredRecords,
      succeededRecords,
      totalRecordCount: entriesCount,
      changeStats,
      wasDryRun: dryRun,
    };
  };

  const downloadSkippedRecords = () => {
    const element = document.createElement("a");
    console.log(skippedRecords);
    const file = new Blob([skippedRecords], {
      type: "text/comma-separated-values",
    });
    element.href = URL.createObjectURL(file);
    element.download = "skippedRecords.csv";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  return {
    csvData,
    dryRun,
    onDryRunModeChanged,
    runImport,
    progress,
    importResults,
    errors,
    stats,
    conflictMode,
    passwordMode,
    useridMode,
    onConflictModeChanged,
    onPasswordModeChange,
    onUseridModeChanged,
    onFileChange,
    downloadSkippedRecords,
  };
};

export default useImportFile;

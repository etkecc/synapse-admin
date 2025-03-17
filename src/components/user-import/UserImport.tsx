import { parse as parseCsv, unparse as unparseCsv, ParseResult } from "papaparse";
import { ChangeEvent, useState } from "react";

import {
  Stack,
} from "@mui/material";
import { DataProvider, useTranslate } from "ra-core";
import { useDataProvider, useNotify, RaRecord, Title } from "react-admin";

import { generateRandomMXID, returnMXID } from "../../utils/mxid";
import { generateRandomPassword } from "../../utils/password";
import UploadCard from "./UploadCard";
import useImportFile from "./useImportFile";
import ErrorsCard from "./ErrorsCard";
import ConflictModeCard from "./ConflictModeCard";
import StatsCard from "./StatsCard";
import StartImportCard from "./StartImportCard";

const UserImport = () => {
  // const [importResults, setImportResults] = useState<ImportResult | null>(null);
  // const [skippedRecords, setSkippedRecords] = useState<string>("");
  const {
    csvData,
    dryRun,
    onDryRunModeChanged,
    runImport,
    onFileChange,
    importResults,
    progress,
    errors,
    stats,
    conflictMode,
    passwordMode,
    useridMode,
    onConflictModeChanged,
    onPasswordModeChange,
    onUseridModeChanged
  } = useImportFile();
  console.log("@errors", errors);

  const translate = useTranslate();

    // const resultsCard = importResults && (
  //   <CardContent>
  //     <CardHeader title={translate("import_users.cards.results.header")} />
  //     <div>
  //       {translate("import_users.cards.results.total", importResults.totalRecordCount)}
  //       <br />
  //       {translate("import_users.cards.results.successful", importResults.succeededRecords.length)}
  //       <br />
  //       {importResults.skippedRecords.length
  //         ? [
  //           translate("import_users.cards.results.skipped", importResults.skippedRecords.length),
  //           <div>
  //             <button onClick={downloadSkippedRecords}>
  //               {translate("import_users.cards.results.download_skipped")}
  //             </button>
  //           </div>,
  //           <br />,
  //         ]
  //         : ""}
  //       {importResults.erroredRecords.length
  //         ? [translate("import_users.cards.results.skipped", importResults.erroredRecords.length), <br />]
  //         : ""}
  //       <br />
  //       {importResults.wasDryRun && [translate("import_users.cards.results.simulated_only"), <br />]}
  //     </div>
  //   </CardContent>
  // );

  // const allCards: React.JSX.Element[] = [];
  // if (uploadCard) allCards.push(uploadCard);
  // if (errorCards) allCards.push(errorCards);
  // if (conflictCards) allCards.push(conflictCards);
  // if (statsCards) allCards.push(...statsCards);
  // if (startImportCard) allCards.push(startImportCard);


  // if (resultsCard) allCards.push(resultsCard);

  // const cardContainer = <Card>{allCards}</Card>;

  // return [<Title defaultTitle={translate("import_users.title")} />, cardContainer];


  return (
    <Stack spacing={3} mt={3} direction="column">
        <Title defaultTitle={translate("import_users.title")} />
        <UploadCard importResults={importResults} onFileChange={onFileChange} progress={progress} />
        <ErrorsCard errors={errors} />
        <ConflictModeCard stats={stats} importResults={importResults} conflictMode={conflictMode} onConflictModeChanged={onConflictModeChanged} progress={progress} />
        <StatsCard stats={stats} progress={progress} importResults={importResults} passwordMode={passwordMode} useridMode={useridMode} onPasswordModeChange={onPasswordModeChange} onUseridModeChanged={onUseridModeChanged} />
        <StartImportCard csvData={csvData} importResults={importResults} progress={progress} dryRun={dryRun} onDryRunModeChanged={onDryRunModeChanged} runImport={runImport} />
        {/* {cardContainer} */}
    </Stack>
  );

};

export default UserImport;

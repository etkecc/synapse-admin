import {
  Stack,
} from "@mui/material";
import { useTranslate } from "ra-core";
import { Title } from "react-admin";

import UploadCard from "./UploadCard";
import useImportFile from "./useImportFile";
import ErrorsCard from "./ErrorsCard";
import ConflictModeCard from "./ConflictModeCard";
import StatsCard from "./StatsCard";
import StartImportCard from "./StartImportCard";
import ResultsCard from "./ResultsCard";

const UserImport = () => {
  const {
    csvData,
    dryRun,
    importResults,
    progress,
    errors,
    stats,
    conflictMode,
    passwordMode,
    useridMode,
    onFileChange,
    onDryRunModeChanged,
    runImport,
    onConflictModeChanged,
    onPasswordModeChange,
    onUseridModeChanged,
    downloadSkippedRecords
  } = useImportFile();

  const translate = useTranslate();

  return (
    <Stack spacing={3} mt={3} direction="column">
        <Title defaultTitle={translate("import_users.title")} />
        <UploadCard importResults={importResults} onFileChange={onFileChange} progress={progress} />
        <ErrorsCard errors={errors} />
        <ConflictModeCard stats={stats} importResults={importResults} conflictMode={conflictMode} onConflictModeChanged={onConflictModeChanged} progress={progress} />
        <StatsCard stats={stats} progress={progress} importResults={importResults} passwordMode={passwordMode} useridMode={useridMode} onPasswordModeChange={onPasswordModeChange} onUseridModeChanged={onUseridModeChanged} />
        <StartImportCard csvData={csvData} importResults={importResults} progress={progress} dryRun={dryRun} onDryRunModeChanged={onDryRunModeChanged} runImport={runImport} />
        <ResultsCard importResults={importResults} downloadSkippedRecords={downloadSkippedRecords} />
    </Stack>
  );

};

export default UserImport;

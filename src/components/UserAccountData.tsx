import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { Typography, Box, Stack, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { useEffect, useState } from "react";
import { useDataProvider, useRecordContext, useTranslate } from "react-admin";

import { SynapseDataProvider } from "../synapse/dataProvider";

const UserAccountData = () => {
  const dataProvider = useDataProvider() as SynapseDataProvider;
  const record = useRecordContext();
  const translate = useTranslate();
  const [globalAccountData, setGlobalAccountData] = useState({});
  const [roomsAccountData, setRoomsAccountData] = useState({});

  if (!record) {
    return null;
  }

  useEffect(() => {
    const fetchAccountData = async () => {
      const accountData = await dataProvider.getAccountData(record.id);
      setGlobalAccountData(accountData.account_data.global);
      setRoomsAccountData(accountData.account_data.rooms);
    };
    fetchAccountData();
  }, []);

  if (Object.keys(globalAccountData).length === 0 && Object.keys(roomsAccountData).length === 0) {
    return (
      <Typography variant="body2">
        {translate("ra.navigation.no_results", {
          resource: "Account Data",
          _: "No results found.",
        })}
      </Typography>
    );
  }

  return (
    <>
      <Stack direction="column" spacing={2} width="100%">
        <Typography variant="h6">{translate("resources.users.account_data.title")}</Typography>
        <Typography variant="body1">
          <Box>
            <Accordion>
              <AccordionSummary expandIcon={<ArrowDownwardIcon />}>
                <Typography variant="h6">{translate("resources.users.account_data.global")}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(globalAccountData, null, 4)}</Box>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<ArrowDownwardIcon />}>
                <Typography variant="h6">{translate("resources.users.account_data.rooms")}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(roomsAccountData, null, 4)}</Box>
              </AccordionDetails>
            </Accordion>
          </Box>
        </Typography>
      </Stack>
    </>
  );
};

export default UserAccountData;

import DeleteIcon from "@mui/icons-material/Delete";
import HttpsIcon from "@mui/icons-material/Https";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useState } from "react";
import {
  Button,
  Confirm,
  DateField,
  ListProps,
  ResourceProps,
  SearchInput,
  SimpleList,
  TextField,
  useDataProvider,
  useNotify,
  useRecordContext,
  useRefresh,
  useTranslate,
} from "react-admin";

import { SynapseDataProvider } from "../../providers/types";
import { Datagrid, EmptyState, List } from "../../components/layout";

export const DeleteOAuthLinkButton = () => {
  const record = useRecordContext();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const notify = useNotify();
  const refresh = useRefresh();
  const dataProvider = useDataProvider() as SynapseDataProvider;
  const translate = useTranslate();

  if (!record) return null;

  const handleConfirm = async () => {
    setOpen(false);
    setLoading(true);
    try {
      await dataProvider.delete("mas_upstream_oauth_links", { id: record.id, previousData: record });
      notify("resources.mas_upstream_oauth_links.action.remove.success");
      refresh();
    } catch {
      notify("ra.notification.http_error", { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        label="resources.mas_upstream_oauth_links.action.remove.label"
        onClick={() => setOpen(true)}
        disabled={loading}
        color="error"
      >
        <DeleteIcon />
      </Button>
      <Confirm
        isOpen={open}
        title={translate("resources.mas_upstream_oauth_links.action.remove.title")}
        content={translate("resources.mas_upstream_oauth_links.action.remove.content")}
        onConfirm={handleConfirm}
        onClose={() => setOpen(false)}
      />
    </>
  );
};

const oauthLinkFilters = [<SearchInput key="user_id" source="user_id" alwaysOn />];

export function MASUpstreamOAuthLinksList(props: ListProps) {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <List {...props} filters={oauthLinkFilters} pagination={false} perPage={50} empty={<EmptyState />}>
      {isSmall ? (
        <SimpleList
          primaryText={record => String(record.subject || "")}
          secondaryText={record => String(record.user_id || "")}
          tertiaryText={() => <DeleteOAuthLinkButton />}
          rowClick={false}
        />
      ) : (
        <Datagrid bulkActionButtons={false} rowClick={false}>
          <TextField source="user_id" sortable={false} />
          <TextField source="provider_id" sortable={false} />
          <TextField source="subject" sortable={false} />
          <TextField source="human_account_name" sortable={false} emptyText="-" />
          <DateField source="created_at" showTime sortable={false} />
          <DeleteOAuthLinkButton />
        </Datagrid>
      )}
    </List>
  );
}

export const masUpstreamOAuthLinks: ResourceProps = {
  name: "mas_upstream_oauth_links",
  icon: HttpsIcon,
  list: MASUpstreamOAuthLinksList,
};

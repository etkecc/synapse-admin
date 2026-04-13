import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HttpsIcon from "@mui/icons-material/Https";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Datagrid, EmptyState, List } from "../../components/layout";
import {
  BooleanField,
  DateField,
  ListProps,
  ResourceProps,
  Show,
  SimpleList,
  SimpleShowLayout,
  TextField,
} from "react-admin";

export function MASUpstreamOAuthProvidersList(props: ListProps) {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <List {...props} pagination={false} perPage={50} empty={<EmptyState />}>
      {isSmall ? (
        <SimpleList
          primaryText={record => record.human_name || String(record.id)}
          secondaryText={record => String(record.issuer || "")}
          tertiaryText={record =>
            record.enabled ? (
              <CheckCircleIcon fontSize="small" sx={{ color: "success.main" }} />
            ) : (
              <BlockIcon fontSize="small" sx={{ color: "text.disabled" }} />
            )
          }
          rowClick="show"
        />
      ) : (
        <Datagrid rowLabel={record => String(record.human_name || record.id)} bulkActionButtons={false} rowClick="show">
          <TextField source="human_name" sortable={false} emptyText="-" />
          <TextField source="brand_name" sortable={false} emptyText="-" />
          <TextField source="issuer" sortable={false} emptyText="-" />
          <BooleanField source="enabled" sortable={false} />
          <DateField source="created_at" showTime sortable={false} />
        </Datagrid>
      )}
    </List>
  );
}

export const MASUpstreamOAuthProvidersShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="human_name" emptyText="-" />
      <TextField source="brand_name" emptyText="-" />
      <TextField source="issuer" emptyText="-" />
      <BooleanField source="enabled" />
      <DateField source="created_at" showTime />
      <DateField source="disabled_at" showTime emptyText="-" />
    </SimpleShowLayout>
  </Show>
);

export const masUpstreamOAuthProviders: ResourceProps = {
  name: "mas_upstream_oauth_providers",
  icon: HttpsIcon,
  list: MASUpstreamOAuthProvidersList,
  show: MASUpstreamOAuthProvidersShow,
};

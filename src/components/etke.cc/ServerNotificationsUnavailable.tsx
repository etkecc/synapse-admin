import { Box, Button, Link, List, ListItem, Typography } from "@mui/material";
import { useTranslate } from "react-admin";

interface Props {
  onRetry: () => void;
}

export const ServerNotificationsUnavailable = ({ onRetry }: Props) => {
  const translate = useTranslate();
  return (
    <Box sx={{ p: 2, maxWidth: { xs: "100vw", sm: "400px" } }}>
      <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
        {translate("etkecc.notifications.unavailable_title")}
      </Typography>
      <Typography variant="body2" sx={{ mb: 1 }}>
        {translate("etkecc.notifications.unavailable_body")}
      </Typography>
      <List dense sx={{ pl: 2 }}>
        <ListItem sx={{ display: "list-item", listStyleType: "disc", p: 0 }}>
          <Link href="https://matrix.to/#/%23news:etke.cc" target="_blank" rel="noreferrer">
            {translate("etkecc.notifications.unavailable_link_matrix")}
          </Link>
        </ListItem>
        <ListItem sx={{ display: "list-item", listStyleType: "disc", p: 0 }}>
          <Link href="https://etke.cc/news" target="_blank" rel="noreferrer">
            {translate("etkecc.notifications.unavailable_link_news")}
          </Link>
        </ListItem>
        <ListItem sx={{ display: "list-item", listStyleType: "disc", p: 0 }}>
          <Typography variant="body2">{translate("etkecc.notifications.unavailable_link_email")}</Typography>
        </ListItem>
      </List>
      <Button variant="outlined" size="small" onClick={onRetry} sx={{ mt: 1 }}>
        {translate("etkecc.notifications.unavailable_retry")}
      </Button>
    </Box>
  );
};

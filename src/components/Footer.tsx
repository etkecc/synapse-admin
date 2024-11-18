import { Avatar, Box, Link, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";

const Footer = () => {
  const [version, setVersion] = useState<string | null>(null);
  const theme = useTheme();

  useEffect(() => {
    const version = document.getElementById("js-version")?.textContent;
    if (version) {
      setVersion(version);
    }
  }, []);

  return (<Box
    component="footer"
    sx={{
      position: 'fixed',
      zIndex: 100,
      bottom: 0,
      width: '100%',
      bgcolor: theme.palette.background.default,
      color: theme.palette.primary.contrastText,
      borderTop: '1px solid',
      borderColor: theme.palette.divider,
      fontSize: '0.89rem',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'start',
      p: 1,
      gap: '10px'
    }}>
      <Avatar src="./images/logo.webp" sx={{ width: "1rem", height: "1rem", display: "inline-block", verticalAlign: "sub" }} />
      <Link sx={{ color: theme.palette.info.main, textDecoration: 'none' }} href="https://github.com/etkecc/synapse-admin" target="_blank">
        Synapse Admin
      </Link>
      <Link sx={{ display: 'inline-block', color: theme.palette.grey[600] }} href={`https://github.com/etkecc/synapse-admin/releases/tag/`+version} target="_blank">
        <span style={{ fontWeight: 'bold' }}>{version}</span>
      </Link>
      <Link sx={{  textDecoration: 'none', color: theme.palette.info.main }} href="https://etke.cc/?utm_source=synapse-admin&utm_medium=footer&utm_campaign=synapse-admin" target="_blank">
        by etke.cc
      </Link>
      <Link sx={{ textDecoration: 'none', color: theme.palette.grey[600] }} href="https://github.com/awesome-technologies/synapse-admin" target="_blank">
        (originally developed by Awesome Technologies Innovationslabor GmbH).
      </Link>
      <Link sx={{ fontWeight: 'bold', color: theme.palette.info.main,textDecoration: 'none' }} href="https://matrix.to/#/#synapse-admin:etke.cc" target="_blank">#synapse-admin:etke.cc</Link>
  </Box>
  );
};

export default Footer;

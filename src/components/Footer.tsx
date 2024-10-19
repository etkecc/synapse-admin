import { Box, Link, Typography } from "@mui/material";
import { useEffect, useState } from "react";

const Footer = () => {
  const [version, setVersion] = useState<string | null>(null);
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
      bgcolor: "#eee",
      borderTop: '1px solid',
      borderColor: '#ddd',
      p: 1,
    }}>
      <Typography variant="body2">
        <Link sx={{ color: "#888", textDecoration: 'none' }} href="https://github.com/etkecc/synapse-admin" target="_blank" rel="noopener noreferrer">
        Synapse-Admin <span style={{ fontWeight: 'bold', color: "#000" }}>{version}</span> by Awesome Technologies Innovationslabor GmbH,
        etke.cc
        </Link>
      </Typography>
    </Box>
  );
};

export default Footer;

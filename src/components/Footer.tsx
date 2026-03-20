import { Avatar, Box, Link } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";

const Footer = ({ logoSrc = "./images/logo.webp" }: { logoSrc?: string }) => {
  const [version, setVersion] = useState<string | null>(null);
  const theme = useTheme();

  useEffect(() => {
    const version = document.getElementById("js-version")?.textContent;
    if (version) {
      setVersion(version);
    }
  }, []);

  return (
    <Box
      component="footer"
      sx={{
        position: "fixed",
        zIndex: 100,
        bottom: 0,
        width: "100%",
        bgcolor: theme.palette.mode === "dark" ? "#041019" : "#334258",
        color: theme.palette.mode === "dark" ? "#E0E0E0" : "#FFFFFF",
        boxShadow: theme.palette.mode === "dark" ? "0 -1px 3px rgba(0,0,0,0.3)" : "0 -1px 3px rgba(0,0,0,0.08)",
        borderTop: "none",
        fontSize: "0.89rem",
        display: "block",
        p: 1,
        gap: "10px",
      }}
    >
      <Avatar src={logoSrc} sx={{ width: "1rem", height: "1rem", display: "inline-block", verticalAlign: "sub" }} />{" "}
      <Link href="https://github.com/etkecc/synapse-admin" target="_blank" sx={{ color: "inherit" }}>
        Synapse Admin {version}
      </Link>
      <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
        {" "}by{" "}
        <Link
          href="https://etke.cc/?utm_source=synapse-admin&utm_medium=footer&utm_campaign=synapse-admin"
          target="_blank"
          sx={{ color: "inherit" }}
        >
          etke.cc
        </Link>{" "}
        (originally developed by Awesome Technologies Innovationslabor GmbH).{" "}
        <Link
          sx={{ fontWeight: "bold", color: "inherit" }}
          href="https://matrix.to/#/#synapse-admin:etke.cc"
          target="_blank"
        >
          #synapse-admin:etke.cc
        </Link>
      </Box>
    </Box>
  );
};

export default Footer;

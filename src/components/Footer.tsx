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
        zIndex: { xs: 1, sm: 100 },
        bottom: 0,
        width: "100%",
        bgcolor: theme.palette.mode === "dark" ? "#080D12" : "#334258",
        color: theme.palette.mode === "dark" ? "#E0E0E0" : "#FFFFFF",
        boxShadow: theme.palette.mode === "dark" ? "0 -1px 3px rgba(0,0,0,0.3)" : "0 -1px 3px rgba(0,0,0,0.08)",
        borderTop: "none",
        fontSize: "0.89rem",
        display: "block",
        whiteSpace: "nowrap",
        p: { xs: "4px 8px", sm: 1 },
        gap: "10px",
      }}
    >
      <Avatar src={logoSrc} sx={{ width: "1rem", height: "1rem", display: "inline-block", verticalAlign: "sub" }} />{" "}
      <Link href="https://github.com/etkecc/ketesa" target="_blank" sx={{ color: "inherit" }}>
        Ketesa {version}
      </Link>
      <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
        {" "}
        by{" "}
        <Link
          href="https://etke.cc/?utm_source=ketesa&utm_medium=footer&utm_campaign=ketesa"
          target="_blank"
          sx={{ color: "#f49300", fontWeight: 500 }}
        >
          etke.cc
        </Link>{" "}
        <Link sx={{ fontWeight: "bold", color: "inherit" }} href="https://matrix.to/#/#ketesa:etke.cc" target="_blank">
          #ketesa:etke.cc
        </Link>
      </Box>
    </Box>
  );
};

export default Footer;

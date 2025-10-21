import { Box, BoxProps } from "@mui/material";
import { styled } from "@mui/material/styles";

interface LoginFormBoxProps extends BoxProps {
  backgroundUrl: string;
}

const LoginFormBox = styled(Box, {
  shouldForwardProp: prop => prop !== "backgroundUrl",
})<LoginFormBoxProps>(({ theme, backgroundUrl }) => ({
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
  alignItems: "center",
  justifyContent: "flex-start",
  background: `url(${backgroundUrl})`,
  backgroundColor: theme.palette.mode === "dark" ? theme.palette.background.default : theme.palette.background.paper,
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",

  [`& .card`]: {
    width: "30rem",
    marginTop: "6rem",
    marginBottom: "6rem",
  },
  [`@media (max-width: 600px)`]: {
    [`& .card`]: {
      width: "100%",
      marginTop: "0",
    },
  },
  [`& .avatar`]: {
    margin: "1rem",
    display: "flex",
    justifyContent: "center",
  },
  [`& .icon`]: {
    backgroundColor: theme.palette.grey[500],
  },
  [`& .hint`]: {
    marginTop: "1em",
    marginBottom: "1em",
    display: "flex",
    justifyContent: "center",
    color: theme.palette.grey[600],
  },
  [`& .form`]: {
    padding: "0 1rem 1rem 1rem",
  },
  [`& .select`]: {
    marginBottom: "2rem",
  },
  [`& .actions`]: {
    padding: "0 1rem 1rem 1rem",
  },
  [`& .serverVersion`]: {
    color: theme.palette.grey[500],
    fontFamily: "Roboto, Helvetica, Arial, sans-serif",
    marginLeft: "0.5rem",
  },
  [`& .matrixVersions`]: {
    color: theme.palette.grey[500],
    fontFamily: "Roboto, Helvetica, Arial, sans-serif",
    fontSize: "0.8rem",
    marginBottom: "1rem",
    marginLeft: "0.5rem",
  },
}));

export default LoginFormBox;

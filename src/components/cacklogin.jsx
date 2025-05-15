import { Box, Typography } from "@mui/material";
import { Navigate } from "react-router-dom";

export default function Cacklogin({ element, path }) {
  const loggedInUser = JSON.parse(localStorage.getItem("user")) || null;




  if (path === "/departments") {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
        <Box sx={{ boxShadow: 2, width: 250, textAlign: "center" }}>
          <Typography variant="h4">404 Not Found</Typography>
          <Typography variant="subtitle2">Content not Found</Typography>
        </Box>
      </Box>
    );
  }

  if (path === "/report/novel" && loggedInUser.status !== "admin") {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
        <Box sx={{ boxShadow: 2, width: 250, textAlign: "center" }}>
          <Typography variant="h4">404 Not Found</Typography>
          <Typography variant="subtitle2">Content not Found</Typography>
        </Box>
      </Box>
    );
  }

  return element;
}

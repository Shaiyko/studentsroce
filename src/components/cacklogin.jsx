import { Box, Typography } from "@mui/material";
import { Navigate } from "react-router-dom";

export default function Cacklogin({ element, path }) {
  const loggedInUser = JSON.parse(localStorage.getItem("user_sheet")) || null;




  if (path === "/profire" && !loggedInUser) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
        <Box sx={{ boxShadow: 2, width: 250, textAlign: "center" }}>
          <Typography variant="h4">404</Typography>
          <Typography variant="subtitle2">Content not Found</Typography>
          <Typography variant="subtitle2"><a href="/login">
          ໄປ Login ກ່ອນ
          </a>
          </Typography>
        </Box>
      </Box>
    );
  }

  

  return element;
}

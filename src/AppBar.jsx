import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import SV from "./assets/SV.webp";
import { Box } from "@mui/material";

const MyAppBar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Sengsavnh Institute Of Business{" "}
        </Typography>
        <Box
          sx={{
            display: "flex",
            width: { xs: 50, md: 100 },
            height: { xs: 50, md: 100 },
          }}
        >
          <img
            src={SV}
            alt="Logo"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default MyAppBar;

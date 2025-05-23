import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import SV from "./assets/SV.webp";
import { Box, Button } from "@mui/material";
import { Link } from "react-router-dom";

const MyAppBar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Box
          sx={{
            display: "flex",
            width: { xs: 50, md: 70 },
            height: { xs: 50, md: 70 },
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
        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            fontFamily: "NotoSansLaoLooped, sans-serif",
            fontSize: { xs: 20, md: 30 },
            textAlign: "left",
            ml: 2,
          }}
        >
          SV
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexGrow: 1,
            justifyContent: "right",
            alignItems: "center",
          }}
        >
          <Button color="inherit" component={Link} to="/">
            ເບີ່ງຄະແນນ
          </Button>
          <Button color="inherit" component={Link} to="/sheetmanagerc">
            ເກັບໜ່ວຍກິດຄືນ
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default MyAppBar;

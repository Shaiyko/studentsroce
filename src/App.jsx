import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { Box, CssBaseline } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import StudentSearchExport from "./Showsroce";
import MyAppBar from "./AppBar";
import Footer from "./Footer";
import SheetManagerC from "./Fixf";

const theme = createTheme({
  typography: {
    fontFamily: "NotoSansLaoLooped, sans-serif",
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <Router>
        <MyAppBar />
          <Routes>
            <Route path="/" element={<StudentSearchExport />} />
            <Route path="/fixf" element={<SheetManagerC />} />
          </Routes>
        </Router>
        <Footer />
      </Box>
    </ThemeProvider>
  );
}

export default App;

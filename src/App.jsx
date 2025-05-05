

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import React from "react";
import StudentSearchExport from './Showsroce';
import MyAppBar from "./AppBar";
import Footer from "./Footer";
import { Box } from "@mui/material";
function App() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
    <MyAppBar />
      <Router>
        <Routes>
          <Route path="/" element={<StudentSearchExport />} />
          
        </Routes>
      </Router>
      <Footer />
    </Box>
  );
}

export default App;

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Container,
  CircularProgress,
  TextField,
  Autocomplete,
} from "@mui/material";
import { apisheet } from "./URL";

function SheetManagerC() {
  const [selectedId, setSelectedId] = useState(
    "1vljM5p2_vEQXxoadH7-_pq-Saexe1irrvDDZ9Ug6UFg"
  );
  const [allSheetData, setAllSheetData] = useState([]);

  const [filterSubject, setFilterSubject] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [showOnlySelectedStudent, setShowOnlySelectedStudent] = useState(true);

  const [subjectOptions, setSubjectOptions] = useState([]);
  const [studentOptions, setStudentOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    handleSelectSpreadsheet();
  }, [selectedId]);

  const handleSelectSpreadsheet = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${apisheet}/all-sheet-data/${selectedId}`);
      
      if (!res.ok) {
        if (res.status === 404) {
          console.error("Resource not found (404). Please check the API endpoint or selectedId.");
          alert("The requested data could not be found. Please check your selection.");
        } else {
          console.error(`Error: ${res.status} ${res.statusText}`);
          alert("An error occurred while fetching data. Please try again later.");
        }
        return;
      }

      const allData = await res.json();
      setAllSheetData(allData);

      const subjects = new Set();
      const students = new Set();

      for (const sheet of allData) {
        const [header, ...rows] = sheet.data;
        const subIndex = header.indexOf("SubName");
        const stuIndex = header.indexOf("StudentName");

        if (subIndex === -1 || stuIndex === -1) continue;

        rows.forEach((row) => {
          if (row[subIndex]) {
            row[subIndex]
              .split("+")
              .map((s) => s.trim())
              .forEach((s) => subjects.add(s));
          }
          if (row[stuIndex]) {
            students.add(row[stuIndex].trim());
          }
        });
      }

      setSubjectOptions([...subjects].sort());
      setStudentOptions([...students].sort());
    } catch (err) {
      console.error("Error loading spreadsheet data:", err);
      alert("An error occurred while loading data. Please check your network connection.");
    } finally {
      setLoading(false);
    }
  };

  const filterData = (sheet) => {
    if (!sheet.data || sheet.data.length === 0) return [];
    const [header, ...rows] = sheet.data;
    const keys = header;
    const dataObjects = rows.map((row) =>
      keys.reduce((obj, key, idx) => {
        obj[key.trim()] = row[idx]?.toString().trim() ?? "";
        return obj;
      }, {})
    );

    let filtered = dataObjects;

    if (selectedStudent) {
      const selectedName = selectedStudent.replace(/\s/g, "").toLowerCase();
      if (showOnlySelectedStudent) {
        filtered = filtered.filter((row) => {
          const studentName = row["StudentName"]
            ?.replace(/\s/g, "")
            .toLowerCase();
          return studentName === selectedName;
        });
      } else {
        const hasStudent = filtered.some((row) => {
          const studentName = row["StudentName"]
            ?.replace(/\s/g, "")
            .toLowerCase();
          return studentName === selectedName;
        });
        if (!hasStudent) return [];
      }
    }

    if (filterSubject) {
      filtered = filtered.filter((row) =>
        row["SubName"]
          ?.split("+")
          .some((sub) =>
            sub.trim().toLowerCase().includes(filterSubject.toLowerCase())
          )
      );
    }

    return [keys, ...filtered.map((rowObj) => keys.map((key) => rowObj[key]))];
  };

  return (
    <Container>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box
          p={2}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {allSheetData.length > 0 && (
            <>
              <Typography
                fontFamily={"NotoSansLaoLooped"}
                variant="h6"
                gutterBottom
              >
                🔍 ຕົວກ່ອງຂໍ້ມູນ
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 2,
                  flexWrap: "wrap",
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "flex-start",
                }}
              >
                <Autocomplete
                  options={subjectOptions}
                  value={filterSubject}
                  onChange={(event, newValue) =>
                    setFilterSubject(newValue || "")
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="ວິຊາ" variant="outlined" />
                  )}
                  sx={{ minWidth: 160, maxWidth: 350, width: "100%" }}
                  clearOnEscape
                  isOptionEqualToValue={(option, value) => option === value}
                />

                <Autocomplete
                  options={studentOptions}
                  value={selectedStudent}
                  onChange={(event, newValue) =>
                    setSelectedStudent(newValue || "")
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="ຊື່ ນັກສຶກສາ"
                      variant="outlined"
                    />
                  )}
                  sx={{ minWidth: 160, maxWidth: 350, width: "100%" }}
                  clearOnEscape
                  isOptionEqualToValue={(option, value) => option === value}
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={showOnlySelectedStudent}
                      onChange={(e) =>
                        setShowOnlySelectedStudent(e.target.checked)
                      }
                    />
                  }
                  label="ສະແດງແຕ່ນັກສຶກສາ ທີ່ເລືອກ"
                  sx={{ whiteSpace: "nowrap" }}
                />
              </Box>

              <Typography variant="h6" gutterBottom>
                📊 ຕາຕະລາງຂໍໍ່ມູນ
              </Typography>

              {allSheetData.map((sheet) => {
                const filtered = filterData(sheet);
                if (filtered.length <= 1) return null;

                return (
                  <Box key={sheet.sheetName} mb={4} width="100%">
                    <Typography variant="subtitle1" gutterBottom>
                      📊 ວິຊາ "{sheet.sheetName}" (ຈຳນວນຄົນ{" "}
                      {filtered.length - 1})
                    </Typography>

                    <TableContainer
                      component={Paper}
                      sx={{ overflowX: "auto", maxWidth: "100%" }}
                    >
                      <Table size="small" sx={{ minWidth: 600 }}>
                        <TableHead>
                          <TableRow>
                            {filtered[0].map((cell, i) => (
                              <TableCell key={i} sx={{ fontWeight: "bold" }}>
                                {cell}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {filtered.slice(1).map((row, rIdx) => {
                            const studentNameIndex =
                              filtered[0].indexOf("StudentName");
                            const currentStudent = row[studentNameIndex]
                              ?.trim()
                              .toLowerCase();
                            const isSelected =
                              selectedStudent &&
                              currentStudent ===
                                selectedStudent.trim().toLowerCase();

                            return (
                              <TableRow key={rIdx}>
                                {row.map((cell, cIdx) => (
                                  <TableCell
                                    key={cIdx}
                                    sx={{
                                      backgroundColor: isSelected
                                        ? "#e0f7fa"
                                        : rIdx % 2 === 0
                                        ? "#f9f9f9"
                                        : "#ffffff",
                                      whiteSpace: "nowrap",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      fontFamily: "NotoSansLaoLooped",
                                    }}
                                  >
                                    {cell}
                                  </TableCell>
                                ))}
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                );
              })}
            </>
          )}
        </Box>
      )}
    </Container>
  );
}

export default SheetManagerC;

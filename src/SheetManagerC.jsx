import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
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
  Chip,
  Button,
  Alert,
  Snackbar,
  Skeleton,
  LinearProgress,
  Fade,
  Backdrop,
} from "@mui/material";
import { Delete, Refresh, Error as ErrorIcon } from "@mui/icons-material";
import { apisheet } from "./URL";

// Enhanced Skeleton Loader Component
const EnhancedSkeletonLoader = ({ loading, variant = "default" }) => {
  if (!loading) return null;

  if (variant === "table") {
    return (
      <Box sx={{ width: "100%", mt: 2 }}>
        <Skeleton variant="text" height={40} sx={{ mb: 2 }} />
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {[...Array(10)].map((_, idx) => (
                  <TableCell key={idx}>
                    <Skeleton variant="text" />
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {[...Array(5)].map((_, rowIdx) => (
                <TableRow key={rowIdx}>
                  {[...Array(10)].map((_, cellIdx) => (
                    <TableCell key={cellIdx}>
                      <Skeleton variant="text" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  }

  if (variant === "filters") {
    return (
      <Box sx={{ width: "100%", mb: 3 }}>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
          {[...Array(3)].map((_, idx) => (
            <Skeleton key={idx} variant="rectangular" height={56} width={200} />
          ))}
        </Box>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          {[...Array(3)].map((_, idx) => (
            <Skeleton key={idx} variant="text" width={180} height={30} />
          ))}
        </Box>
      </Box>
    );
  }

  return (
    <Backdrop
      sx={{ 
        color: '#fff', 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        flexDirection: 'column',
        gap: 2
      }}
      open={loading}
    >
      <CircularProgress size={60} />
      <Typography variant="h6" sx={{ fontFamily: "NotoSansLaoLooped" }}>
        ກຳລັງໂຫຼດຂໍ້ມູນ...
      </Typography>
    </Backdrop>
  );
};

// Loading Button Component
const LoadingButton = ({ loading, onClick, children, startIcon, color = "primary", variant = "contained", disabled = false, ...props }) => {
  return (
    <Button
      variant={variant}
      color={color}
      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : startIcon}
      onClick={onClick}
      disabled={loading || disabled}
      sx={{
        fontFamily: "NotoSansLaoLooped",
        textTransform: "none",
        position: "relative",
        ...props.sx
      }}
      {...props}
    >
      {loading ? "ກຳລັງດຳເນີນການ..." : children}
    </Button>
  );
};

// Progress Bar Component
const ProgressBar = ({ loading, message = "ກຳລັງໂຫຼດ..." }) => {
  if (!loading) return null;

  return (
    <Box sx={{ width: "100%", mb: 2 }}>
      <Typography variant="body2" sx={{ mb: 1, fontFamily: "NotoSansLaoLooped" }}>
        {message}
      </Typography>
      <LinearProgress />
    </Box>
  );
};

function SheetManagerC() {
  const [selectedId, setSelectedId] = useState(
    "1aY6ubcrUwE0Rnijuv13VG7Y4OMuJo1s0Zyaali63UlI"
  );
  const [allSheetData, setAllSheetData] = useState([]);

  const [filterSubject, setFilterSubject] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedeparment, setSelectedeparment] = useState("");

  const [showOnlySelectedStudent, setShowOnlySelectedStudent] = useState(true);
  const [showOnlyWithStatus, setShowOnlyWithStatus] = useState(false);
  const [showOnlyWithPayment, setShowOnlyWithPayment] = useState(false);

  const [subjectOptions, setSubjectOptions] = useState([]);
  const [studentOptions, setStudentOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  
  // Enhanced Loading States
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [clearingCache, setClearingCache] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [error, setError] = useState(null);
  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });
  
  useEffect(() => {
    handleSelectSpreadsheet(true);
  }, [selectedId]);

  const handleSelectSpreadsheet = async (isInitial = false) => {
    try {
      if (isInitial) {
        setInitialLoading(true);
        setLoadingMessage("ກຳລັງໂຫຼດຂໍ້ມູນເບື້ອງຕົ້ນ...");
      } else {
        setRefreshing(true);
        setLoadingMessage("ກຳລັງໂຫຼດຂໍ້ມູນໃໝ່...");
      }
      
      setLoading(true);
      setError(null);
      
      // Simulate network delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setLoadingMessage("ກຳລັງດຶງຂໍ້ມູນຈາກເຊີບເວີ...");
      
      const res = await fetch(`${apisheet}/all-sheet-data/${selectedId}`);

      if (!res.ok) {
        let errorMessage = "ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນ";
        if (res.status === 404) {
          errorMessage = "ບໍ່ພົບຂໍ້ມູນທີ່ຕ້ອງການ ກະລຸນາກວດສອບການເລືອກຂອງທ່ານ";
        } else if (res.status === 500) {
          errorMessage = "ເຊີບເວີມີບັນຫາ ກະລຸນາລອງໃໝ່ໃນພາຍຫຼັງ";
        }
        throw new Error(errorMessage);
      }

      setLoadingMessage("ກຳລັງປະມວນຜົນຂໍ້ມູນ...");
      
      const allData = await res.json();
      
      // Process data
      setLoadingMessage("ກຳລັງຈັດລຽງຂໍ້ມູນ...");
      
      setAllSheetData(allData);

      const subjects = new Set();
      const students = new Set();
      const departments = new Set();

      for (const sheet of allData) {
        const [header, ...rows] = sheet.data;
        const subIndex = header.indexOf("SubName");
        const stuIndex = header.indexOf("StudentName");
        const departmentx = header.indexOf("Departments");

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
          if (row[departmentx]) {
            departments.add(row[departmentx].trim());
          }
        });
      }

      setSubjectOptions([...subjects].sort());
      setStudentOptions([...students].sort());
      setDepartmentOptions([...departments].sort());
      
      setSnackbar({
        open: true,
        message: `ໂຫຼດຂໍ້ມູນສຳເລັດ: ${allData.length} ຊີດ`,
        severity: "success"
      });
      
    } catch (err) {
      console.error("Error loading spreadsheet data:", err);
      setError(err.message);
      setSnackbar({
        open: true,
        message: err.message,
        severity: "error"
      });
    } finally {
      setLoading(false);
      setInitialLoading(false);
      setRefreshing(false);
      setLoadingMessage("");
    }
  };

  const handleClearCache = async () => {
    try {
      setClearingCache(true);
      setLoadingMessage("ກຳລັງລບ cache...");
      
      const res = await fetch(`${apisheet}/clear-cache`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const result = await res.json();
      
      if (result.success) {
        setSnackbar({
          open: true,
          message: result.message || "ລບ cache ສຳເລັດແລ້ວ",
          severity: "success"
        });
        
        // โหลดข้อมูลใหม่ทันทีหลังจากลบแคช
        await handleSelectSpreadsheet();
      } else {
        throw new Error(result.message || "ລບ cache ບໍ່ສຳເລັດ");
      }
    } catch (err) {
      console.error("Error clearing cache:", err);
      setSnackbar({
        open: true,
        message: `ຜິດພາດໃນການລບ cache: ${err.message}`,
        severity: "error"
      });
    } finally {
      setClearingCache(false);
      setLoadingMessage("");
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
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

    if (selectedeparment) {
      const selecteddep = selectedeparment.replace(/\s/g, "").toLowerCase();
      if (showOnlySelectedStudent) {
        filtered = filtered.filter((row) => {
          const departmentName = row["Departments"]
            ?.replace(/\s/g, "")
            .toLowerCase();
          return departmentName === selecteddep;
        });
      } else {
        const hasDep = filtered.some((row) => {
          const departmentName = row["Departments"]
            ?.replace(/\s/g, "")
            .toLowerCase();
          return departmentName === selecteddep;
        });
        if (!hasDep) return [];
      }
    }

    if (filterSubject.length > 0) {
      filtered = filtered.filter((row) => {
        const rowSubjects = row["SubName"]
          ?.split("+")
          .map((s) => s.trim().toLowerCase()) || [];
        return filterSubject.some((selected) =>
          rowSubjects.includes(selected.toLowerCase())
        );
      });
    }

    if (!showOnlyWithStatus && !showOnlyWithPayment) {
      filtered = filtered.filter((row) => {
        const paid = row["paid"] || row["ຈ່າຍແລ້ວ"] || "";
        const status = row["status_academic"] || row["ສະຖານນະ"] || "";
        return !(paid && status);
      });
    }

    if (showOnlyWithStatus) {
      filtered = filtered.filter((row) => {
        const status = row["status_academic"] || row["ສະຖານນະ"] || "";
        return !!status;
      });
    }

    if (showOnlyWithPayment) {
      filtered = filtered.filter((row) => {
        const paid = row["paid"] || row["ຈ່າຍແລ້ວ"] || "";
        return !!paid;
      });
    }

    return [keys, ...filtered.map((rowObj) => keys.map((key) => rowObj[key]))];
  };

  // Show initial loading screen
  if (initialLoading) {
    return (
      <Container>
        <EnhancedSkeletonLoader loading={true} />
        <ProgressBar loading={true} message={loadingMessage} />
      </Container>
    );
  }

  // Show error state
  if (error && !loading) {
    return (
      <Container>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "50vh",
            gap: 2,
          }}
        >
          <ErrorIcon sx={{ fontSize: 60, color: "error.main" }} />
          <Typography variant="h6" sx={{ fontFamily: "NotoSansLaoLooped" }}>
            ເກີດຂໍ້ຜິດພາດ
          </Typography>
          <Typography variant="body1" sx={{ fontFamily: "NotoSansLaoLooped", textAlign: "center" }}>
            {error}
          </Typography>
          <LoadingButton
            loading={refreshing}
            onClick={() => handleSelectSpreadsheet()}
            startIcon={<Refresh />}
            color="primary"
          >
            ລອງໃໝ່
          </LoadingButton>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <ProgressBar loading={loading} message={loadingMessage} />
      
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
          <Fade in={!loading} timeout={500}>
            <Box sx={{ width: "100%" }}>
              <Typography
                fontFamily={"NotoSansLaoLooped"}
                variant="h6"
                gutterBottom
                sx={{ textAlign: "center" }}
              >
                🔍 ຕົວກ່ອງຂໍ້ມູນ
              </Typography>

              {/* Control Buttons */}
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 2,
                }}
              >
                <LoadingButton
                  loading={clearingCache}
                  onClick={handleClearCache}
                  startIcon={<Delete />}
                  color="warning"
                  disabled={loading}
                >
                  ລບ cache
                </LoadingButton>
                
                <LoadingButton
                  loading={refreshing}
                  onClick={() => handleSelectSpreadsheet()}
                  startIcon={<Refresh />}
                  color="primary"
                  variant="outlined"
                  disabled={loading}
                >
                  ໂຫຼດໃໝ່
                </LoadingButton>
              </Box>

              {/* Filters */}
              {loading ? (
                <EnhancedSkeletonLoader loading={true} variant="filters" />
              ) : (
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
                    options={departmentOptions}
                    value={selectedeparment}
                    onChange={(event, newValue) =>
                      setSelectedeparment(newValue || "")
                    }
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          variant="outlined"
                          label={option}
                          {...getTagProps({ index })}
                          sx={{ margin: 0.5 }}
                        />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="ເລືອກສາຂາວິຊາ"
                        variant="outlined"
                      />
                    )}
                    sx={{ minWidth: 160, maxWidth: 350, width: "100%" }}
                    clearOnEscape
                    loading={loading}
                    disabled={loading}
                    isOptionEqualToValue={(option, value) => option === value}
                  />
                  
                  <Autocomplete
                    multiple
                    options={subjectOptions}
                    value={filterSubject}
                    onChange={(event, newValue) => setFilterSubject(newValue || [])}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          variant="outlined"
                          label={option}
                          {...getTagProps({ index })}
                          sx={{ margin: 0.5 }}
                        />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="ວິຊາ (ເລືອກໄດ້ຫຼາຍ)"
                        variant="outlined"
                      />
                    )}
                    sx={{ minWidth: 160, maxWidth: 350, width: "100%" }}
                    clearOnEscape
                    loading={loading}
                    disabled={loading}
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
                    loading={loading}
                    disabled={loading}
                    isOptionEqualToValue={(option, value) => option === value}
                  />
                </Box>
              )}

              {/* Checkboxes */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 2,
                  flexWrap: "wrap",
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  mt: 2,
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={showOnlySelectedStudent}
                      onChange={(e) =>
                        setShowOnlySelectedStudent(e.target.checked)
                      }
                      disabled={loading}
                    />
                  }
                  label="ສະແດງແຕ່ນັກສຶກສາ ທີ່ເລືອກ"
                  sx={{ whiteSpace: "nowrap" }}
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={showOnlyWithStatus}
                      onChange={(e) =>
                        setShowOnlyWithStatus(e.target.checked)
                      }
                      disabled={loading}
                    />
                  }
                  label="ສະແດງແຕ່ຂໍ້ມູນທີ່ມີສະຖານນະວ່າຮຽນແລ້ວ"
                  sx={{ whiteSpace: "nowrap" }}
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={showOnlyWithPayment}
                      onChange={(e) =>
                        setShowOnlyWithPayment(e.target.checked)
                      }
                      disabled={loading}
                    />
                  }
                  label="ສະແດງແຕ່ຂໍ້ມູນທີ່ຈ່າຍແລ້ວ"
                  sx={{ whiteSpace: "nowrap" }}
                />
              </Box>

              <Typography variant="h6" gutterBottom sx={{ mt: 3, textAlign: "center" }}>
                📊 ຕາຕະລາງຂໍໍ່ມູນ
              </Typography>

              {loading ? (
                <EnhancedSkeletonLoader loading={true} variant="table" />
              ) : (
                allSheetData.map((sheet) => {
                  const filtered = filterData(sheet);
                  if (filtered.length <= 1) return null;

                  return (
                    <Fade key={sheet.sheetName} in={true} timeout={700}>
                      <Box mb={4} width="100%">
                        <Typography variant="subtitle1" gutterBottom>
                          📊 ວິຊາ "{sheet.sheetName}" (ຈຳນວນຄົນ {filtered.length - 1})
                        </Typography>

                        <TableContainer
                          component={Paper}
                          sx={{ 
                            overflowX: "auto", 
                            maxWidth: "100%",
                            boxShadow: 3,
                            borderRadius: 2
                          }}
                        >
                          <Table size="small" sx={{ minWidth: 600 }}>
                            <TableHead>
                              <TableRow
                                sx={{
                                  backgroundColor: "#f5f5f5",
                                  "& th": {
                                    fontFamily: "NotoSansLaoLooped",
                                    fontWeight: "bold",
                                    textAlign: "center",
                                    whiteSpace: "nowrap",
                                  },
                                }}
                              >
                                <TableCell sx={{ color: "black" }}>
                                  ລະຫັດນັກສຶກສາ
                                </TableCell>
                                <TableCell sx={{ color: "black" }}>
                                  ຊື່ ແລະ ນາມສະກຸນ
                                </TableCell>
                                <TableCell sx={{ color: "black" }}>ເບີໂທ</TableCell>
                                <TableCell sx={{ color: "black" }}>ວິຊາ</TableCell>
                                <TableCell sx={{ color: "black" }}>
                                  ສົກຮຽນທີ່ຈົບ
                                </TableCell>
                                <TableCell sx={{ color: "black" }}>ຊັ້ນປີ</TableCell>
                                <TableCell sx={{ color: "black" }}>ສາຂາ</TableCell>
                                <TableCell sx={{ color: "black" }}>ຄະແນນ</TableCell>
                                <TableCell sx={{ color: "black" }}>ຈ່າຍແລ້ວ</TableCell>
                                <TableCell sx={{ color: "black" }}>ສະຖານນະ</TableCell>
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
                                  <TableRow 
                                    key={rIdx}
                                    sx={{
                                      '&:hover': {
                                        backgroundColor: '#f0f0f0',
                                      },
                                    }}
                                  >
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
                                          color: "black",
                                          transition: "background-color 0.2s",
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
                    </Fade>
                  );
                })
              )}
            </Box>
          </Fade>
        )}
      </Box>

      {/* Enhanced Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ 
            width: '100%',
            fontFamily: "NotoSansLaoLooped"
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default SheetManagerC;
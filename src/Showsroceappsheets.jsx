import React, { useEffect, useState, useCallback } from "react";
import {
  Grid,
  TextField,
  Autocomplete,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Container,
  MenuItem,
  Select,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Box,
  Alert,
  Snackbar,
  Tooltip,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Fade,
  Divider,
} from "@mui/material";
import CachedIcon from "@mui/icons-material/Cached";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import SchoolIcon from "@mui/icons-material/School";
import PersonIcon from "@mui/icons-material/Person";
import GradeIcon from "@mui/icons-material/Grade";
import SkeletonLoaderComponent from "./loding/loading";
import { appsheets } from "./URL"; // Removed unused apisheet

const deps = [
  { id: 1, name: "ສາຂາວິຊາ ບໍລິຫານ ທຸລະກິດຕໍ່ເນື່ອງ" },
  { id: 2, name: "ສາຂາວິຊາ ການຄ້າເອເລັກໂຕນິກ (ຄອມພິວເຕອທຸລະກິດ)" },
  { id: 3, name: "ສາຂາວິຊາ ຜູ້ປະກອບການ" },
  { id: 4, name: "ສາຂາວິຊາ ພາສາອັງກິດ" },
  { id: 5, name: "ສາຂາວິຊາ ວິຊະວະກຳຊອບແວ" },
  { id: 6, name: "ສາຂາວິຊາ ບໍລິຫານ ທຸລະກິດ" },
  { id: 7, name: "ສາຂາວິຊາ ພາສາອັງກິດຕໍ່ເນື່ອງ" },
];

export default function StudentSearchApp() {
  // --- State Definitions ---
  const [allData, setAllData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    department_id: "",
    classroom_id: "",
    student: "",
    score: "",
  });

  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [showWithScore, setShowWithScore] = useState(true);
  const [showWithoutScore, setShowWithoutScore] = useState(false);

  const [errorMessages, setErrorMessages] = useState({
    department: "",
    classroom: "",
    student: "",
    general: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // --- Callback Functions for Performance ---

  const showSnackbar = useCallback((message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const handleCloseSnackbar = useCallback((event, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  const fetchAllData = useCallback(async () => {
    try {
      const res = await fetch(`${appsheets}`);
      const data = await res.json();

      if (data.success && data.sheets) {
        const sheets = data.sheets || [];
        setAllData(sheets);

        const allStudentsData = sheets.flatMap((sheet) => sheet.students);
        const depSet = new Set();
        const clsSet = new Set();

        allStudentsData.forEach((s) => {
          if (s.department_id) depSet.add(Number(s.department_id));
          if (s.classroom_id)
            clsSet.add(`${s.department_id}|${s.classroom_id}`);
        });

        const filteredDeps = deps
          .filter((dep) => depSet.has(dep.id))
          .map((dep) => ({ department_id: dep.id, name: dep.name }));

        setDepartments(filteredDeps);
        setClassrooms([...clsSet]);
        showSnackbar("ໂຫລດຂໍ້ມູນສຳເລັດ", "success");
      } else {
        throw new Error("ຂໍ້ມູນບໍ່ຖືກຕ້ອງ");
      }
    } catch (err) {
      console.error("ໂຫລດຂໍ້ມູນບໍ່ໄດ້", err);
      setErrorMessages((prev) => ({
        ...prev,
        general: "ບໍ່ສາມາດໂຫລດຂໍ້ມູນຫຼັກໄດ້, ກະລຸນາລອງໃໝ່ອີກຄັ້ງ.",
      }));
      showSnackbar("ໂຫລດຂໍ້ມູນບໍ່ສຳເລັດ", "error");
    } finally {
      setLoading(false);
    }
  }, [showSnackbar]);

  const clearCache = useCallback(async () => {
    setLoading(true);
    try {
      refreshData();
      showSnackbar("ລ້າງ Cache ສຳເລັດ, ກำລังໂຫລດຂໍ້ມູນໃໝ່...", "success");
      await fetchAllData(); // Use fetchAllData instead of undefined loadData
    } catch (error) {
      console.error("Error clearing cache:", error);
      showSnackbar("ການລ້າງ Cache ຜິດພາດ", "error");
    } finally {
      setLoading(false);
    }
  }, [fetchAllData, showSnackbar]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  useEffect(() => {
    if (!filters.department_id || !filters.classroom_id) {
      setStudents([]);
      setSubjects([]);
      return;
    }

    const currentStudents = [];
    const subjSet = new Set();
    allData.forEach((sheet) => {
      sheet.students.forEach((student) => {
        if (
          String(student.department_id) === String(filters.department_id) &&
          String(student.classroom_id) === String(filters.classroom_id)
        ) {
          currentStudents.push(student.name);
          student.subjects.forEach((subj) => subjSet.add(subj.subject_name));
        }
      });
    });

    setStudents(currentStudents);
    setSubjects([...subjSet]);
  }, [filters.department_id, filters.classroom_id, allData]);

  const refreshData = () => {
    setLoading(true);
    setAllData([]);
    setFilteredStudents([]);
    setSearchPerformed(false);
    setFilters({ department_id: "", classroom_id: "", student: "", score: "" });
    setSelectedSubjects([]);
    setErrorMessages({
      department: "",
      classroom: "",
      student: "",
      general: "",
    });
  };

  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };

    if (field === "department_id") {
      newFilters.classroom_id = "";
      newFilters.student = "";
      setStudents([]);
      setSubjects([]);
      setFilteredStudents([]);
      setSearchPerformed(false);
      setErrorMessages((prev) => ({ ...prev, classroom: "", student: "" }));
    }
    if (field === "classroom_id") {
      newFilters.student = "";
      setStudents([]);
      setFilteredStudents([]);
      setSearchPerformed(false);
      setErrorMessages((prev) => ({ ...prev, student: "" }));
    }
    if (field === "student") {
      setFilteredStudents([]);
      setSearchPerformed(false);
    }

    setFilters(newFilters);
    if (value) setErrorMessages((prev) => ({ ...prev, [field]: "" }));
  };

  const validateInputs = () => {
    let valid = true;
    const newErrors = { department: "", classroom: "", student: "" };
    if (!filters.department_id) {
      newErrors.department = "ກະລຸນາເລືອກສາຂາວິຊາ.";
      valid = false;
    }
    if (!filters.classroom_id) {
      newErrors.classroom = "ກະລຸນາເລືອກຫ້ອງ.";
      valid = false;
    }
    if (!filters.student || filters.student.trim() === "") {
      newErrors.student = "ກະລຸນາເລືອກ ຫຼື ພິມຊື່ນັກຮຽນ.";
      valid = false;
    }
    setErrorMessages(newErrors);
    return valid;
  };

  const handleSearch = () => {
    if (!validateInputs()) {
      showSnackbar("ກະລຸນາຕື່ມຂໍ້ມູນໃຫ້ຄົບຖ້ວນ", "warning");
      return;
    }
    setSearchPerformed(true);

    const result = allData.flatMap((sheet) =>
      sheet.students
        .filter((student) => {
          const studentName = (student.name || "").toLowerCase().trim();
          const searchName = (filters.student || "").toLowerCase().trim();
          return (
            String(student.department_id) === String(filters.department_id) &&
            String(student.classroom_id) === String(filters.classroom_id) &&
            (studentName.includes(searchName) ||
              searchName.includes(studentName))
          );
        })
        .map((student) => ({
          ...student,
          subjects: student.subjects.filter((subject) => {
            const subjectName = subject.subject_name.toLowerCase();

            const hasScore =
              subject.score !== "" &&
              subject.score !== "ຍັງບໍ່ມີຄະແນນ" &&
              subject.grade !== "" &&
              subject.grade !== "ຍັງບໍ່ມີຄະແນນ";
            const matchCheckbox =
              (hasScore && showWithScore) || (!hasScore && showWithoutScore);
            const matchSubject =
              selectedSubjects.length === 0 ||
              selectedSubjects.some((sel) =>
                subjectName.includes(sel.toLowerCase())
              );
            const matchScore =
              !filters.score ||
              filters.score
                .split(",")
                .some((s) =>
                  String(subject.score)
                    .toUpperCase()
                    .includes(s.trim().toUpperCase())
                );
            return matchCheckbox && matchSubject && matchScore;
          }),
        }))
        .filter((student) => student.subjects.length > 0)
    );

    setFilteredStudents(result);
    if (result.length > 0) {
      showSnackbar(`ພົບຂໍ້ມູນ ${result.length} ລາຍການ`, "success");
    } else {
      showSnackbar("ບໍ່ພົບຂໍ້ມູນຕາມເງື່ອນໄຂທີ່ຄົ້ນຫາ", "info");
    }
  };

  const handleScoreChange = (e) => {
    let value = e.target.value.toUpperCase().replace(/\s+/g, "");

    // แยกตัวอักษรโดยไม่เอา ,
    const rawChars = value.replace(/,/g, "").split("");

    // กรองเฉพาะ 1-4 และ I
    const validChars = rawChars.filter((char) =>
      ["1", "2", "3", "4", "I"].includes(char)
    );

    // สร้าง string ใหม่พร้อมใส่ , ทุกตัว
    const formatted = validChars.join(",");

    setFilters({ ...filters, score: formatted });
  };

  const getAvailableClassrooms = () => {
    if (!filters.department_id) return [];
    const available = classrooms
      .filter((key) => key.startsWith(filters.department_id + "|"))
      .map((key) => key.split("|")[1])
      .sort((a, b) => a - b);
    return [...new Set(available)]; // Ensure unique values
  };

  // Helper function to render student info card
  const renderStudentInfoCard = (student, index) => {
    // Calculate grade statistics
    const validSubjects = student.subjects.filter(
      (subject) =>
        subject.score !== "" &&
        subject.score !== "ຍັງບໍ່ມີຄະແນນ" &&
        subject.score !== "I" &&
        subject.grade !== "" &&
        subject.grade !== "ຍັງບໍ່ມີຄະແນນ" &&
        subject.grade !== "I"
    );

    const incompleteSubjects = student.subjects.filter(
      (subject) => subject.score === "I" || subject.grade === "I"
    );

    // Count letter grades
    const gradeCount = validSubjects.reduce((acc, subject) => {
      const grade = subject.grade;
      acc[grade] = (acc[grade] || 0) + 1;
      return acc;
    }, {});

    // Calculate numerical average
    const numericalScores = validSubjects
      .map((subject) => parseFloat(subject.score))
      .filter((score) => !isNaN(score));

    const averageScore =
      numericalScores.length > 0
        ? (
            numericalScores.reduce((sum, score) => sum + score, 0) /
            numericalScores.length
          ).toFixed(2)
        : 0;

    // Get highest and lowest scores
    const highestScore =
      numericalScores.length > 0 ? Math.max(...numericalScores) : 0;
    const lowestScore =
      numericalScores.length > 0 ? Math.min(...numericalScores) : 0;

    return (
      <Card key={`student-info-${index}`} sx={{ mb: 3, boxShadow: 3 }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mb: 2,
            }}
          >
            <PersonIcon color="primary" sx={{ fontSize: 40 }} />
            <Typography variant="h5" color="primary">
              ຂໍ້ມູນນັກສຶກສາ
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />

          {/* Basic Student Info */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6">
                <strong>ຊື່: </strong>
                {student.name}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6">
                <strong>ຫ້ອງຮຽນ: </strong>
                {student.classroom_id}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6">
                <strong>ສາຂາວິຊາ: </strong>
                {deps.find((dep) => String(dep.id) === student.department_id)
                  ?.name || "ບໍ່ພົບຂໍ້ມູນ"}
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ mb: 2 }} />

          {/* Grade Statistics Section */}
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="h6"
              color="primary"
              sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
            >
              <GradeIcon />
              ສະຫຼຸບຜົນການຮຽນ
            </Typography>

            <Grid container spacing={3}>
              {/* Numerical Statistics */}
              <Grid item xs={12} md={6}>
                <Card
                  variant="outlined"
                  sx={{ p: 2, backgroundColor: "#f8f9fa", color: "black" }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    sx={{ mb: 1 }}
                  >
                    ສະຖິຕິຄະແນນຕົວເລກ:
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    <Typography>
                      <strong>ຄະແນນສະເລ່ຍ:</strong>{" "}
                      <Chip label={averageScore} color="primary" size="small" />
                    </Typography>
                    <Typography>
                      <strong>ຄະແນນສູງສຸດ:</strong>{" "}
                      <Chip label={highestScore} color="success" size="small" />
                    </Typography>
                    <Typography>
                      <strong>ຄະແນນຕ່ຳສຸດ:</strong>{" "}
                      <Chip label={lowestScore} color="warning" size="small" />
                    </Typography>
                    <Typography>
                      <strong>ວິຊາທີ່ມີຄະແນນ:</strong>{" "}
                      <Chip
                        label={validSubjects.length}
                        color="info"
                        size="small"
                      />
                    </Typography>
                    {incompleteSubjects.length > 0 && (
                      <Typography>
                        <strong>ວິຊາທີ່ຍັງບໍ່ສໍາເລັດ (I):</strong>{" "}
                        <Chip
                          label={incompleteSubjects.length}
                          color="error"
                          size="small"
                        />
                      </Typography>
                    )}
                  </Box>
                </Card>
              </Grid>

              {/* Letter Grade Distribution */}
              <Grid item xs={12} md={6}>
                <Card
                  variant="outlined"
                  sx={{ p: 2, backgroundColor: "#f8f9fa", color: "black" }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    sx={{ mb: 1 }}
                  >
                    ການແຈກຢາຍເກດ:
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {Object.entries(gradeCount)
                      .sort(([a], [b]) => {
                        const gradeOrder = {
                          A: 1,
                          "B+": 2,
                          B: 3,
                          "C+": 4,
                          C: 5,
                          "D+": 6,
                          D: 7,
                          F: 8,
                        };
                        return (gradeOrder[a] || 9) - (gradeOrder[b] || 9);
                      })
                      .map(([grade, count]) => {
                        let chipColor = "default";
                        if (grade === "A") chipColor = "success";
                        else if (grade.startsWith("B")) chipColor = "primary";
                        else if (grade.startsWith("C")) chipColor = "warning";
                        else if (grade.startsWith("D") || grade === "F")
                          chipColor = "error";

                        return (
                          <Chip
                            key={grade}
                            label={`${grade}: ${count}`}
                            color={chipColor}
                            variant="outlined"
                            size="small"
                          />
                        );
                      })}
                  </Box>

                  {/* Show incomplete subjects if any */}
                  {incompleteSubjects.length > 0 && (
                    <Box sx={{ mt: 1 }}>
                      <Chip
                        label={`I: ${incompleteSubjects.length}`}
                        color="error"
                        variant="filled"
                        size="small"
                      />
                    </Box>
                  )}
                </Card>
              </Grid>

              {/* Overall Performance Indicator */}
              <Grid item xs={12}>
                <Card
                  variant="outlined"
                  sx={{ p: 2, backgroundColor: "#e8f5e8", color: "black" }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    sx={{ mb: 1 }}
                  >
                    ການປະເມີນໂດຍລວມ:
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      flexWrap: "wrap",
                    }}
                  >
                    <Chip
                      label={
                        averageScore >= 3.5
                          ? "ດີເລີດ"
                          : averageScore >= 3.0
                            ? "ດີ"
                            : averageScore >= 2.5
                              ? "ປານກາງ"
                              : averageScore >= 2.0
                                ? "ຜ່ານ"
                                : "ຕ້ອງປັບປຸງ"
                      }
                      color={
                        averageScore >= 3.5
                          ? "success"
                          : averageScore >= 3.0
                            ? "primary"
                            : averageScore >= 2.5
                              ? "warning"
                              : averageScore >= 2.0
                                ? "info"
                                : "error"
                      }
                      sx={{ fontWeight: "bold" }}
                    />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ color: "black" }}
                    >
                      ຈາກທັງໝົດ {student.subjects.length} ວິຊາ
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    );
  };

  // --- JSX Rendering ---
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <SkeletonLoaderComponent loading={loading} />

      {errorMessages.general && (
        <Fade in={!!errorMessages.general}>
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {errorMessages.general}
          </Alert>
        </Fade>
      )}

      {allData.length > 0 && !loading && (
        <>
          {/* Header */}
          <Card
            sx={{
              mb: 4,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <SchoolIcon sx={{ fontSize: 40, color: "white" }} />
                  <Typography
                    variant="h4"
                    component="h1"
                    sx={{ color: "white", fontWeight: "bold" }}
                  >
                    ຄົ້ນຫາຄະແນນນັກສຶກສາ
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", gap: 2 }}>
                  <Tooltip title="ລ້າງຂໍ້ມູນທັງໝົດ">
                    <Button
                      variant="outlined"
                      color="inherit"
                      onClick={refreshData}
                      startIcon={<ClearIcon />}
                      sx={{
                        color: "white",
                        borderColor: "white",
                        "&:hover": {
                          borderColor: "white",
                          backgroundColor: "rgba(255,255,255,0.1)",
                        },
                      }}
                    >
                      ລ້າງ
                    </Button>
                  </Tooltip>

                  <Tooltip title="ດືງຂໍ້ມູນອັບເດດໃໝ່">
                    <Button
                      variant="contained"
                      onClick={clearCache}
                      startIcon={<CachedIcon />}
                      disabled={loading}
                      sx={{
                        backgroundColor: "white",
                        color: "#667eea",
                        "&:hover": { backgroundColor: "rgba(255,255,255,0.9)" },
                      }}
                    >
                      ອັບເດດ
                    </Button>
                  </Tooltip>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Search Filters */}
          <Card sx={{ mb: 4, boxShadow: 3 }}>
            <CardContent>
              <Typography
                variant="h6"
                sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}
              >
                <SearchIcon color="primary" />
                ຕົວກອງການຄົ້ນຫາ
              </Typography>

              <Grid container spacing={3}>
                {/* Field 1: สาขาวิชา */}
                <Grid item xs={12}>
                  <FormControl
                    fullWidth
                    sx={{ minWidth: 300 }}
                    error={!!errorMessages.department}
                  >
                    <InputLabel>ສາຂາວິຊາ</InputLabel>
                    <Select
                      value={filters.department_id}
                      onChange={(e) =>
                        handleFilterChange(
                          "department_id",
                          String(e.target.value)
                        )
                      }
                      label="ສາຂາວິຊາ"
                    >
                      <MenuItem value="">-- ເລືອກສາຂາວິຊາ --</MenuItem>
                      {departments.map((dep) => (
                        <MenuItem
                          key={dep.department_id}
                          value={dep.department_id}
                        >
                          {dep.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errorMessages.department && (
                      <Typography
                        color="error"
                        variant="caption"
                        sx={{ mt: 1 }}
                      >
                        {errorMessages.department}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>

                {/* Field 2: ຫ້ອງ */}
                <Grid item xs={12}>
                  <FormControl
                    fullWidth
                    sx={{ minWidth: 170 }}
                    error={!!errorMessages.classroom}
                  >
                    <InputLabel>ຫ້ອງ</InputLabel>
                    <Select
                      value={filters.classroom_id}
                      onChange={(e) =>
                        handleFilterChange(
                          "classroom_id",
                          String(e.target.value)
                        )
                      }
                      disabled={!filters.department_id}
                      label="ຫ້ອງ"
                    >
                      <MenuItem value="">-- ເລືອກຫ້ອງ --</MenuItem>
                      {getAvailableClassrooms().map((cls) => (
                        <MenuItem key={cls} value={cls}>
                          ຫ້ອງ {cls}
                        </MenuItem>
                      ))}
                    </Select>
                    {errorMessages.classroom && (
                      <Typography
                        color="error"
                        variant="caption"
                        sx={{ mt: 1 }}
                      >
                        {errorMessages.classroom}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>

                {/* Field 3: ຊື່ນັກສຶກສາ */}
                <Grid item xs={12}>
                  <Autocomplete
                    sx={{ minWidth: 300 }}
                    freeSolo
                    options={students}
                    value={filters.student}
                    onInputChange={(event, newValue) =>
                      handleFilterChange("student", newValue || "")
                    }
                    disabled={!filters.classroom_id}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="ຊື່ນັກສຶກສາ"
                        error={!!errorMessages.student}
                        helperText={errorMessages.student}
                      />
                    )}
                  />
                </Grid>

                {/* Field 4: ຄະແນນ */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="ຄະແນນ"
                    placeholder="0,1,2,3,4,I"
                    value={filters.score}
                    onChange={handleScoreChange}
                    disabled={!filters.student}
                    helperText="ບໍ່ບັງຄັບ"
                  />
                </Grid>

                {/* Button: ຄົ້ນຫາ */}
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={handleSearch}
                    disabled={
                      !filters.student || (!showWithScore && !showWithoutScore)
                    }
                    startIcon={<SearchIcon />}
                    sx={{ height: "56px" }}
                  >
                    ຄົ້ນຫາ
                  </Button>
                </Grid>
              </Grid>

              <Box sx={{ mt: 3 }}>
                <Autocomplete
                  multiple
                  freeSolo
                  options={subjects}
                  value={selectedSubjects}
                  inputValue={inputValue}
                  onInputChange={(e, newIn) => setInputValue(newIn)}
                  onChange={(e, newV) => setSelectedSubjects(newV)}
                  disabled={!filters.student}
                  renderTags={(val, getTagProps) =>
                    val.map((opt, idx) => (
                      <Chip
                        variant="outlined"
                        label={opt}
                        {...getTagProps({ index: idx })}
                        key={idx}
                        sx={{ m: 0.5 }}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="ວິຊາ (ບໍ່ບັງຄັບ)"
                      placeholder="ເລືອກວິຊາ"
                    />
                  )}
                />
              </Box>

              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  ຕົວເລືອກການສະແດງຜົນ:
                </Typography>
                <FormGroup row>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={showWithScore}
                        onChange={(e) => setShowWithScore(e.target.checked)}
                        disabled={!filters.student}
                      />
                    }
                    label="ສະແດງວິຊາທີ່ມີຄະແນນ"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={showWithoutScore}
                        onChange={(e) => setShowWithoutScore(e.target.checked)}
                        disabled={!filters.student}
                      />
                    }
                    label="ສະແດງວິຊາທີ່ບໍ່ມີຄະແນນ"
                  />
                </FormGroup>
              </Box>
            </CardContent>
          </Card>

          {/* Search Results */}
          {searchPerformed && (
            <Fade in={searchPerformed}>
              <div>
                {filteredStudents.length > 0 ? (
                  <>
                    {/* Student Info Card */}
                    {filteredStudents
                      .slice(0, 1)
                      .map((student, i) => renderStudentInfoCard(student, i))}

                    {/* Scores Table */}
                    <Card component={Paper} sx={{ boxShadow: 3 }}>
                      <CardContent>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            mb: 2,
                          }}
                        >
                          <GradeIcon color="primary" sx={{ fontSize: 40 }} />
                          <Typography variant="h5" color="primary">
                            ຕາຕະລາງຄະແນນ
                          </Typography>
                        </Box>
                        <Divider sx={{ mb: 2 }} />
                        <TableContainer>
                          <Table>
                            <TableHead>
                              <TableRow sx={{ backgroundColor: "#1976d2" }}>
                                <TableCell
                                  align="center"
                                  sx={{ fontWeight: "bold", color: "black" }}
                                >
                                  ລ/ດ
                                </TableCell>
                                <TableCell
                                  align="left"
                                  sx={{ fontWeight: "bold", color: "black" }}
                                >
                                  ຊື່ວິຊາ
                                </TableCell>
                                <TableCell
                                  align="center"
                                  sx={{ fontWeight: "bold", color: "black" }}
                                >
                                  ຄະແນນ
                                </TableCell>
                                <TableCell
                                  align="center"
                                  sx={{ fontWeight: "bold", color: "black" }}
                                >
                                  Grade
                                </TableCell>
                                <TableCell
                                  align="left"
                                  sx={{ fontWeight: "bold", color: "black" }}
                                >
                                  ອາຈານ
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {filteredStudents
                                .flatMap((student) => student.subjects)
                                .map((subject, j) => (
                                  <TableRow
                                    key={`subject-${j}`}
                                    sx={{
                                      "&:nth-of-type(odd)": {
                                        backgroundColor: "#f5f5f5",
                                      },
                                    }}
                                  >
                                    <TableCell align="center">
                                      {j + 1}
                                    </TableCell>
                                    <TableCell align="left">
                                      {subject.subject_name}
                                    </TableCell>
                                    <TableCell align="center">
                                      <Chip
                                        label={
                                          subject.score === "" ||
                                          subject.score === "ຍັງບໍ່ມີຄະແນນ"
                                            ? "ຍັງບໍ່ມີຄະແນນ"
                                            : subject.score
                                        }
                                        color={
                                          subject.score === "" ||
                                          subject.score === "ຍັງບໍ່ມີຄະແນນ"
                                            ? "default"
                                            : "primary"
                                        }
                                        variant={
                                          subject.score === "" ||
                                          subject.score === "ຍັງບໍ່ມີຄະແນນ"
                                            ? "outlined"
                                            : "filled"
                                        }
                                      />
                                    </TableCell>
                                    <TableCell align="center">
                                      <Chip
                                        label={
                                          subject.grade === "" ||
                                          subject.grade === "ຍັງບໍ່ມີຄະແນນ"
                                            ? "ຍັງບໍ່ມີຄະແນນ"
                                            : subject.grade
                                        }
                                        color={
                                          subject.grade === "" ||
                                          subject.grade === "ຍັງບໍ່ມີຄະແນນ"
                                            ? "default"
                                            : "secondary"
                                        }
                                        variant={
                                          subject.grade === "" ||
                                          subject.grade === "ຍັງບໍ່ມີຄະແນນ"
                                            ? "outlined"
                                            : "filled"
                                        }
                                      />
                                    </TableCell>
                                    <TableCell align="left">
                                      {subject.teacher_name || "ບໍ່ລະບຸ"}
                                    </TableCell>
                                  </TableRow>
                                ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    ບໍ່ພົບຂໍ້ມູນຕາມເງື່ອນໄຂທີ່ຄົ້ນຫາ -
                    ກະລຸນາຕົວດສອບການປ້ອນຂໍ້ມູນຄືນໃໝ່
                  </Alert>
                )}
              </div>
            </Fade>
          )}
        </>
      )}

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

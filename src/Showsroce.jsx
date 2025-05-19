import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Grid,
  MenuItem,
  Select,
  TextField,
  Chip,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Container,
  Autocomplete,
  Box,
  Typography,
  Tooltip,
  IconButton,
  Popover,
} from "@mui/material";
import "./Aexport.css";
import { apisroot } from "./URL";
import YourComponent from "./YourComponent";
import "./Cssscore.css";
export default function StudentSearchExport() {
  const [departments, setDepartments] = useState([]);
  const [classroom, setClassroom] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [filters, setFilters] = useState({
    department_id: "",
    student: "",
    subject: "",
    score: "",
    classrooms: "", // ✅ แก้จาก classroms → classrooms
  });

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [error, setError] = useState({});
  //****************************** */
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${apisroot}/departments`)
      .then((res) => setDepartments(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (filters.department_id) {
      setLoading(true);
      axios
        .get(`${apisroot}/classrooms`, {
          params: { department_id: filters.department_id },
        })
        .then((res) => setClassroom(res.data.map((s) => s.room_number)))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [filters.department_id]);

  useEffect(() => {
    if (filters.department_id && filters.classrooms) {
      setLoading(true);
      axios
        .get(`${apisroot}/api/department-data`, {
          params: {
            department_id: filters.department_id,
            classroms: filters.classrooms,
          },
        })
        .then((res) => {
          setStudents(res.data.students.map((s) => s.name));
          setSubjects(res.data.subjects.map((s) => s.name));
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [filters.department_id, filters.classrooms]);

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      subject: selectedSubjects.join(","),
    }));
  }, [selectedSubjects]);

  const handleSearch = () => {
    setLoading(true);
    axios
      .get(`${apisroot}/api/students`, { params: filters })
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  };

  const handleKeyDownS = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleKey();
    }
  };

  const handleKey = () => {
    const newError = {};

    if (!filters.department_id) newError.department_id = true;
    if (!filters.classrooms) newError.classroms = true;
    if (!filters.student) newError.student = true;

    setError(newError);

    if (Object.keys(newError).length === 0) {
      handleSearch(); // ✅ ไปค้นหา
    }
  };
  const allowedValues = ["0", "1", "2", "3", "4", "I"];

  const handleScoreChange = (e) => {
    const input = e.nativeEvent.data?.toUpperCase(); // ตรวจเฉพาะ key ที่กด
    if (!input) {
      // กรณีลบ
      setFilters({ ...filters, score: e.target.value.toUpperCase() });
      return;
    }

    // ตรวจว่า input อยู่ใน allowed
    if (!allowedValues.includes(input)) {
      return;
    }

    let current = filters.score;

    if (current === "") {
      // ตัวแรกไม่ต้องใส่ ,
      current = input;
    } else if (current.endsWith(",")) {
      // ถ้าตัวสุดท้ายเป็น , ให้ใส่ค่าที่กดไปเลย
      current += input;
    } else {
      // ตัวต่อไป → ใส่ , ก่อนตามด้วยค่าที่กด
      current += `,${input}`;
    }

    setFilters({ ...filters, score: current });
  };

  return (
    <Container
      maxWidth="lg"
      sx={{ mt: 4, background: "rgba(146, 142, 142, 0.1)" }}
    >
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Typography
          sx={{ fontSize: "24px", fontWeight: "bold" }}
          fontFamily={"NotoSansLaoLooped"}
        >
          Search Scores
        </Typography>
      </Box>
      <Grid
        container
        spacing={2}
        mt={2}
        sx={{ display: "flex", justifyContent: "center" }}
      >
        <Grid item xs={12} md={4}>
          <Select
            fullWidth
            value={filters.department_id}
            onChange={(e) => {
              setFilters({
                ...filters,
                department_id: e.target.value,
                classrooms: "",
                student: "",
                subject: "",
                score: "",
              });
              setData([]);
              setError({ ...error, department_id: false });
            }}
            displayEmpty
            error={error.department_id}
            sx={{ width: "300px" }}
          >
            <MenuItem value="">-- Select Department --</MenuItem>
            {departments.map((dep) => (
              <MenuItem key={dep.department_id} value={dep.department_id}>
                {dep.name}
              </MenuItem>
            ))}
          </Select>
        </Grid>

        <YourComponent
          classroom={classroom}
          filters={filters}
          setFilters={setFilters}
          error={error}
          setError={setError}
        />

        <Grid item xs={12} md={4}>
          <Autocomplete
            freeSolo
            fullWidth
            options={students}
            value={filters.student || ""}
            onInputChange={(event, newValue) => {
              setFilters({ ...filters, student: newValue });
              setData([]);
              setError({ ...error, student: false });
            }}
            sx={{ width: "300px", fontFamily: "NotoSansLaoLooped" }} // ✅ ที่นี่
            renderInput={(params) => (
              <TextField
                fullWidth
                {...params}
                label="Student"
                error={error.student}
                helperText={error.student ? "Please select a student" : ""}
                onKeyDown={handleKeyDownS}
                sx={{ fontFamily: "NotoSansLaoLooped" }} // ✅ และที่นี่
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Autocomplete
            multiple
            freeSolo
            fullWidth
            options={subjects}
            value={selectedSubjects}
            onChange={(event, newValue) => {
              setSelectedSubjects(newValue);
              setData([]);
            }}
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
            sx={{ width: "300px" }}
            renderInput={(params) => (
              <TextField
                fullWidth
                {...params}
                label="ວິຊາ"
                placeholder="ເລືອກ ວິຊາ"
                onKeyDown={(e) => {
                  if (
                    (e.key === "Enter" || e.key === ",") &&
                    inputValue.trim()
                  ) {
                    e.preventDefault();
                    if (!selectedSubjects.includes(inputValue.trim())) {
                      setSelectedSubjects([
                        ...selectedSubjects,
                        inputValue.trim(),
                      ]);
                      setInputValue("");
                    }
                  }
                }}
                onChange={(e) => setInputValue(e.target.value)}
                value={inputValue}
              />
            )}
          />
          <input
            type="hidden"
            name="subject"
            value={selectedSubjects.join(",")}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            sx={{ fontFamily: "NotoSansLaoLooped", width: "300px" }}
            label="Score"
            placeholder="0,1,2,3,4,I"
            value={filters.score}
            onChange={handleScoreChange}
          />
        </Grid>

        <Grid
          item
          xs={12}
          md={4}
          sx={{ display: "flex", justifyContent: "center", mt: 2 }}
        >
          <Button variant="contained" onClick={handleKey}>
            Search
          </Button>
        </Grid>
      </Grid>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ mt: 4, mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">NO.</TableCell>
                <TableCell align="center">Subject</TableCell>
                <TableCell align="center">Score</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, i) => (
                <TableRow key={i}>
                  <TableCell align="center">{i + 1}</TableCell>
                  <TableCell>{row?.SubName ?? "-"}</TableCell>
                  <TableCell>{row?.score ?? "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}

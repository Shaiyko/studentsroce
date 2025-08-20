import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import SkeletonLoaderComponent from "./loding/loading.jsx";

const deps = [
  {
    id: 1,
    name: "ສາຂາການບໍລິຫານສາຂາວິຊາ ບໍລິຫານ ທຸລະກິດຕໍ່ເນື່ອງ",
  },
  {
    id: 2,
    name: "ສາຂາວິຊາ ການຄ້າເອເລັກໂຕນິກ (ຄອມພິວເຕອທຸລະກິດ)",
  },
  {
    id: 3,
    name: "ສາຂາວິຊາ ຜູ້ປະກອບການ",
  },
  {
    id: 4,
    name: "ສາຂາວິຊາ ພາສາອັງກິດ",
  },
  {
    id: 5,
    name: "ສາຂາວິຊາ ວິຊະວະກຳຊອບແວ",
  },
  {
    id: 6,
    name: "ສາຂາວິຊາ ບໍລິຫານ ທຸລະກິດ",
  },
  {
    id: 7,
    name: "ສາຂາວິຊາ ພາສາອັງກິດຕໍ່ເນື່ອງ",
  },
];

export default function StudentSearchWithChips() {
  const [allData, setAllData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [filters, setFilters] = useState({
    department_id: "",
    classroom_id: "",
    student: "",
    score: "",
  });
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [showWithScore, setShowWithScore] = useState(true);
  const [showWithoutScore, setShowWithoutScore] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:4002/from-sheet-all")
      .then((res) => res.json())
      .then((data) => {
        const sheets = data.sheets || [];
        setAllData(sheets);

        const allStudents = sheets.flatMap((sheet) => sheet.students);
        const depSet = new Set();
        const clsSet = new Set();

        allStudents.forEach((s) => {
          if (s.department_id) depSet.add(Number(s.department_id));
          if (s.classroom_id)
            clsSet.add(`${s.department_id}|${s.classroom_id}`);
        });

        const filteredDeps = deps
          .filter((dep) => depSet.has(dep.id))
          .map((dep) => ({ department_id: dep.id, name: dep.name }));
        setDepartments(filteredDeps);
        setClassrooms([...clsSet]);
        setLoading(false);
      })
      .catch((err) => {
        console.error("โหลดข้อมูลล้มเหลว", err);
        setLoading(false);
      });
  }, []);
  useEffect(() => {
    if (!filters.department_id || !filters.classroom_id) {
      setStudents([]);
      setSubjects([]);
      return;
    }

    const filteredStudents = [];
    const subjSet = new Set();

    allData.forEach((sheet) => {
      sheet.students.forEach((student) => {
        if (
          String(student.department_id) === String(filters.department_id) &&
          String(student.classroom_id) === String(filters.classroom_id)
        ) {
          filteredStudents.push(student.name);
          student.subjects.forEach((subj) => subjSet.add(subj.subject_name));
        }
      });
    });

    setStudents(filteredStudents);
    setSubjects([...subjSet]);
  }, [filters.department_id, filters.classroom_id, allData]);

  const getAvailableClassrooms = () => {
    return classrooms
      .filter((key) => key.startsWith(filters.department_id + "|"))
      .map((key) => key.split("|")[1]);
  };

  useEffect(() => {
    handleSearch();
  }, [showWithScore, showWithoutScore]);

  const handleSearch = () => {
    const result = allData.flatMap((sheet) =>
      sheet.students
        .map((student) => ({
          ...student,
          sheet: sheet.sheet,
          subjects: student.subjects.filter((subject) => {
            const matchSubject =
              selectedSubjects.length === 0 ||
              selectedSubjects.includes(subject.subject_name);

            const matchScore =
              !filters.score ||
              filters.score
                .split(",")
                .some((s) =>
                  String(subject.score)
                    .toUpperCase()
                    .startsWith(s.trim().toUpperCase())
                );

            const hasScore =
              subject.score !== "" &&
              subject.score !== null &&
              subject.score !== undefined &&
              subject.score !== "ຍັງບໍມີຄະແນນ";

            const matchCheckbox =
              (hasScore && showWithScore) || (!hasScore && showWithoutScore);

            return matchSubject && matchScore && matchCheckbox;
          }),
        }))
        .filter((student) => {
          const matchDepartment =
            !filters.department_id ||
            student.department_id === filters.department_id;
          const matchClassroom =
            !filters.classroom_id ||
            student.classroom_id === filters.classroom_id;
          const matchStudent =
            !filters.student || student.name.includes(filters.student);
          return (
            matchDepartment &&
            matchClassroom &&
            matchStudent &&
            student.subjects.length > 0
          );
        })
    );
    setFilteredStudents(result);
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
    <Container maxWidth="lg" style={{ fontFamily: "NotoSansLaoLooped" }}>
      <SkeletonLoaderComponent loading={loading} />
    {allData.length > 0 && (
      <>
      <Typography variant="h5" gutterBottom>
        📚 ຄົ້ນຫາຄະແນນນັກສຶກສາ
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Select
            fullWidth
            value={filters.department_id}
            onChange={(e) =>
              setFilters({
                ...filters,
                department_id: String(e.target.value),
                classroom_id: "",
              })
            }
            displayEmpty
          >
            <MenuItem value="">-- ເລືອກສາຂາວິຊາ --</MenuItem>
            {departments.map((dep) => (
              <MenuItem key={dep.department_id} value={dep.department_id}>
                {dep.name}
              </MenuItem>
            ))}
          </Select>
        </Grid>

        <Grid item xs={12} md={4}>
          <Select
            fullWidth
            value={filters.classroom_id}
            onChange={(e) =>
              setFilters({
                ...filters,
                classroom_id: String(e.target.value),
              })
            }
            displayEmpty
            disabled={!filters.department_id}
          >
            <MenuItem value="">-- ເລືອກຫ້ອງ --</MenuItem>
            {getAvailableClassrooms().map((cls) => (
              <MenuItem key={cls} value={cls}>
                ຫ້ອງ {cls}
              </MenuItem>
            ))}
          </Select>
        </Grid>

        <Grid item xs={12} md={4}>
          <Autocomplete
            freeSolo
            fullWidth
            options={students}
            value={filters.student}
            onInputChange={(event, newValue) =>
              setFilters({ ...filters, student: newValue })
            }
            renderInput={(params) => (
              <TextField {...params} label="ຊື່ນັກສຶກສາ" />
            )}
            sx={{ minWidth: 180 }}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <Autocomplete
            multiple
            freeSolo
            fullWidth
            options={subjects}
            value={selectedSubjects}
            inputValue={inputValue}
            onInputChange={(e, newInput) => setInputValue(newInput)}
            onChange={(e, newValue) => setSelectedSubjects(newValue)}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  variant="outlined"
                  label={option}
                  {...getTagProps({ index })}
                  sx={{ margin: 0.5 }}
                  key={index}
                />
              ))
            }sx={{minWidth:150}}
            renderInput={(params) => (
              <TextField
                {...params}
                label="ວິຊາ"
                placeholder="ພີມຊື່ວິຊາ ຫຼື ບໍ່ເລືອກກໍໄດ້"
              />
            )}
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
          sx={{ display: "flex", alignItems: "center" }}
        >
          <Button variant="contained" onClick={handleSearch}>
            ກົດຄົ້ນຫາ
          </Button>
        </Grid>

        <Grid item xs={12}>
          <FormGroup row>
            <FormControlLabel
              control={
                <Checkbox
                  checked={showWithScore}
                  onChange={(e) => setShowWithScore(e.target.checked)}
                />
              }
              label="ສະແດງວິຊາທີ່ມີຄະແນນ"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={showWithoutScore}
                  onChange={(e) => setShowWithoutScore(e.target.checked)}
                />
              }
              label="ສະແດງວິຊາທີ່ບໍ່ມີຄະແນນ"
            />
          </FormGroup>
        </Grid>
      </Grid>
      {filteredStudents.map((student, i) => (
        <Box
          key={i}
          sx={{
            border: "1px solid #ccc",
            borderRadius: 2,
            padding: 2,
            marginBottom: 2,
            backgroundColor: "#f9f9f9",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            textAlign: "center",
          }}
        >
          <Box>
            <strong>ຊື່: </strong> {student.name}
          </Box>

          <Box>
            <strong>ຫ້ອງຮຽນ: </strong> {student.classroom_id}
          </Box>
          <Box>
            <strong>ສາຂາວິຊາ: </strong>{" "}
            {deps.find((dep) => String(dep.id) === student.department_id)
              ?.name || "ไม่พบข้อมูล"}
          </Box>
        </Box>
      ))}
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ background: "#e0e0e0" }}>
            <TableRow>
              <TableCell>ຊື່ວິຊາ</TableCell>
              <TableCell>ຄະແນນ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  ບໍ່ມີຂໍ້ມຼນ
                </TableCell>
              </TableRow>
            ) : (
              filteredStudents.map((student, i) =>
                student.subjects.map((subject, j) => (
                  <TableRow key={`${i}-${j}`}>
                    <TableCell>{subject.subject_name}</TableCell>
                    <TableCell>{subject.score}</TableCell>
                  </TableRow>
                ))
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>
      </>
    )}
    </Container>
  );
}

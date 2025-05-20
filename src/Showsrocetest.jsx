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
} from "@mui/material";
import SkeletonLoaderComponent from "./loding/loading";

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

      // กำหนด departments และ classrooms ได้เหมือนเดิม
      const allStudents = sheets.flatMap((sheet) => sheet.students);
      const depSet = new Set();
      const clsSet = new Set();

      allStudents.forEach((s) => {
        if (s.department_id) depSet.add(s.department_id);
        if (s.classroom_id) clsSet.add(`${s.department_id}|${s.classroom_id}`);
      });

      setDepartments(
        [...depSet].map((id) => ({ department_id: id, name: `แผนก ${id}` }))
      );
      setClassrooms([...clsSet]);

      setLoading(false);
    })
    .catch((err) => {
      console.error("โหลดข้อมูลล้มเหลว", err);
      setLoading(false);
    });
}, []);

// useEffect กรอง students และ subjects ตามแผนกและห้อง
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
        student.department_id === filters.department_id &&
        student.classroom_id === filters.classroom_id
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

  const handleSearch = () => {
    const result = allData
      .flatMap((sheet) =>
        sheet.students.map((student) => ({
          ...student,
          sheet: sheet.sheet,
          subjects: student.subjects.filter((subject) => {
            const matchSubject =
              selectedSubjects.length === 0 ||
              selectedSubjects.includes(subject.subject_name);

            const matchScore =
              !filters.score || String(subject.score).includes(filters.score);

            const hasScore =
              subject.score !== "" &&
              subject.score !== null &&
              subject.score !== undefined &&
              subject.score !== "ຍັງບໍມີຄະແນນ";

            const matchCheckbox =
              (hasScore && showWithScore) || (!hasScore && showWithoutScore);

            return matchSubject && matchScore && matchCheckbox;
          }),
        })
      )
      .filter((student) => {
        const matchDepartment =
          !filters.department_id ||
          student.department_id === filters.department_id;

        const matchClassroom =
          !filters.classroom_id ||
          student.classroom_id === filters.classroom_id;

        const matchStudent =
          !filters.student ||
          student.name.toLowerCase().includes(filters.student.toLowerCase());

        return (
          matchDepartment &&
          matchClassroom &&
          matchStudent &&
          student.subjects.length > 0
        );
      }));

    setFilteredStudents(result);
  }

  return (
    <Container maxWidth="lg" style={{ fontFamily: "NotoSansLaoLooped" }}>
      <SkeletonLoaderComponent loading={loading} />
      <Typography variant="h5" gutterBottom>
        📚 ค้นหาคะแนนนักเรียน
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Select
            fullWidth
            value={filters.department_id}
            onChange={(e) =>
              setFilters({ ...filters, department_id: e.target.value, classroom_id: "" })
            }
            displayEmpty
          >
            <MenuItem value="">-- เลือกแผนก --</MenuItem>
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
            onChange={(e) => setFilters({ ...filters, classroom_id: e.target.value })}
            displayEmpty
            disabled={!filters.department_id}
          >
            <MenuItem value="">-- เลือกห้องเรียน --</MenuItem>
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
              <TextField {...params} label="ชื่อนักเรียน" />
            )}
            sx={{minWidth: 180}}
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
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="เลือกวิชา"
                placeholder="พิมพ์ชื่อวิชา"
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="คะแนน/เกรด"
            placeholder="0,1,2,3,4,I"
            value={filters.score}
            onChange={(e) => setFilters({ ...filters, score: e.target.value })}
          />
        </Grid>

        <Grid item xs={12} md={4} sx={{ display: "flex", alignItems: "center" }}>
          <Button variant="contained" onClick={handleSearch}>
            ค้นหา
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
              label="แสดงคะแนนที่มี"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={showWithoutScore}
                  onChange={(e) => setShowWithoutScore(e.target.checked)}
                />
              }
              label="แสดงที่ไม่มีคะแนน"
            />
          </FormGroup>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ background: "#e0e0e0" }}>
            <TableRow>
              <TableCell>ชีต</TableCell>
              <TableCell>ชื่อ</TableCell>
              <TableCell>ห้อง</TableCell>
              <TableCell>สาขา</TableCell>
              <TableCell>วิชา</TableCell>
              <TableCell>คะแนน</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  ไม่พบข้อมูล
                </TableCell>
              </TableRow>
            ) : (
              filteredStudents.map((student, i) =>
                student.subjects.map((subject, j) => (
                  <TableRow key={`${i}-${j}`}>
                    <TableCell>{student.sheet}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.classroom_id}</TableCell>
                    <TableCell>{student.department_id}</TableCell>
                    <TableCell>{subject.subject_name}</TableCell>
                    <TableCell>{subject.score}</TableCell>
                  </TableRow>
                ))
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

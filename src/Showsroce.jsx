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
  Alert, // เพิ่ม Alert สำหรับแสดง error
} from "@mui/material";
import SkeletonLoaderComponent from "./loding/loading";
import { apisheet, apisroot } from "./URL";

const deps = [
  {
    id: 1,
    name: "ສາຂາວິຊາ ບໍລິຫານ ທຸລະກິດຕໍ່ເນື່ອງ",
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

export default function StudentSearchExport() {
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
  const [showWithoutScore, setShowWithoutScore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState({
    // State สำหรับเก็บ error
    department: "",
    classroom: "",
    student: "",
    general: "",
  });

  useEffect(() => {
    setLoading(true);
    fetch(`${apisroot}/from-sheet-all`)
      .then((res) => res.json())
      .then((data) => {
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
        setLoading(false);
      })
      .catch((err) => {
        console.error("ໂຫລດຂໍ້ມູນບໍ່ໄດ້", err);
        setErrorMessages((prev) => ({
          ...prev,
          general: "ບໍ່ສາມາດໂຫລດຂໍ້ມູນຫຼັກໄດ້, ກະລຸນາລອງໃໝ່ອີກຄັ້ງ.",
        }));
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!filters.department_id || !filters.classroom_id) {
      setStudents([]);
      setSubjects([]);
      // ไม่ต้องเคลียร์ filteredStudents ที่นี่ เพราะจะถูกจัดการใน handleSearch
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

  const getAvailableClassrooms = () => {
    if (!filters.department_id) return [];
    return classrooms
      .filter((key) => key.startsWith(filters.department_id + "|"))
      .map((key) => key.split("|")[1]);
  };

  useEffect(() => {
    // ทำการค้นหาเมื่อ checkbox เปลี่ยนแปลง *ถ้า* มีการค้นหาครั้งล่าสุดแล้ว
    if (filteredStudents.length > 0 || errorMessages.general === "") {
      // ตรวจสอบว่าเคยค้นหาแล้วหรือยังไม่มี error
      // หรือถ้าต้องการให้ค้นหาใหม่ทุกครั้งที่ checkbox เปลี่ยน โดยไม่สนใจว่าเคยค้นหาไหม
      // ให้เรียก handleSearch() โดยตรง แต่ต้องระวังเรื่องการ validate อีกรอบ
      // ในที่นี้จะยังไม่เรียก handleSearch อัตโนมัติเมื่อ checkbox เปลี่ยน เพื่อให้ user กดค้นหาเอง
    }
  }, [showWithScore, showWithoutScore]);

  const validateInputs = () => {
    let valid = true;
    const newErrors = {
      department: "",
      classroom: "",
      student: "",
      general: "",
    };

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
      setFilteredStudents([]); // เคลียร์ผลลัพธ์ถ้า input ไม่ถูกต้อง
      return;
    }
    setErrorMessages({
      department: "",
      classroom: "",
      student: "",
      general: "",
    }); // เคลียร์ error เมื่อ input ถูกต้อง

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
              subject.score !== "ຍັງບໍ່ມີຄະແນນ";

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
            !filters.student || student.name.includes(filters.student); // แก้เป็น .includes เพื่อการค้นหาบางส่วน
          return (
            matchDepartment &&
            matchClassroom &&
            matchStudent &&
            student.subjects.length > 0
          );
        })
    );
    setFilteredStudents(result);
    if (result.length === 0) {
      // setErrorMessages(prev => ({ ...prev, general: "ບໍ່ພົບຂໍ້ມູນຕາມເງື່ອນໄຂທີ່ລະບຸ."}));
      // การแสดง "ບໍ່ມີຂໍ້ມູນ" ในตารางก็เพียงพอแล้ว อาจจะไม่ต้อง set error message ตรงนี้
    }
  };
  const allowedValues = ["0", "1", "2", "3", "4", "I"];

  const handleScoreChange = (e) => {
    const input = e.nativeEvent.data?.toUpperCase();
    if (!input && e.target.value !== filters.score) {
      // Handle deletion or direct paste
      const newScoreValue = e.target.value
        .toUpperCase()
        .split(",")
        .map((s) => s.trim())
        .filter((s) => allowedValues.includes(s) || s === "")
        .join(",");
      setFilters({ ...filters, score: newScoreValue });
      return;
    }
    if (!input) return;

    if (!allowedValues.includes(input)) {
      return;
    }

    let current = filters.score;

    if (current === "") {
      current = input;
    } else if (current.endsWith(",")) {
      current += input;
    } else {
      current += `,${input}`;
    }

    setFilters({ ...filters, score: current });
  };

  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    if (field === "department_id") {
      newFilters.classroom_id = ""; // Reset classroom when department changes
      newFilters.student = ""; // Reset student
      setStudents([]); // Clear student options
      setSubjects([]); // Clear subject options
      setFilteredStudents([]); // Clear search results
      setErrorMessages((prev) => ({ ...prev, classroom: "", student: "" }));
    }
    if (field === "classroom_id") {
      newFilters.student = ""; // Reset student when classroom changes
      setStudents([]); // Clear student options (จะถูก populate ใหม่ใน useEffect)
      setFilteredStudents([]); // Clear search results
      setErrorMessages((prev) => ({ ...prev, student: "" }));
    }
    setFilters(newFilters);
    // Clear specific error when user starts typing/selecting
    if (field === "department_id" && value)
      setErrorMessages((prev) => ({ ...prev, department: "" }));
    if (field === "classroom_id" && value)
      setErrorMessages((prev) => ({ ...prev, classroom: "" }));
    // student error จะถูก clear ใน onInputChange ของ Autocomplete
  };

  return (
    <Container maxWidth="lg">
      <SkeletonLoaderComponent loading={loading} />
      {errorMessages.general && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessages.general}
        </Alert>
      )}
      {allData.length > 0 && !loading && (
        <>
          <Typography variant="h5" gutterBottom>
            📚 ຄົ້ນຫາຄະແນນນັກສຶກສາ
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
            <Select
              fullWidth
              value={filters.department_id}
              onChange={(e) =>
                handleFilterChange("department_id", String(e.target.value))
              }
              displayEmpty
              error={!!errorMessages.department}
            >
              <MenuItem value="">-- ເລືອກສາຂາວິຊາ --</MenuItem>
              {departments.map((dep) => (
                <MenuItem key={dep.department_id} value={dep.department_id}>
                  {dep.name}
                </MenuItem>
              ))}
            </Select>
            {errorMessages.department && (
              <Typography color="error" variant="caption">
                {errorMessages.department}
              </Typography>
            )}

            <Select
              fullWidth
              value={filters.classroom_id}
              onChange={(e) =>
                handleFilterChange("classroom_id", String(e.target.value))
              }
              displayEmpty
              disabled={!filters.department_id}
              error={!!errorMessages.classroom}
            >
              <MenuItem value="">-- ເລືອກຫ້ອງ --</MenuItem>
              {getAvailableClassrooms().map((cls) => (
                <MenuItem key={cls} value={cls}>
                  ຫ້ອງ {cls}
                </MenuItem>
              ))}
            </Select>
            {errorMessages.classroom && (
              <Typography color="error" variant="caption">
                {errorMessages.classroom}
              </Typography>
            )}

            <Autocomplete
              freeSolo
              fullWidth
              options={students} // แสดงรายชื่อนักเรียนที่ filter มาแล้ว
              value={filters.student}
              onInputChange={(event, newValue) => {
                setFilters({ ...filters, student: newValue });
                setFilteredStudents([]); // Clear search results when student changes
                if (newValue && newValue.trim() !== "") {
                  setErrorMessages((prev) => ({ ...prev, student: "" })); // เคลียร์ error เมื่อมีการพิมพ์
                }
              }}
              disabled={!filters.classroom_id} // Disable ถ้ายังไม่ได้เลือกห้อง
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="ຊື່ນັກສຶກສາ"
                  error={!!errorMessages.student}
                  helperText={errorMessages.student}
                />
              )}
              sx={{ minWidth: 180 }}
            />

            <Autocomplete
              multiple
              freeSolo
              fullWidth
              options={subjects}
              value={selectedSubjects}
              inputValue={inputValue}
              onInputChange={(e, newInput) => setInputValue(newInput)}
              onChange={(e, newValue) => setSelectedSubjects(newValue)}
              disabled={!filters.student} // อาจจะ disable ถ้ายังไม่ได้เลือกนักเรียน
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
                  label="ວິຊາ (ບໍ່ບັງຄັບເລືອກ)"
                  placeholder="ພີມຊື່ວິຊາ ຫຼື ບໍ່ເລືອກກໍໄດ້"
                />
              )}
            />

            <TextField
              fullWidth
              sx={{ fontFamily: "NotoSansLaoLooped", width: "100%" }} //ปรับ width ให้เต็ม
              label="ຄະແນນ (ບໍ່ບັງຄັບເລືອກ)"
              placeholder="0,1,2,3,4,I"
              value={filters.score}
              onChange={handleScoreChange}
              disabled={!filters.student} // อาจจะ disable ถ้ายังไม่ได้เลือกนักเรียน
            />

            <Button variant="contained" onClick={handleSearch}>
              ກົດຄົ້ນຫາ
            </Button>

            <FormGroup row>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={showWithScore}
                    onChange={(e) => setShowWithScore(e.target.checked)}
                    disabled={!filters.student} // อาจจะ disable ถ้ายังไม่ได้เลือกนักเรียน
                  />
                }
                label="ສະແດງວິຊາທີ່ມີຄະແນນ"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={showWithoutScore}
                    onChange={(e) => setShowWithoutScore(e.target.checked)}
                    disabled={!filters.student} // อาจจะ disable ถ้ายังไม่ได้เลือกนักเรียน
                  />
                }
                label="ສະແດງວິຊາທີ່ບໍ່ມີຄະແນນ"
              />
            </FormGroup>
          </Box>
          {/* แสดงข้อมูลนักเรียนที่ถูก filter */}
          {/* ปรับปรุงการแสดงผล filteredStudents ให้แสดงข้อมูลนักเรียนคนเดียว */}
          {filteredStudents.length > 0 && (
            <>
              {/* แสดงข้อมูลสรุปของนักเรียนที่ค้นหาเจอ */}
              {/* เนื่องจาก filteredStudents อาจมีหลายรายการ (ถ้าชื่อซ้ำกันข้าม sheet)
                 แต่ตาม logic การ filter ด้วย department, classroom, student name ควรจะเหลือคนเดียว
                 หรือกลุ่มเล็กๆ ที่ชื่อคล้ายกันมากๆ ถ้าการ filter student name ไม่ได้ match แบบตรงตัว
                 ในที่นี้จะแสดงข้อมูลของคนแรกที่เจอ หรือถ้าต้องการให้แน่ใจว่ามีคนเดียว อาจจะต้องปรับ logic การ filter student name ให้เข้มงวดขึ้น
             */}
              {filters.student &&
                filteredStudents.slice(0, 1).map(
                  (
                    student,
                    i // แสดงเฉพาะข้อมูลของนักเรียนคนแรกที่ตรงเงื่อนไข
                  ) => (
                    <Box
                      key={`student-info-${i}`}
                      sx={{
                        border: "1px solid #ccc",
                        borderRadius: 2,
                        padding: 2,
                        marginBottom: 2,
                        backgroundColor: "#f9f9f9",
                        color: "black",
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
                        <strong>ສາຂາວິຊາ: </strong>

                        {deps.find(
                          (dep) => String(dep.id) === student.department_id
                        )?.name || "ບໍ່ພົບຂໍ້ມູນ"}
                      </Box>
                    </Box>
                  )
                )}
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow
                      sx={{
                        backgroundColor: "text.secondary",
                        fontWeight: "bold",
                        fontSize: "16px",
                        color: "white", // หรือ "black" ขึ้นกับ background
                      }}
                    >
                      <TableCell
                        align="center"
                        sx={{ fontWeight: "bold", fontSize: "16px" }}
                      >
                        ລ/ດ
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ fontWeight: "bold", fontSize: "16px" }}
                      >
                        ຊື່ວິຊາ
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ fontWeight: "bold", fontSize: "16px" }}
                      >
                        ຄະແນນ
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {filteredStudents.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} align="center">
                          {errorMessages.department ||
                          errorMessages.classroom ||
                          errorMessages.student
                            ? "ກະລຸນາເລືອກຂໍ້ມູນໃຫ້ຄົບຖ້ວນກ່ອນກົດຄົ້ນຫາ"
                            : "ບໍ່ມີຂໍ້ມູນວິຊາ"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredStudents
                        .flatMap((student) => student.subjects)
                        .map((subject, j) => (
                          <TableRow key={`subject-${j}`}>
                            <TableCell align="center">{j + 1}</TableCell>
                            <TableCell align="center">
                              {subject.subject_name}
                            </TableCell>
                            <TableCell align="center">
                              {subject.score || "F"}
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
          {/* แสดงข้อความ "ບໍ່ມີຂໍ້ມູນ" ถ้าค้นหาแล้วไม่เจอ และไม่มี error อื่นๆ */}
          {filteredStudents.length === 0 &&
            !errorMessages.department &&
            !errorMessages.classroom &&
            !errorMessages.student &&
            !errorMessages.general && (
              <Typography variant="subtitle1" align="center" sx={{ mt: 2 }}>
                ບໍ່ພົບຂໍ້ມູນຕາມເງື່ອນໄຂທີ່ຄົ້ນຫ
              </Typography>
            )}
        </>
      )}
    </Container>
  );
}

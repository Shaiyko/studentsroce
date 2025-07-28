import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  TextField,
  MenuItem,
  Button,
  Typography,
  Paper,
  Avatar,
  Divider,
  Chip,
  Card,
  CardContent,
  IconButton,
  Fade,
  Zoom,
  Container,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Tooltip,
  Grow,
  Slide,
} from "@mui/material";
import {
  Person,
  School,
  LocationOn,
  Edit,
  Save,
  Cancel,
  Phone,
  Email,
  Badge,
  CalendarToday,
  PersonOutline,
  TranslateOutlined,
  WcOutlined,
  HomeOutlined,
  BusinessOutlined,
  MapOutlined,
  GradeOutlined,
  DateRangeOutlined,
  SchoolOutlined,
} from "@mui/icons-material";
import axios from "axios";
import { apisheet } from "../URL";
import LoadingComponent from "../loding/loadinglogin";
import Swal from "sweetalert2";

// Option lists
const genders = [
  { value: "M", label: "ຊາຍ", icon: "👨" },
  { value: "F", label: "ຍິງ", icon: "👩" },
];

const statuses = [
  { value: "ກຳລັງຮຽນ", label: "ກຳລັງຮຽນ", color: "success", icon: "📚" },
  { value: "ຈົບການສຶກສາແລ້ວ", label: "ຈົບການສຶກສາແລ້ວ", color: "primary", icon: "🎓" },
  { value: "ອອກແລ້ວ", label: "ອອກແລ້ວ", color: "error", icon: "❌" },
  { value: "ພັກການຮຽນ", label: "ພັກການຮຽນ", color: "warning", icon: "⏸️" },
];

const dep = [
  {
    id: 1,
    name: "ສາຂາການບໍລິຫານສາຂາວິຊາ ບໍລິຫານ ທຸລະກິດຕໍ່ເນື່ອງ",
    short: "ບໍລິຫານທຸລະກິດ",
    icon: "💼",
  },
  {
    id: 2,
    name: "ສາຂາວິຊາ ການຄ້າເອເລັກໂຕນິກ (ຄອມພິວເຕອທຸລະກິດ)",
    short: "E-Commerce",
    icon: "💻",
  },
  {
    id: 3,
    name: "ສາຂາວິຊາ ຜູ້ປະກອບການ",
    short: "ຜູ້ປະກອບການ",
    icon: "🚀",
  },
  {
    id: 4,
    name: "ສາຂາວິຊາ ພາສາອັງກິດ",
    short: "ພາສາອັງກິດ",
    icon: "🇬🇧",
  },
  {
    id: 5,
    name: "ສາຂາວິຊາ ວິຊະວະກຳຊອບແວ",
    short: "ວິຊະວະກຳຊອບແວ",
    icon: "⚙️",
  },
  {
    id: 6,
    name: "ສາຂາວິຊາ ບໍລິຫານ ທຸລະກິດ",
    short: "ບໍລິຫານ",
    icon: "📊",
  },
  {
    id: 7,
    name: "ສາຂາວິຊາ ພາສາອັງກິດຕໍ່ເນື່ອງ",
    short: "ພາສາອັງກິດຕໍ່ເນື່ອງ",
    icon: "🌐",
  },
];

// Enhanced styled text field component
const StyledTextField = ({ label, icon, required = false, error = false, helperText, children, ...props }) => (
  <TextField
    label={label}
    required={required}
    error={error}
    helperText={helperText}
    variant="outlined"
    fullWidth
    InputProps={{
      startAdornment: icon && (
        <InputAdornment position="start">
          <Box sx={{ color: error ? 'error.main' : 'primary.main', display: 'flex', alignItems: 'center' }}>
            {icon}
          </Box>
        </InputAdornment>
      ),
      sx: {
        borderRadius: 3,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        backgroundColor: props.disabled ? 'rgba(0, 0, 0, 0.02)' : 'rgba(255, 255, 255, 0.8)',
        '&:hover': {
          backgroundColor: props.disabled ? 'rgba(0, 0, 0, 0.02)' : 'rgba(255, 255, 255, 0.95)',
          transform: 'translateY(-1px)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        },
        '&.Mui-focused': {
          backgroundColor: 'rgba(255, 255, 255, 1)',
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.12)',
        },
      }
    }}
    InputLabelProps={{
      sx: {
        fontWeight: 500,
        '&.Mui-focused': {
          color: 'primary.main',
          fontWeight: 600,
        }
      }
    }}
    sx={{
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: 'rgba(0, 0, 0, 0.12)',
          borderWidth: 2,
        },
        '&:hover fieldset': {
          borderColor: 'primary.light',
        },
        '&.Mui-focused fieldset': {
          borderColor: 'primary.main',
          borderWidth: 2,
        },
        '&.Mui-error fieldset': {
          borderColor: 'error.main',
        }
      }
    }}
    {...props}
  >
    {children}
  </TextField>
);

// ฟังก์ชันช่วยดึงปีการศึกษาปัจจุบัน (เช่น "2025-2026")
const getCurrentSchoolYear = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // เดือน 1-12
  // สมมติปีการศึกษาเริ่ม ต.ค. ปีที่แล้ว ถึง ก.ย. ปีนี้
  if (month >= 10) {
    // เดือน ต.ค.-ธ.ค. จะถือเป็นปีการศึกษา "ปีนี้ - ปีถัดไป"
    return `${year}-${year + 1}`;
  } else {
    // เดือน ม.ค.-ก.ย. จะถือเป็นปีการศึกษา "ปีก่อน - ปีนี้"
    return `${year - 1}-${year}`;
  }
};

// ฟังก์ชันสร้างปีการศึกษา 10 ปีย้อนหลัง
const generateSchoolYears = () => {
  const years = [];
  const current = getCurrentSchoolYear(); // เช่น "2025-2026"
  const startYear = parseInt(current.split("-")[0], 10); // 2025
  for (let i = 0; i < 10; i++) {
    const y1 = startYear - i;
    const y2 = y1 + 1;
    years.push(`${y1}-${y2}`);
  }
  return years;
};

// Function to get status color
const getStatusColor = (status) => {
  const statusObj = statuses.find(s => s.value === status);
  return statusObj ? statusObj.color : "default";
};

// Enhanced Card Component
const InfoCard = ({ title, icon, color, children, delay = 0 }) => (
  <Grow in timeout={1000 + delay * 200}>
    <Card
      sx={{
        mb: 4,
        borderRadius: 4,
        border: "1px solid rgba(0, 0, 0, 0.05)",
        background: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(10px)",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "relative",
        overflow: "hidden",
        "&:hover": {
          transform: "translateY(-8px) scale(1.02)",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
        },
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg, ${color}, ${color}88)`,
        }
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
          <Box
            sx={{
              mr: 3,
              p: 2,
              borderRadius: 3,
              background: `linear-gradient(135deg, ${color}15, ${color}05)`,
              border: `2px solid ${color}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {React.cloneElement(icon, { 
              sx: { color: color, fontSize: 32, fontWeight: 'bold' } 
            })}
          </Box>
          <Typography 
            variant="h5" 
            fontWeight="bold" 
            sx={{ 
              color: "#2c3e50",
              letterSpacing: "0.5px",
              textShadow: "0 1px 2px rgba(0, 0, 0, 0.1)"
            }}
          >
            {title}
          </Typography>
        </Box>
        {children}
      </CardContent>
    </Card>
  </Grow>
);

export default function StudentProfile() {
  const schoolYearOptions = generateSchoolYears();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const storedUser = localStorage.getItem("user_sheet");
    if (storedUser) {
      setProfile(JSON.parse(storedUser));
    }
  }, []);

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    
    switch (name) {
      case 'name':
      case 'name_e':
        if (!value || value.trim().length < 2) {
          newErrors[name] = 'ກະລຸນາໃສ່ຊື່ທີ່ຖືກຕ้ອງ';
        } else {
          delete newErrors[name];
        }
        break;
      case 'phone':
        if (!value || !/^[0-9+\-\s()]{8,}$/.test(value)) {
          newErrors[name] = 'ກະລຸນາໃສ່ເບີໂທທີ່ຖືກຕ້ອງ';
        } else {
          delete newErrors[name];
        }
        break;
      case 'email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors[name] = 'ກະລຸນາໃສ່ອີເມວທີ່ຖືກຕ້ອງ';
        } else {
          delete newErrors[name];
        }
        break;
      default:
        if (!value) {
          newErrors[name] = 'ກະລຸນາເລືອກຂໍ້ມູນ';
        } else {
          delete newErrors[name];
        }
    }
    
    setErrors(newErrors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
    validateField(name, value);
  };

  const handleSave = async () => {
    // Validate all fields
    const requiredFields = ['name', 'name_e', 'phone', 'gender', 'dob', 'generation_id', 'department_id', 'school_year', 'status', 'village', 'district', 'province'];
    const newErrors = {};
    
    requiredFields.forEach(field => {
      if (!profile[field]) {
        newErrors[field] = 'ກະລຸນາໃສ່ຂໍ້ມູນ';
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      Swal.fire({
        icon: "warning",
        title: "ຂໍ້ມູນບໍ່ຄົບຖ້ວນ",
        text: "ກະລຸນາໃສ່ຂໍ້ມູນໃຫ້ຄົບຖ້ວນ",
        timer: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${apisheet}/api/update-profile`, profile);
      localStorage.setItem("user_sheet", JSON.stringify(profile));
      Swal.fire({
        icon: "success",
        title: "ແກ້ໄຂສຳເລັດ!",
        text: `ຍີນດີຕ້ອນຮິບ`,
        timer: 2000,
        showConfirmButton: false,
      });
      setEditing(false);
      setErrors({});
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "ເກີດຂໍ້ຜິດພາດ",
        text: "ບໍ່ສາມາດແກ້ໄຂຂໍ້ມູນໄດ້: " + err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!profile) return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    }}>
      <Typography variant="h4" color="white">Loading...</Typography>
    </Box>
  );

  const currentStatus = statuses.find(s => s.value === profile.status);
  const currentDepartment = dep.find(d => d.id === profile.department_id);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        py: 4,
        px: 2,
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
        }
      }}
    >
      <LoadingComponent loading={loading} />
      
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Fade in timeout={800}>
          <Paper
            elevation={20}
            sx={{
              borderRadius: 6,
              overflow: "hidden",
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            {/* Enhanced Header Section */}
            <Box
              sx={{
                background: "linear-gradient(135deg, #4facfe 0%, #cfe0e0ff 100%)",
                color: "white",
                p: 5,
                position: "relative",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: -100,
                  right: -100,
                  width: 300,
                  height: 300,
                  borderRadius: "50%",
                  background: "rgba(255, 255, 255, 0.1)",
                  animation: "float 6s ease-in-out infinite",
                },
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: -50,
                  left: -50,
                  width: 200,
                  height: 200,
                  borderRadius: "50%",
                  background: "rgba(255, 255, 255, 0.08)",
                  animation: "float 8s ease-in-out infinite reverse",
                },
                "@keyframes float": {
                  "0%, 100%": { transform: "translateY(0px)" },
                  "50%": { transform: "translateY(-20px)" },
                }
              }}
            >
              <Grid container spacing={4} alignItems="center">
                <Grid item>
                  <Zoom in timeout={1200}>
                    <Avatar
                      sx={{
                        width: 120,
                        height: 120,
                        fontSize: "3rem",
                        background: "rgba(255, 255, 255, 0.2)",
                        border: "4px solid rgba(255, 255, 255, 0.3)",
                        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <Person fontSize="large" />
                    </Avatar>
                  </Zoom>
                </Grid>
                <Grid item xs>
                  <Slide direction="right" in timeout={1000}>
                    <Box>
                      <Typography variant="h3" fontWeight="bold" gutterBottom sx={{ textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}>
                        {profile.name || "Student Name"}
                      </Typography>
                      <Typography variant="h6" sx={{ opacity: 0.9, mb: 2, fontWeight: 300 }}>
                        {profile.name_e || "English Name"}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        {currentStatus && (
                          <Chip
                            icon={<span style={{ fontSize: '16px' }}>{currentStatus.icon}</span>}
                            label={currentStatus.label}
                            color={currentStatus.color}
                            sx={{
                              fontWeight: "bold",
                              fontSize: "1rem",
                              px: 2,
                              py: 1,
                              height: 'auto',
                              '& .MuiChip-label': { px: 1 }
                            }}
                          />
                        )}
                        {currentDepartment && (
                          <Chip
                            icon={<span style={{ fontSize: '16px' }}>{currentDepartment.icon}</span>}
                            label={currentDepartment.short}
                            variant="outlined"
                            sx={{
                              color: 'white',
                              borderColor: 'rgba(255, 255, 255, 0.5)',
                              fontWeight: 500,
                              fontSize: '0.9rem',
                              '&:hover': {
                                borderColor: 'rgba(255, 255, 255, 0.8)',
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              }
                            }}
                          />
                        )}
                      </Box>
                    </Box>
                  </Slide>
                </Grid>
                <Grid item>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Tooltip title={editing ? "ຍົກເລີກ" : "ແກ້ໄຂ"}>
                      <IconButton
                        onClick={() => {
                          setEditing(!editing);
                          if (!editing) setErrors({});
                        }}
                        sx={{
                          background: "rgba(34, 16, 16, 0.94)",
                          color: "white",
                          width: 56,
                          height: 56,
                          transition: "all 0.3s ease",
                          "&:hover": {
                            background: "rgba(244, 7, 7, 0.92)",
                            transform: "scale(1.1)",
                          },
                        }}
                      >
                        {editing ? <Cancel /> : <Edit />}
                      </IconButton>
                    </Tooltip>
                    {editing && (
                      <Zoom in>
                        <Tooltip title="ບັນທຶກ">
                          <IconButton
                            onClick={handleSave}
                            sx={{
                              background: "rgba(76, 175, 80, 0.9)",
                              color: "white",
                              width: 56,
                              height: 56,
                              transition: "all 0.3s ease",
                              "&:hover": {
                                background: "rgba(76, 175, 80, 1)",
                                transform: "scale(1.1)",
                              },
                            }}
                          >
                            <Save />
                          </IconButton>
                        </Tooltip>
                      </Zoom>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Box>

            <Box sx={{ p: 5 }}>
              {/* Personal Information */}
              <InfoCard
                title="ຂໍ້ມູນສ່ວນຕົວ (Personal Information)"
                icon={<PersonOutline />}
                color="#4facfe"
                delay={0}
              >
                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}>
                    <StyledTextField
                      label="ຊື່ ແລະ ນາມສະກຸນ (Lao Name)"
                      name="name"
                      value={profile.name || ""}
                      onChange={handleChange}
                      required
                      disabled={!editing}
                      icon={<PersonOutline />}
                      error={!!errors.name}
                      helperText={errors.name}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <StyledTextField
                      label="Name and Surname (English)"
                      name="name_e"
                      value={profile.name_e || ""}
                      onChange={handleChange}
                      required
                      disabled={!editing}
                      icon={<TranslateOutlined />}
                      error={!!errors.name_e}
                      helperText={errors.name_e}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <StyledTextField
                      label="ວັນເດືອນປີເກິດ"
                      name="dob"
                      type="date"
                      value={profile.dob || ""}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: true }}
                      required
                      disabled={!editing}
                      icon={<CalendarToday />}
                      error={!!errors.dob}
                      helperText={errors.dob}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <StyledTextField
                      select
                      label="ເພດ"
                      name="gender"
                      value={profile.gender || ""}
                      onChange={handleChange}
                      required
                      disabled={!editing}
                      icon={<WcOutlined />}
                      error={!!errors.gender}
                      helperText={errors.gender}
                    >
                      {genders.map((g) => (
                        <MenuItem key={g.value} value={g.value}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <span>{g.icon}</span>
                            {g.label}
                          </Box>
                        </MenuItem>
                      ))}
                    </StyledTextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <StyledTextField
                      label="ເບີໂທ"
                      name="phone"
                      type="tel"
                      value={profile.phone || ""}
                      onChange={handleChange}
                      required
                      disabled={!editing}
                      icon={<Phone />}
                      error={!!errors.phone}
                      helperText={errors.phone}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <StyledTextField
                      label="ອີເມວຕິດຕໍ່"
                      name="email"
                      value={profile.email || ""}
                      disabled
                      icon={<Email />}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'rgba(0, 0, 0, 0.05)',
                        }
                      }}
                    />
                  </Grid>
                </Grid>
              </InfoCard>

              {/* Educational Information */}
              <InfoCard
                title="ຂໍ້ມູນການສຶກສາ (Educational Information)"
                icon={<SchoolOutlined />}
                color="#764ba2"
                delay={1}
              >
                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}>
                    <StyledTextField
                      select
                      label="ລຸ້ນທີ"
                      name="generation_id"
                      value={profile.generation_id || ""}
                      onChange={handleChange}
                      required
                      disabled={!editing}
                      icon={<GradeOutlined />}
                      error={!!errors.generation_id}
                      helperText={errors.generation_id}
                    >
                      {Array.from({ length: 10 }, (_, i) => (
                        <MenuItem key={i} value={i + 1}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <span>🎯</span>
                            ລຸ້ນທີ {i + 1}
                          </Box>
                        </MenuItem>
                      ))}
                    </StyledTextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <StyledTextField
                      select
                      label="ສາຂາ"
                      name="department_id"
                      value={profile.department_id || ""}
                      onChange={handleChange}
                      required
                      disabled={!editing}
                      icon={<BusinessOutlined />}
                      error={!!errors.department_id}
                      helperText={errors.department_id}
                    >
                      {dep.map((d) => (
                        <MenuItem key={d.id} value={d.id}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <span>{d.icon}</span>
                            <Box>
                              <Typography variant="body2" fontWeight="bold">
                                {d.short}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {d.name}
                              </Typography>
                            </Box>
                          </Box>
                        </MenuItem>
                      ))}
                    </StyledTextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <StyledTextField
                      select
                      label="ສົກຮຽນ"
                      name="school_year"
                      value={profile.school_year || ""}
                      onChange={handleChange}
                      required
                      disabled={!editing}
                      icon={<DateRangeOutlined />}
                      error={!!errors.school_year}
                      helperText={errors.school_year}
                    >
                      {schoolYearOptions.map((sy) => (
                        <MenuItem key={sy} value={sy}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <span>📅</span>
                            {sy}
                          </Box>
                        </MenuItem>
                      ))}
                    </StyledTextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <StyledTextField
                      select
                      label="ສະຖານະການສຶກສາ"
                      name="status"
                      value={profile.status || ""}
                      onChange={handleChange}
                      required
                      disabled={!editing}
                      icon={<Badge />}
                      error={!!errors.status}
                      helperText={errors.status}
                    >
                      {statuses.map((s) => (
                        <MenuItem key={s.value} value={s.value}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <span>{s.icon}</span>
                            {s.label}
                          </Box>
                        </MenuItem>
                      ))}
                    </StyledTextField>
                  </Grid>
                  {profile.status === "ກຳລັງຮຽນ" && (
                    <Grid item xs={12} md={6}>
                      <Grow in timeout={500}>
                        <Box>
                          <StyledTextField
                            select
                            label="ປີປັດຈຸບັນ"
                            name="year"
                            value={profile.year || ""}
                            onChange={handleChange}
                            required
                            disabled={!editing}
                            icon={<School />}
                            error={!!errors.year}
                            helperText={errors.year}
                          >
                            {Array.from({ length: 4 }, (_, i) => (
                              <MenuItem key={i} value={i + 1}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <span>📚</span>
                                  ປີ {i + 1}
                                </Box>
                              </MenuItem>
                            ))}
                          </StyledTextField>
                        </Box>
                      </Grow>
                    </Grid>
                  )}
                </Grid>
              </InfoCard>

              {/* Address Information */}
              <InfoCard
                title="ຂໍ້ມູນທີ່ຢູ່ (Address Information)"
                icon={<MapOutlined />}
                color="#ff6b6b"
                delay={2}
              >
                <Grid container spacing={4}>
                  <Grid item xs={12} md={4}>
                    <StyledTextField
                      label="ບ້ານ"
                      name="village"
                      value={profile.village || ""}
                      onChange={handleChange}
                      required
                      disabled={!editing}
                      icon={<HomeOutlined />}
                      error={!!errors.village}
                      helperText={errors.village}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <StyledTextField
                      label="ເມືອງ"
                      name="district"
                      value={profile.district || ""}
                      onChange={handleChange}
                      required
                      disabled={!editing}
                      icon={<LocationOn />}
                      error={!!errors.district}
                      helperText={errors.district}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <StyledTextField
                      label="ແຂວງ"
                      name="province"
                      value={profile.province || ""}
                      onChange={handleChange}
                      required
                      disabled={!editing}
                      icon={<MapOutlined />}
                      error={!!errors.province}
                      helperText={errors.province}
                    />
                  </Grid>
                </Grid>
              </InfoCard>

              {/* Action Buttons */}
              {editing && (
                <Fade in timeout={500}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    gap: 3, 
                    mt: 4,
                    p: 3,
                    borderRadius: 3,
                    background: 'rgba(0, 0, 0, 0.02)',
                  }}>
                    <Button
                      variant="outlined"
                      size="large"
                      startIcon={<Cancel />}
                      onClick={() => {
                        setEditing(false);
                        setErrors({});
                        // Reset profile to original state
                        const storedUser = localStorage.getItem("user_sheet");
                        if (storedUser) {
                          setProfile(JSON.parse(storedUser));
                        }
                      }}
                      sx={{
                        px: 4,
                        py: 1.5,
                        borderRadius: 3,
                        borderWidth: 2,
                        fontWeight: 'bold',
                        textTransform: 'none',
                        fontSize: '1.1rem',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          borderWidth: 2,
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
                        }
                      }}
                    >
                      ຍົກເລີກ
                    </Button>
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<Save />}
                      onClick={handleSave}
                      sx={{
                        px: 4,
                        py: 1.5,
                        borderRadius: 3,
                        fontWeight: 'bold',
                        textTransform: 'none',
                        fontSize: '1.1rem',
                        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #3d8bfe 0%, #2bb0ea 100%)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 20px rgba(79, 172, 254, 0.4)',
                        }
                      }}
                    >
                      ບັນທຶກການແກ້ໄຂ
                    </Button>
                  </Box>
                </Fade>
              )}

              {/* Info Footer */}
              <Box sx={{ 
                mt: 4, 
                p: 3, 
                textAlign: 'center',
                borderTop: '1px solid rgba(0, 0, 0, 0.1)',
                background: 'rgba(0, 0, 0, 0.02)',
                borderRadius: '0 0 20px 20px',
              }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  💡 <strong>ຄຳແນະນຳ:</strong> ກົດປຸ່ມແກ້ໄຂເພື່ອປ່ຽນແປງຂໍ້ມູນ ແລະ ກົດບັນທຶກເພື່ອຢືນຢັນການແກ້ໄຂ
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  ຂໍ້ມູນທີ່ມີເຄື່ອງໝາຍ * ແມ່ນຂໍ້ມູນທີ່ຈຳເປັນຕ້ອງໃສ່
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
}
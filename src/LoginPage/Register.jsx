import React, { Suspense, useEffect, useState } from "react";
import {
  Box,
  Grid,
  TextField,
  Typography,
  Button,
  MenuItem,
  Paper,
  Tooltip,
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios"; // To call your backend/Apps Script Web App
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { apiemail, apisheet } from "../URL";
import LoadingComponent from "../loding/loadinglogin";

// Constants
const genders = [
  { value: "M", label: "ຊາຍ" },
  { value: "F", label: "ຍິງ" },
];

const statuses = ["ກຳລັງຮຽນ", "ຈົບການສຶກສາແລ້ວ", "ອອກແລ້ວ", "ພັກການຮຽນ"];
const gmailtext = "Please enter your valid email address for verification.";
const steps = ["Account Setup", "", "Student Details (Personal Info)"];
const dep = [
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
// Helper Functions (getCurrentSchoolYear, generateSchoolYears - keep as they are)
const getCurrentSchoolYear = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  if (month <= 9) {
    return `${year - 1}-${year}`;
  } else {
    return `${year}-${year + 1}`;
  }
};

const generateSchoolYears = () => {
  const years = [];
  const current = getCurrentSchoolYear();
  const startYear = parseInt(current.split("-")[0], 10);
  for (let i = 0; i < 10; i++) {
    const y1 = startYear - i;
    const y2 = y1 + 1;
    years.push(`${y1}-${y2}`);
  }
  return years;
};

export default function RegisterForm() {
  const navigate = useNavigate(); // ไม่ใช่ navigator
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  //Aii data
  const [selectedId, setSelectedId] = useState(
    "1CBTOY_ONHb218cDluUtjE92KHqVyzmts4kucizDup1A"
  );
  // Step 0 State
  const [username, setUsername] = useState("");
  const [emailLocal, setEmailLocal] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Step 1 State
  const [verificationCode, setVerificationCode] = useState("");
  const [canResendCode, setCanResendCode] = useState(false); // Initialize to false
  const [resendCooldown, setResendCooldown] = useState(0);

  // Step 2 State
  const initialFormData = {
    username: username,
    password: newPassword,
    name: "",
    name_e: "",
    dob: "",
    gender: "",
    phone: "",
    email: emailLocal, // Student's contact email
    generation_id: "",
    department_id: "",
    school_year: getCurrentSchoolYear(),
    year: "", // Will map to 'graduation_year' in sheet
    status: "",
    village: "",
    district: "",
    province: "",
    status_user: "user",
  };
  const [formData, setFormData] = useState(initialFormData);

  const schoolYearOptions = generateSchoolYears();

  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    } else if (activeStep === 1) {
      // Only enable resend if on verification step and cooldown is over
      setCanResendCode(true);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown, activeStep]);

  const startResendCooldown = () => {
    setResendCooldown(120); // 120 seconds cooldown
    setCanResendCode(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleInputChange = (e) => {
    setVerificationCode(e.target.value);
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const validateFields = () => {
    setError("");
    switch (activeStep) {
      case 0:
        if (!username || !emailLocal || !newPassword) {
          setError("Please fill out Username, Email, and Password.");
          return false;
        }
        if (!/\S+@\S+\.\S+/.test(emailLocal)) {
          setError("Please enter a valid email address.");
          return false;
        }
        if (newPassword.length < 6) {
          setError("Password must be at least 6 characters long.");
          return false;
        }
        break;
      case 1:
        if (!verificationCode) {
          setError("Please enter the verification code.");
          return false;
        }
        break;
      case 2:
        const requiredFieldsStep2 = [
          "name",
          "name_e",
          "dob",
          "gender",
          "phone",
          "generation_id",
          "department_id",
          "school_year",
          "status",
        ];

        if (
          formData.status &&
          (formData.status === "ກຳລັງຮຽນ" ||
            formData.status === "ຈົບການສຶກສາແລ້ວ")
        )
          for (const field of requiredFieldsStep2) {
            if (!formData[field]) {
              const fieldName = field
                .replace(/_/g, " ")
                .replace(/\b\w/g, (l) => l.toUpperCase());
              setError(`Please fill out the field: ${fieldName}.`);
              return false;
            }
          }
        break;
      default:
        break;
    }
    return true;
  };

  // ฟังก์ชันที่เรียกเมื่อกดปุ่ม
  const handleSendVerificationEmail = async (isResend = false) => {
    if (loading || resendCooldown > 0 || !canResendCode) return;

    setLoading(true);
    setCanResendCode(false);
    setError(null); // ถ้ามี setError เพื่อเคลียร์ข้อความเก่า

    try {
      const res = await axios.post(`${apiemail}/send-code`, {
        email: emailLocal,
        user_name: username,
      });

      Swal.fire({
        icon: "success",
        title: isResend ? "Code Resent" : "Verification Code Sent",
        text: `A verification code has been sent to ${emailLocal}`,
      });

      // เริ่มนับถอยหลังใหม่
      setResendCooldown(startResendCooldown);
    } catch (err) {
      console.error(err);
      setError("Failed to send verification code.");
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Unable to send verification code. Please try again.",
      });
      setCanResendCode(true); // ให้กดใหม่ได้อีกครั้ง
    } finally {
      setLoading(false);
    }
  };
  const checkDuplicateAccount = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apisheet}/all-sheet-data/${selectedId}`);

      if (!res.ok) throw new Error("Failed to fetch sheet data");

      const allData = await res.json();
      const usernames = new Set();
      const emails = new Set();
      const passwords = new Set();

      for (const sheet of allData) {
        const [header, ...rows] = sheet.data;
        const usernameIndex = header.indexOf("username");
        const emailIndex = header.indexOf("email");
        const passIndex = header.indexOf("password");

        if (usernameIndex === -1 || emailIndex === -1 || passIndex === -1)
          continue;

        for (const row of rows) {
          if (row[usernameIndex]) usernames.add(row[usernameIndex].trim());
          if (row[emailIndex]) emails.add(row[emailIndex].trim());
          if (row[passIndex]) passwords.add(row[passIndex].trim());
        }
      }

      if (usernames.has(username)) {
        setError("Username already exists. Please choose a different one.");
        Swal.fire({
          icon: "warning",
          title: "Username Taken",
          text: "Please choose another username.",
        });
        return false;
      }

      if (emails.has(emailLocal)) {
        setError("Email already used. Please use a different email.");
        Swal.fire({
          icon: "warning",
          title: "Email Exists",
          text: "Please use a different email address.",
        });
        return false;
      }

      /*
      ✅ ส่งโค้ดยืนยันหากทั้ง username และ email ยังไม่ซ้ำ
      await axios.post(`${apiemail}/send-code`, {
        email: emailLocal,
        user_name: username,
      });
      */

      setActiveStep(activeStep + 2);
      return true;
    } catch (err) {
      console.error(err);
      setError("Error checking duplicate account.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    if (!validateFields()) return;
    setLoading(true);
    setError("");

    try {
      switch (activeStep) {
        case 0:
          console.log(
            `SIMULATE: Checking username ${username}. Assuming it's available.`
          );
          // --- END ACTUAL BACKEND CALL ---
          await checkDuplicateAccount();
          startResendCooldown();

          break;

        case 1:
          console.log(
            `SIMULATE: Verifying code ${verificationCode} for ${emailLocal}. Assuming success.`
          );
          try {
            setLoading(true);

            const res = await axios.post(`${apiemail}/verify-code`, {
              email: emailLocal.trim(),
              code: verificationCode.trim(),
            });

            Swal.fire({
              icon: "success",
              title: "Email Verified!",
              text: "Your email has been successfully verified.",
            });

            setActiveStep(activeStep + 1); // หรือ setActiveStep(2)
          } catch (error) {
            Swal.fire({
              icon: "error",
              title: "Verification Failed",
              text: error?.response?.data || "Invalid verification code.",
            });
            console.error("Verification error:", error);
          } finally {
            setLoading(false);
          }
          break;

        case 2: {
          const sheetData = {
            // สมมติว่า backend จะ hash เอง
            ...formData,
            username: username,
            password: newPassword,
            email: emailLocal,
          };

          try {
            // เรียก API ส่งไปยัง backend (อัปเดต URL ตามจริง)
            const response = await axios.post(
              `${apisheet}/save_to_sheets_to_login`,
              {
                spreadsheetId: selectedId, // หรือรับมาจาก config
                data: [sheetData], // ส่งเป็น array สำหรับรองรับหลายรายการ
              }
            );

            console.log("✅ API Response:", response.data);

            Swal.fire({
              icon: "success",
              title: "Registration Successful!",
              text: "Student data has been submitted.",
            });

            // ล้างค่า
            setUsername("");
            setEmailLocal("");
            setNewPassword("");
            setVerificationCode("");
            setFormData(initialFormData);
            navigate("/login");
          } catch (error) {
            console.error("❌ API error:", error);
            Swal.fire({
              icon: "error",
              title: "Save Failed",
              text: error?.response?.data?.error || "Something went wrong.",
            });
          }
          break;
        }
      }
    } catch (err) {
      const apiError =
        err.response?.data?.message ||
        err.message ||
        "An operation failed. Please try again.";
      setError(apiError);
      Swal.fire({ icon: "error", title: "Operation Error", text: apiError });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (activeStep === 2) {
      handleNext();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (
        activeStep === 0 &&
        username &&
        emailLocal &&
        newPassword &&
        !loading
      ) {
        handleNext();
      } else if (activeStep === 1 && verificationCode && !loading) {
        handleNext();
      }
      // For activeStep 2, the form's onSubmit will handle Enter.
    }
  };

  return (
    <Box
      sx={{
        mx: "auto",
        p: { xs: 2, sm: 4 },
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 3 }}>
        <Typography variant="h4" align="center" gutterBottom>
          ລົງທະບຽນນັກສຶກສາ (Student Registration)
        </Typography>

        {error && (
          <Typography
            color="error"
            align="center"
            sx={{ mb: 2, whiteSpace: "pre-line" }}
          >
            {error}
          </Typography>
        )}
        {loading && (
          <Suspense fallback={<div />}>
            <LoadingComponent loading={loading} />
          </Suspense>
        )}
        <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Step 0: Account Setup */}
        {activeStep === 0 && (
          <>
            <TextField
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleKeyDown}
              fullWidth
              margin="normal"
              required
            />
            <Tooltip
              title={gmailtext}
              open={showTooltip && !emailLocal}
              disableHoverListener={false}
              placement="top-start"
            >
              <TextField
                label="Email (for verification)"
                type="email"
                value={emailLocal}
                onChange={(e) => setEmailLocal(e.target.value)}
                onFocus={() => setShowTooltip(true)}
                onBlur={() => setShowTooltip(false)}
                onKeyDown={handleKeyDown}
                fullWidth
                margin="normal"
                required
              />
            </Tooltip>
            <FormControl fullWidth variant="standard" sx={{ mt: 1, mb: 2 }}>
              <InputLabel htmlFor="register-password">Password</InputLabel>
              <Input
                id="register-password"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                required
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            <Button
              onClick={handleNext}
              variant="contained"
              fullWidth
              disabled={loading || !username || !emailLocal || !newPassword}
            >
              Next (Personal Info)
            </Button>
          </>
        )}

        {/* Step 1: Email Verification */}
        {activeStep === 1 && (
          <>
            <Typography sx={{ mt: 2, mb: 1, textAlign: "center" }}>
              A verification code was sent to <strong>{emailLocal}</strong>.
            </Typography>
            <TextField
              label="Verification Code"
              value={verificationCode}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              fullWidth
              margin="normal"
              required
            />
            <Button
              onClick={handleNext}
              variant="contained"
              fullWidth
              disabled={loading || !verificationCode}
            >
              Verify & Proceed
            </Button>
            <Button
              onClick={() => handleSendVerificationEmail(true)}
              variant="text"
              fullWidth
              sx={{ mt: 1 }}
              disabled={loading || !canResendCode || resendCooldown > 0}
            >
              {resendCooldown > 0
                ? `Resend Code in ${resendCooldown}s`
                : "Resend Code"}
            </Button>
            <Button
              onClick={() => setActiveStep(0)}
              variant="outlined"
              fullWidth
              sx={{ mt: 1 }}
              disabled={loading}
            >
              Back to Account Setup
            </Button>
          </>
        )}

        {/* Step 2: Student Details */}
        {activeStep === 2 && (
          <Box
            component="form"
            onSubmit={handleSubmitForm}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2, // ระยะห่างระหว่าง TextField
              maxWidth: 600, // กำหนดความกว้างสูงสุดบน desktop
              mx: "auto", // จัดให้อยู่กึ่งกลางแนวนอน
              px: 2, // padding ซ้ายขวา เพื่อไม่ชิดขอบจอบนมือถือ
            }}
          >
            <SectionTitle title="ຂໍ້ມູນສ່ວນຕົວ (Personal Info)" />

            <TextField
              label="ຊື່ ແລະ ນາມສະກຸນ (Lao Name)"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
            />

            <TextField
              label="Name and Surname (English)"
              name="name_e"
              value={formData.name_e}
              onChange={handleChange}
              fullWidth
              required
            />

            <TextField
              label="ວັນເດືອນປີເກິດ (Date of Birth)"
              name="dob"
              type="date"
              value={formData.dob}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
              required
              sx={{ minWidth: 130 }}
            />

            <TextField
              select
              label="ເພດ (Gender)"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              fullWidth
              required
              sx={{ minWidth: 130 }}
            >
              {genders.map((g) => (
                <MenuItem key={g.value} value={g.value}>
                  {g.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="ເບີໂທ (Phone Number)"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              fullWidth
              required
            />

            <TextField
              label="ອີເມວຕິດຕໍ່ (Contact Email)"
              name="email"
              type="email"
              value={emailLocal}
              fullWidth
              required
              disabled
              multiline
              minRows={2}
            />

            <SectionTitle title="ຂໍ້ມູນການສຶກສາ (Educational Info)" />

            <TextField
              label="ລຸ້ນທີ (Generation ID)"
              name="generation_id"
              value={formData.generation_id}
              onChange={handleChange}
              fullWidth
              required
              select
              sx={{ minWidth: 170 }}
            >
              {Array.from({ length: 10 }, (_, i) => i).map((s) => (
                <MenuItem key={s} value={s + 1}>
                  ລຸ້ນທີ {s + 1}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="ສາຂາ (Department ID)"
              name="department_id"
              value={formData.department_id}
              onChange={handleChange}
              fullWidth
              required
              select
              sx={{ minWidth: 170 }}
            >
              {dep.map((d) => (
                <MenuItem key={d.id} value={d.id}>
                  {d.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="ສົກຮຽນ (School Year)"
              name="school_year"
              value={formData.school_year}
              onChange={handleChange}
              fullWidth
              required
            >
              {schoolYearOptions.map((sy) => (
                <MenuItem key={sy} value={sy}>
                  {sy}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="ສະຖານະການສຶກສາ (Educational Status)"
              name="status"
              value={formData.status}
              onChange={handleChange}
              fullWidth
              required
              sx={{ minWidth: 150 }}
            >
              {statuses.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </TextField>

            {formData.status === "ກຳລັງຮຽນ" && (
              <TextField
                select
                label="ຊັ້ນປີປັດຈຸບັນ (Current Year Level)"
                name="year"
                value={formData.year}
                onChange={handleChange}
                fullWidth
                required
                sx={{ minWidth: 150 }}
              >
                {Array.from({ length: 4 }, (_, i) => i).map((s) => (
                  <MenuItem key={s} value={s + 1}>
                    ປີ {s + 1}
                  </MenuItem>
                ))}
              </TextField>
            )}

            <SectionTitle title="ຂໍ້ມູນທີ່ຢູ່ເກີດ (Birth Address Info)" />

            <TextField
              label="ບ້ານ (Village)"
              name="village"
              value={formData.village}
              onChange={handleChange}
              fullWidth
              required
            />

            <TextField
              label="ເມືອງ (District)"
              name="district"
              value={formData.district}
              onChange={handleChange}
              fullWidth
              required
            />

            <TextField
              label="ແຂວງ (Province)"
              name="province"
              value={formData.province}
              onChange={handleChange}
              fullWidth
              required
            />

            <Box mt={4} textAlign="center">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={loading}
              >
                {loading ? "ກຳລັງລົງທະບຽນ..." : "ລົງທະບຽນ (Register)"}
              </Button>
              <Button
                onClick={() => setActiveStep(0)}
                variant="outlined"
                sx={{ ml: 2, mt: { xs: 1, sm: 0 } }}
                disabled={loading}
              >
                Back to Account Setup
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

const SectionTitle = ({ title }) => (
  <Box mt={4} mb={2}>
    <Typography variant="h6" sx={{ fontWeight: "bold", color: "primary.main" }}>
      {title}
    </Typography>
    <Box sx={{ height: 2, width: 40, bgcolor: "primary.main", mt: 0.5 }} />
  </Box>
);

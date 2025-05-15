import React, { useState, Suspense } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  Container,
  FormControl,
  Input,
  InputAdornment,
  InputLabel,
  Link,
  Typography,
  CardMedia,
  IconButton,
} from "@mui/material";
import { AccountCircle, Visibility, VisibilityOff } from "@mui/icons-material";
import KeyIcon from "@mui/icons-material/Key";
import imasv from "./assets/SV.webp";
import Swal from "sweetalert2";
import { apisheet } from "./URL";

// Lazy load loading component to reduce bundle size
const LoadingComponent = React.lazy(() => import("./Loding/loading"));

export default function LoginRegister() {
  const [error, setError] = useState(""); // ✅ ใส่ API URL ที่ถูกต้อง
  // ✅ แก้ให้ตรงกับ API ที่ใช้
  const selectedId = "1CBTOY_ONHb218cDluUtjE92KHqVyzmts4kucizDup1A"; // ✅ กำหนด ID ชีตที่ต้องการตรวจสอบ
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);
  const handleMouseDownPassword = (event) => event.preventDefault();
  const isFormValid = () => username && password;

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && isFormValid()) {
      handleLoginSubmit(e);
    }
  };

  const handleLoginSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    // ✅ ตรวจสอบข้อมูลซ้ำใน Google Sheet
    const isUnique = await checkDuplicateAccount();
    if (!isUnique) return;

    // ✅ ดึงข้อมูลจากชีตที่ตรงกัน
    const sheetRes = await fetch(`${apisheet}/all-sheet-data/${selectedId}`);
    const allData = await sheetRes.json();

    let foundUser = null;

    for (const sheet of allData) {
      const [header, ...rows] = sheet.data;
      const usernameIndex = header.indexOf("username");
      const passwordIndex = header.indexOf("password");

      const match = rows.find(
        (row) =>
          row[usernameIndex]?.trim() === username &&
          row[passwordIndex]?.trim() === password
      );

      if (match) {
        const userSheetObj = Object.fromEntries(
          header.map((key, i) => [key, match[i]])
        );
        localStorage.setItem("user_sheet", JSON.stringify(userSheetObj));
        foundUser = userSheetObj;
        break;
      }
    }

    if (foundUser) {
      Swal.fire({
        icon: "success",
        title: "ເຂົ້າສູ່ລະບົບສຳເລັດ!",
        text: `ຍີນດີຕ້ອນຮິບ ${foundUser.name || ""}`,
        timer: 2000,
        showConfirmButton: false,
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } else {
      Swal.fire({
        icon: "error",
        title: "ບໍ່ມີຂໍ້ມຼນ",
        text: "ຊື່ຜູ້ໃຊ້ ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ",
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    Swal.fire({
      icon: "error",
      title: "ເກີດຂໍ້ຜິດພາດ",
      text: "ບໍ່ສາມາດເຂົ້າສູ່ລະບົບໄດ້",
    });
  } finally {
    setLoading(false);
  }
};


  const checkDuplicateAccount = async () => {
    try {
      const res = await fetch(`${apisheet}/all-sheet-data/${selectedId}`);
      if (!res.ok) throw new Error("Failed to fetch sheet data");
      const allData = await res.json();

      const usernames = new Set();
      const passwords = new Set();

      for (const sheet of allData) {
        const [header, ...rows] = sheet.data;
        const usernameIndex = header.indexOf("username");
        const passwordIndex = header.indexOf("password");

        if (usernameIndex === -1 || passwordIndex === -1) continue;

        for (const row of rows) {
          if (row[usernameIndex]) usernames.add(row[usernameIndex].trim());
          if (row[passwordIndex]) passwords.add(row[passwordIndex].trim());
        }
      }

      if (!usernames.has(username)) {
        Swal.fire({
          icon: "error",
          title: "Username not found",
          text: "ບໍ່ຊື່ນີ້ໃນຖານຂໍ້ມູນ",
        });
        return false;
      }

      if (!passwords.has(password)) {
        Swal.fire({
          icon: "error",
          title: "Incorrect Password",
          text: "ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ",
        });
        return false;
      }

      return true;
    } catch (err) {
      console.error(err);
      setError("Error checking duplicate account.");
      return false;
    }
  };

  return (
    <Container
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card
        sx={{
          width: { xs: "100%", sm: 400 },
          p: 3,
          boxShadow: 3,
          borderRadius: 3,
        }}
      >
        <Suspense fallback={<div />}>
          <LoadingComponent loading={loading} />
        </Suspense>

        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <CardMedia
            component="img"
            src={imasv}
            alt="Novel cover"
            loading="lazy"
            sx={{
              width: 120,
              height: 120,
              borderRadius: 2,
              objectFit: "cover",
              mb: 1,
            }}
          />
        </Box>

        <Typography
          variant="h5"
          component="h1"
          align="center"
          gutterBottom
          sx={{ fontWeight: "bold" }}
        >
          Login
        </Typography>

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>UserName</InputLabel>
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleKeyDown}
            startAdornment={
              <InputAdornment position="start">
                <AccountCircle />
              </InputAdornment>
            }
          />
        </FormControl>

        <FormControl fullWidth variant="standard" sx={{ mb: 3 }}>
          <InputLabel>Password</InputLabel>
          <Input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            startAdornment={
              <InputAdornment position="start">
                <KeyIcon />
              </InputAdornment>
            }
            endAdornment={
              <InputAdornment position="end">
                <IconButton
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
          variant="contained"
          fullWidth
          disabled={!isFormValid()}
          onClick={handleLoginSubmit}
          sx={{ mb: 2 }}
        >
          Login
        </Button>

        <Typography align="center" sx={{ mb: 1 }}>
          No account? <Link href="/register">Register</Link>
        </Typography>

        <Box sx={{ textAlign: "center" }}>
          <Link href="/forgotpassword">Forgot Password?</Link>
        </Box>
      </Card>
    </Container>
  );
}

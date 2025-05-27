import React from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BarChartIcon from "@mui/icons-material/BarChart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PersonIcon from "@mui/icons-material/Person";

let extraNav = [];

const storedUser = localStorage.getItem("user_sheet");

if (storedUser) {
  try {
    const user = JSON.parse(storedUser); // ✅ แปลงเป็น object ก่อนใช้
    if (user.status_user === "admin") {
      extraNav.push(
        {
          segment: "admin/people",
          title: "People",
          icon: <PersonIcon />,
          pattern: "people{/:personId}*",
        },
        {
          segment: "admin/cc",
          title: "cc",
          icon: <PersonIcon />,
          pattern: "people{/:personId}*",
        }
      );
    }
  } catch (err) {
    console.error("❌ Failed to parse user_sheet:", err);
  }
}


export const NAVIGATION = [
  { kind: "header", title: "Main items" },
  { segment: "profire", title: "ກ່ຽວກັບບັນຊີ", icon: <AccountCircleIcon /> },
  { kind: "divider" },
  { segment: " ", title: "ໜ້າຫຼັກ", icon: <DashboardIcon /> },
  { segment: "score", title: "ເບີ່ງຄະແນນ", icon: <DashboardIcon /> },
  {
    segment: "credit-recovery",
    title: "ເກັບໜ່ວຍກິດຄືນ",
    icon: <BarChartIcon />,
  },
  { kind: "divider" },
  ...extraNav,
];

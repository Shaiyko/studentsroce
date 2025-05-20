// src/components/Navigation.js
import React from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BarChartIcon from "@mui/icons-material/BarChart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
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
];

import React from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Box sx={{ display: "flex", gap: 2 }}>
        <Box
          onClick={() => navigate("/credit-recovery")}
          sx={{
            cursor: "pointer",
            p: 3,
            borderRadius: 2,
            flex: 1,
            textAlign: "center",
            bgcolor: "primary.light",
            color: "primary.contrastText",
            boxShadow: 3,
            "&:hover": {
              bgcolor: "primary.main",
            },
          }}
        >
          <Typography variant="h6">ເກັບໜ່ວຍກິດຄືນ</Typography>
          <Typography variant="body2" mt={1}>
            ການກວດເບິ່ງ ແລະ ເກັບໜ່ວຍກິດຄືນ
          </Typography>
        </Box>

        <Box
          onClick={() => navigate("/score")}
          sx={{
            cursor: "pointer",
            p: 3,
            borderRadius: 2,
            flex: 1,
            textAlign: "center",
            bgcolor: "secondary.light",
            color: "secondary.contrastText",
            boxShadow: 3,
            "&:hover": {
              bgcolor: "secondary.main",
            },
          }}
        >
          <Typography variant="h6">ເບີ່ງຄະແນນ</Typography>
          <Typography variant="body2" mt={1}>
            ເບີ່ງຄະແນນນັກສຶກສາ
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

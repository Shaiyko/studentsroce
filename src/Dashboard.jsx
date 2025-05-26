import React from "react";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // หน้าจอ <600px

  return (
    <Box sx={{ p: { xs: 2, sm: 4 } }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
        }}
      >
        {/* Box 1 */}
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

        {/* Box 2 */}
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

        {/* Box 3 */}
        <Box
          onClick={() => navigate("/register")}
          sx={{
            cursor: "pointer",
            p: 3,
            borderRadius: 2,
            flex: 1,
            textAlign: "center",
            bgcolor: "#035b26",
            color: "secondary.contrastText",
            boxShadow: 3,
            "&:hover": {
              bgcolor: "success.main",
            },
          }}
        >
          <Typography variant="h6">ລົງທະບຽນ</Typography>
          <Typography variant="body2" mt={1}>
            ບ່ອນລົງທະບຽນຂໍ້ມູນນັກສຶກສາ
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

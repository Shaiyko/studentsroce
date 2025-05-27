import { Box, Typography, Button } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

export default function NotFoundPage({ message = "Content not found", showLogin = true }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#f8f8f8",
        padding: 2,
      }}
    >
      <Box
        sx={{
          textAlign: "center",
          bgcolor: "#fff",
          padding: 4,
          borderRadius: 3,
          boxShadow: 3,
          maxWidth: 400,
          width: "100%",
        }}
      >
        <ErrorOutlineIcon sx={{ fontSize: 60, color: "error.main", mb: 1 }} />
        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
          404
        </Typography>
        <Typography variant="h6" sx={{ mb: 2, color: "text.secondary" }}>
          {message}
        </Typography>

        {showLogin && (
          <Button
            variant="contained"
            color="primary"
            href="/login"
            sx={{ textTransform: "none" }}
          >
            ໄປໜ້າ Login
          </Button>
        )}
      </Box>
    </Box>
  );
}

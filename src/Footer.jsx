import React from "react";
import { Box, Typography, Divider, Container } from "@mui/material";
import Grid from "@mui/material/Grid";
const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "primary.main",
        color: "white",
        pt: 5,
        pb: 3,
        mt: "auto",
      }}
    >
      <Container maxWidth="lg">
        
        <Grid
          sx={{ display: "flex", justifyContent: "center" }}
          container
          spacing={4}
        >
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="inherit" gutterBottom>
              ຕິກຕໍ່ເຮົາ
            </Typography>
            <Typography variant="body2">ທີ່ຢູ່:</Typography>
            <Typography variant="body2">ໂທ: 02-123-4567</Typography>
            <Typography variant="body2">ອີເມວ: info@school.ac.th</Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my:1,bgcolor: "rgba(255, 255, 255, 0.1)" }} />

        <Typography
          variant="body2"
          color="inherit"
          align="center"
          sx={{ mt: 2 }}
        >
          &copy; {new Date().getFullYear()} ສະຖາບັນທຸລະກິດແສງສະຫວັນ.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;

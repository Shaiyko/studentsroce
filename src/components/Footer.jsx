import React from "react";
import { Box, Typography, Divider, Container } from "@mui/material";
import Grid from "@mui/material/Grid";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "rgba(22, 193, 245, 0.64)",
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
            <Typography fontFamily={"NotoSansLaoLooped"} variant="h6" color="inherit" gutterBottom>
              ຕິກຕໍ່ເຮົາ
            </Typography>
            <Typography fontFamily={"NotoSansLaoLooped"} variant="body2">
              ທີ່ຢູ່: ບ້ານ ສີຫວາດ ເມືອງ ຈັນທະບູລີ ແຂວງ ນະຄອນຫຼວງວຽງຈັນ
            </Typography>
            <Typography fontFamily={"NotoSansLaoLooped"} variant="body2">
              ໂທ: 021-223-822, 020 589 790 79
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 1, bgcolor: "rgba(255, 255, 255, 0.1)" }} />

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

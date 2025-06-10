import React from "react";
import {
  Box,
  Typography,
  Divider,
  Container,
  Grid,
  useTheme,
} from "@mui/material";

const Footer = () => {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        pt: 5,
        pb: 3,
        mt: "auto",
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={3}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                fontFamily: "NotoSansLaoLooped",
                fontWeight: "bold",
                color: theme.palette.text.primary,
              }}
            >
              ຕິດຕໍ່ເຮົາ
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontFamily: "NotoSansLaoLooped", color: theme.palette.text.secondary }}
            >
              ທີ່ຢູ່: ບ້ານ ສີຫວາດ ເມືອງ ຈັນທະບູລີ ແຂວງ ນະຄອນຫຼວງວຽງຈັນ
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontFamily: "NotoSansLaoLooped", color: theme.palette.text.secondary }}
            >
              ໂທ: 021-223-822, 020 589 790 79
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontFamily: "NotoSansLaoLooped", color: theme.palette.text.secondary }}
            >
              ອີເມວຕິດຕໍ່: svistinotitution.info@gmail.com
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3, bgcolor: theme.palette.divider }} />

        <Typography
          variant="body2"
          align="center"
          sx={{
            mt: 2,
            fontFamily: "NotoSansLaoLooped",
            color: theme.palette.text.secondary,
          }}
        >
          &copy; {new Date().getFullYear()} ສະຖາບັນທຸລະກິດແສງສະຫວັນ
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;

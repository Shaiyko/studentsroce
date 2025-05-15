import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Backdrop } from '@mui/material';

const LoadingComponent = ({ loading }) => {
  return (
    <Backdrop
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // เพิ่มความโปร่งแสง
        flexDirection: 'column',
      }}
      open={loading}
    >
      <CircularProgress
        size={80}
        thickness={5}
        sx={{ mb: 2 }}
      />
      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
        กำลังโหลดข้อมูล...
      </Typography>
    </Backdrop>
  );
};

export default LoadingComponent;

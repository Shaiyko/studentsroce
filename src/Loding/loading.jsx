import React from 'react';
import { Skeleton, Box, Typography } from '@mui/material';

const SkeletonLoaderComponent = ({ loading }) => {
  if (!loading) return null;

  return (
    <Box sx={{ p: 2 }}>

      {/* Skeleton สำหรับหัวเรื่อง */}
      <Skeleton variant="text" width={200} height={40} />

      {/* Skeleton สำหรับกล่องเนื้อหา */}
      <Skeleton variant="rectangular" width="100%" height={100} sx={{ my: 2 }} />
      <Skeleton variant="rectangular" width="100%" height={100} sx={{ mb: 2 }} />

      {/* Skeleton สำหรับรายการย่อย */}
      <Skeleton variant="text" width="60%" />
      <Skeleton variant="text" width="80%" />
      <Skeleton variant="text" width="40%" />
    </Box>
  );
};

export default SkeletonLoaderComponent;

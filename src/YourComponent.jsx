import React, { useState } from "react";
import {
  Grid,
  Autocomplete,
  TextField,
  IconButton,
  Popover,
  Typography,
  Box,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

function YourComponent({ filters, setFilters, error, setError, classroom }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const open = Boolean(anchorEl);
  const id = open ? "popover-classroom" : undefined;

  const handleKeyDownS = (e) => {
    // กด Enter, Tab แล้วทำอะไรต่อ
  };

  return (
    <Grid item xs={12} md={4}>
      <Autocomplete
        freeSolo
        fullWidth
        options={classroom}
        value={filters.classrooms || ""}
        onInputChange={(event, newValue) => {
          setFilters({
            ...filters,
            classrooms: newValue,
            student: "",
            subject: "",
            score: "",
          });
          setError({ ...error, classrooms: false });
        }}
        sx={{ width: "300px" }} 
        renderInput={(params) => (
          <TextField
            {...params}
            label="Please select a classroom"
            fullWidth
            error={error.classrooms}
            helperText={error.classrooms ? "Please select a classroom" : ""}
            onKeyDown={handleKeyDownS}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  <IconButton
                    onClick={handleClick}
                    tabIndex={-1}
                    edge="end"
                    size="small"
                  >
                    <HelpOutlineIcon fontSize="small" />
                  </IconButton>
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Typography sx={{ p: 2 }}>ເລືອກຫ້ອງຮຽນ</Typography>
          <Box
            sx={{
              p: 2,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            BBA = ບໍລິຫານທຸລະກິດ BBAC = ບໍລິຫານທຸລະກິດ ຕໍ່ເນື່ອງ BBE =
            ພາສາອັງກິດ BSW = ວິສະວະຊອບແວ
          </Box>
          <Typography sx={{ p: 2 }}>
            ເລກຫຼັງລະຫັດແມ່ນລຸ້ນ ນັກສຶກສາ ເລກຫຼັງ Y ແມ່ນປີຈົບການສຶກສາ
          </Typography>
        </Box>
      </Popover>
    </Grid>
  );
}

export default YourComponent;

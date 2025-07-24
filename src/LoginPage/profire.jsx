import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Typography,
} from "@mui/material";
import axios from "axios";
import { apisheet } from "../URL";
import LoadingComponent from "../loding/loadinglogin";
import Swal from "sweetalert2";

const genders = [
  { value: "M", label: "ຊາຍ" },
  { value: "F", label: "ຍິງ" },
];

const statuses = ["ກຳລັງຮຽນ", "ຈົບການສຶກສາແລ້ວ", "ອອກແລ້ວ", "ພັກການຮຽນ"];
const dep = [
  {
    id: 1,
    name: "ສາຂາວິຊາ ບໍລິຫານ ທຸລະກິດຕໍ່ເນື່ອງ",
  },
  {
    id: 2,
    name: "ສາຂາວິຊາ ການຄ້າເອເລັກໂຕນິກ (ຄອມພິວເຕອທຸລະກິດ)",
  },
  {
    id: 3,
    name: "ສາຂາວິຊາ ຜູ້ປະກອບການ",
  },
  {
    id: 4,
    name: "ສາຂາວິຊາ ພາສາອັງກິດ",
  },
  {
    id: 5,
    name: "ສາຂາວິຊາ ວິຊະວະກຳຊອບແວ",
  },
  {
    id: 6,
    name: "ສາຂາວິຊາ ບໍລິຫານ ທຸລະກິດ",
  },
  {
    id: 7,
    name: "ສາຂາວິຊາ ພາສາອັງກິດຕໍ່ເນື່ອງ",
  },
];

const getCurrentSchoolYear = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; 
  if (month >= 10) {
    return `${year}-${year + 1}`;
  } else {
    return `${year - 1}-${year}`;
  }
};

const generateSchoolYears = () => {
  const years = [];
  const current = getCurrentSchoolYear(); 
  const startYear = parseInt(current.split("-")[0], 10); 
  for (let i = 0; i < 10; i++) {
    const y1 = startYear - i;
    const y2 = y1 + 1;
    years.push(`${y1}-${y2}`);
  }
  return years;
};

export default function StudentProfile() {
  const schoolYearOptions = generateSchoolYears();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const storedUser = localStorage.getItem("user_sheet");
    if (storedUser) {
      setProfile(JSON.parse(storedUser));
    }
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await axios.post(`${apisheet}/api/update-profile`, profile);
      localStorage.setItem("user_sheet", JSON.stringify(profile));
      Swal.fire({
        icon: "success",
        title: "ແກ້ໄຂສຳເລັດ!",
        text: `ຍີນດີຕ້ອນຮິບ `,
        timer: 3000,
      });
      setEditing(false);
    } catch (err) {
      alert("Failed to update profile: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <Box
      component="form"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2, 
        maxWidth: 600, 
        mx: "auto", 
        px: 2, 
      }}
      onSubmit={(e) => {
        e.preventDefault();
        handleSave();
      }}
    >
      <LoadingComponent loading={loading} />
      <Typography variant="h5" gutterBottom>
        ຂໍ້ມູນສ່ວນຕົວ (Personal Info)
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
        <Box sx={{ flex: 1 }}>
          <TextField
            label="ຊື່ ແລະ ນາມສະກຸນ (Lao Name)"
            name="name"
            value={profile.name || ""}
            onChange={handleChange}
            fullWidth
            required
            disabled={!editing}
            multiline
            minRows={2}
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <TextField
            label="Name and Surname (English)"
            name="name_e"
            value={profile.name_e || ""}
            onChange={handleChange}
            fullWidth
            required
            disabled={!editing}
            multiline
            minRows={2}
          />
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
        <Box sx={{ flex: 1 }}>
          <TextField
            label="ວັນເດືອນປີເກິດ"
            name="dob"
            type="date"
            value={profile.dob || ""}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            required
            disabled={!editing}
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <TextField
            select
            label="ເພດ"
            name="gender"
            value={profile.gender || ""}
            onChange={handleChange}
            fullWidth
            required
            disabled={!editing}
          >
            {genders.map((g) => (
              <MenuItem key={g.value} value={g.value}>
                {g.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </Box>

      <Typography variant="h6" sx={{ mt: 4 }}>
        ຂໍ້ມູນການສຶກສາ (Educational Info)
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
        <Box sx={{ flex: 1 }}>
          <TextField
            select
            label="ລຸ້ນທີ"
            name="generation_id"
            value={profile.generation_id || ""}
            onChange={handleChange}
            fullWidth
            required
            disabled={!editing}
          >
            {Array.from({ length: 10 }, (_, i) => (
              <MenuItem key={i} value={i + 1}>
                ລຸ້ນທີ {i + 1}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        <Box sx={{ flex: 1 }}>
          <TextField
            select
            label="ສາຂາ"
            name="department_id"
            value={profile.department_id || ""}
            onChange={handleChange}
            fullWidth
            required
            disabled={!editing}
            multiline
            minRows={2}
          >
            {dep.map((d) => (
              <MenuItem key={d.id} value={d.id}>
                {d.name}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
        <Box sx={{ flex: 1 }}>
          <TextField
            select
            label="ສົກຮຽນ"
            name="school_year"
            value={profile.school_year || ""}
            onChange={handleChange}
            fullWidth
            required
            disabled={!editing}
          >
            {schoolYearOptions.map((sy) => (
              <MenuItem key={sy} value={sy}>
                {sy}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        <Box sx={{ flex: 1 }}>
          <TextField
            select
            label="ສະຖານະການສຶກສາ"
            name="status"
            value={profile.status || ""}
            onChange={handleChange}
            fullWidth
            required
            disabled={!editing}
          >
            {statuses.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </Box>

      {profile.status === "ກຳລັງຮຽນ" && (
        <TextField
          select
          label="ປີປັດຈຸບັນ"
          name="year"
          value={profile.year || ""}
          onChange={handleChange}
          fullWidth
          required
          disabled={!editing}
        >
          {Array.from({ length: 4 }, (_, i) => (
            <MenuItem key={i} value={i + 1}>
              ປີ {i + 1}
            </MenuItem>
          ))}
        </TextField>
      )}

      <Typography variant="h6" sx={{ mt: 4 }}>
        ຂໍ້ມູນທີ່ຢູ່ເກີດ (Birth Address Info)
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
        <Box sx={{ flex: 1 }}>
          <TextField
            label="ບ້ານ"
            name="village"
            value={profile.village || ""}
            onChange={handleChange}
            fullWidth
            required
            disabled={!editing}
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <TextField
            label="ເມືອງ"
            name="district"
            value={profile.district || ""}
            onChange={handleChange}
            fullWidth
            required
            disabled={!editing}
          />
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
        <Box sx={{ flex: 1 }}>
          <TextField
            label="ແຂວງ"
            name="province"
            value={profile.province || ""}
            onChange={handleChange}
            fullWidth
            required
            disabled={!editing}
          />
        </Box>
      </Box>

      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Button variant="outlined" onClick={() => setEditing(!editing)}>
          {editing ? "Cancel" : "Edit"}
        </Button>
        {editing && (
          <Button type="submit" variant="contained" sx={{ ml: 2 }}>
            Save
          </Button>
        )}
      </Box>
    </Box>
  );
}
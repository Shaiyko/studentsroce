import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PencilIcon, CheckIcon, XMarkIcon, UserIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import { apisheet } from '../URL';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  const genders = [
    { value: "M", label: "ຊາຍ" },
    { value: "F", label: "ຍິງ" },
  ];

  const statuses = ["ກຳລັງຮຽນ", "ຈົບການສຶກສາແລ້ວ", "ອອກແລ້ວ", "ພັກການຮຽນ"];

  const departments = [
    { id: 1, name: "ສາຂາວິຊາ ບໍລິຫານ ທຸລະກິດຕໍ່ເນື່ອງ" },
    { id: 2, name: "ສາຂາວິຊາ ການຄ້າເອເລັກໂຕນິກ (ຄອມພິວເຕອທຸລະກິດ)" },
    { id: 3, name: "ສາຂາວິຊາ ຜູ້ປະກອບການ" },
    { id: 4, name: "ສາຂາວິຊາ ພາສາອັງກິດ" },
    { id: 5, name: "ສາຂາວິຊາ ວິຊະວະກຳຊອບແວ" },
    { id: 6, name: "ສາຂາວິຊາ ບໍລິຫານ ທຸລະກິດ" },
    { id: 7, name: "ສາຂາວິຊາ ພາສາອັງກິດຕໍ່ເນື່ອງ" },
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

  const schoolYearOptions = generateSchoolYears();

  useEffect(() => {
    const storedUser = localStorage.getItem("user_sheet");
    if (!storedUser) {
      toast.error("ກະລຸນາເຂົ້າສູ່ລະບົບກ່ອນ");
      navigate("/login");
      return;
    }

    try {
      const userData = JSON.parse(storedUser);
      setProfile(userData);
      setFormData(userData);
    } catch (error) {
      console.error("Error parsing user data:", error);
      toast.error("ຂໍ້ມູນຜູ້ໃຊ້ບໍ່ຖືກຕ້ອງ");
      navigate("/login");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simulate API call - replace with actual API endpoint
      const response = await fetch(`${apisheet}/api/update-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        localStorage.setItem("user_sheet", JSON.stringify(formData));
        setProfile(formData);
        setEditing(false);
        toast.success("ອັບເດດຂໍ້ມູນສຳເລັດ!");
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("ເກີດຂໍ້ຜິດພາດໃນການອັບເດດຂໍ້ມູນ");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(profile);
    setEditing(false);
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                <UserIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white font-lao">ຂໍ້ມູນສ່ວນຕົວ</h1>
                <p className="text-primary-100 font-lao">ຈັດການຂໍ້ມູນສ່ວນຕົວຂອງທ່ານ</p>
              </div>
            </div>
            <div className="flex space-x-2">
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-colors font-lao"
                >
                  <PencilIcon className="h-4 w-4 mr-2" />
                  ແກ້ໄຂ
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 font-lao"
                  >
                    {loading ? (
                      <LoadingSpinner size="sm" className="mr-2" />
                    ) : (
                      <CheckIcon className="h-4 w-4 mr-2" />
                    )}
                    ບັນທຶກ
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={loading}
                    className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 font-lao"
                  >
                    <XMarkIcon className="h-4 w-4 mr-2" />
                    ຍົກເລີກ
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 font-lao border-b pb-2">
                ຂໍ້ມູນສ່ວນຕົວ
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 font-lao mb-1">
                  ຊື່ ແລະ ນາມສະກຸນ (ລາວ)
                </label>
                {editing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                ) : (
                  <p className="text-gray-900 font-lao">{profile.name || 'ບໍ່ລະບຸ'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 font-lao mb-1">
                  ຊື່ ແລະ ນາມສະກຸນ (ອັງກິດ)
                </label>
                {editing ? (
                  <input
                    type="text"
                    name="name_e"
                    value={formData.name_e || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                ) : (
                  <p className="text-gray-900">{profile.name_e || 'ບໍ່ລະບຸ'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 font-lao mb-1">
                  ວັນເດືອນປີເກີດ
                </label>
                {editing ? (
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                ) : (
                  <p className="text-gray-900 font-lao">{profile.dob || 'ບໍ່ລະບຸ'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 font-lao mb-1">
                  ເພດ
                </label>
                {editing ? (
                  <select
                    name="gender"
                    value={formData.gender || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">ເລືອກເພດ</option>
                    {genders.map((gender) => (
                      <option key={gender.value} value={gender.value}>
                        {gender.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-gray-900 font-lao">
                    {genders.find(g => g.value === profile.gender)?.label || 'ບໍ່ລະບຸ'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 font-lao mb-1">
                  ເບີໂທ
                </label>
                {editing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                ) : (
                  <p className="text-gray-900">{profile.phone || 'ບໍ່ລະບຸ'}</p>
                )}
              </div>
            </div>

            {/* Educational Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 font-lao border-b pb-2">
                ຂໍ້ມູນການສຶກສາ
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 font-lao mb-1">
                  ລຸ້ນທີ
                </label>
                {editing ? (
                  <select
                    name="generation_id"
                    value={formData.generation_id || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">ເລືອກລຸ້ນທີ</option>
                    {Array.from({ length: 10 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        ລຸ້ນທີ {i + 1}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-gray-900 font-lao">
                    {profile.generation_id ? `ລຸ້ນທີ ${profile.generation_id}` : 'ບໍ່ລະບຸ'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 font-lao mb-1">
                  ສາຂາວິຊາ
                </label>
                {editing ? (
                  <select
                    name="department_id"
                    value={formData.department_id || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">ເລືອກສາຂາວິຊາ</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-gray-900 font-lao">
                    {departments.find(d => d.id == profile.department_id)?.name || 'ບໍ່ລະບຸ'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 font-lao mb-1">
                  ສົກຮຽນ
                </label>
                {editing ? (
                  <select
                    name="school_year"
                    value={formData.school_year || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">ເລືອກສົກຮຽນ</option>
                    {schoolYearOptions.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-gray-900">{profile.school_year || 'ບໍ່ລະບຸ'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 font-lao mb-1">
                  ສະຖານະການສຶກສາ
                </label>
                {editing ? (
                  <select
                    name="status"
                    value={formData.status || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">ເລືອກສະຖານະ</option>
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-gray-900 font-lao">{profile.status || 'ບໍ່ລະບຸ'}</p>
                )}
              </div>

              {(formData.status === "ກຳລັງຮຽນ" || profile.status === "ກຳລັງຮຽນ") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 font-lao mb-1">
                    ປີປັດຈຸບັນ
                  </label>
                  {editing ? (
                    <select
                      name="year"
                      value={formData.year || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">ເລືອກປີ</option>
                      {Array.from({ length: 4 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          ປີ {i + 1}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-gray-900 font-lao">
                      {profile.year ? `ປີ ${profile.year}` : 'ບໍ່ລະບຸ'}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Address Information */}
            <div className="md:col-span-2 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 font-lao border-b pb-2">
                ຂໍ້ມູນທີ່ຢູ່ເກີດ
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 font-lao mb-1">
                    ບ້ານ
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      name="village"
                      value={formData.village || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  ) : (
                    <p className="text-gray-900 font-lao">{profile.village || 'ບໍ່ລະບຸ'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 font-lao mb-1">
                    ເມືອງ
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      name="district"
                      value={formData.district || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  ) : (
                    <p className="text-gray-900 font-lao">{profile.district || 'ບໍ່ລະບຸ'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 font-lao mb-1">
                    ແຂວງ
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      name="province"
                      value={formData.province || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  ) : (
                    <p className="text-gray-900 font-lao">{profile.province || 'ບໍ່ລະບຸ'}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
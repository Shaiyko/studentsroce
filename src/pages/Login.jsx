import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon, UserIcon, KeyIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import { apisheet } from '../URL';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const selectedId = "1CBTOY_ONHb218cDluUtjE92KHqVyzmts4kucizDup1A";

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      toast.error('ກະລຸນາປ້ອນຊື່ຜູ້ໃຊ້ ແລະ ລະຫັດຜ່ານ');
      return;
    }

    setLoading(true);
    
    try {
      const sheetRes = await fetch(`${apisheet}/login-data/${selectedId}`);
      const allData = await sheetRes.json();

      let foundUser = null;

      for (const sheet of allData) {
        const [header, ...rows] = sheet.data;
        const usernameIndex = header.indexOf("username");
        const passwordIndex = header.indexOf("password");

        if (usernameIndex === -1 || passwordIndex === -1) continue;

        const match = rows.find(
          (row) =>
            row[usernameIndex]?.trim() === formData.username &&
            row[passwordIndex]?.trim() === formData.password
        );

        if (match) {
          const userSheetObj = Object.fromEntries(
            header.map((key, i) => [key, match[i]])
          );
          localStorage.setItem("user_sheet", JSON.stringify(userSheetObj));
          foundUser = userSheetObj;
          break;
        }
      }

      if (foundUser) {
        toast.success(`ຍີນດີຕ້ອນຮັບ ${foundUser.name || foundUser.username}!`);
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        toast.error('ຊື່ຜູ້ໃຊ້ ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('ເກີດຂໍ້ຜິດພາດໃນການເຂົ້າສູ່ລະບົບ');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && formData.username && formData.password && !loading) {
      handleSubmit(e);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <img
            className="mx-auto h-24 w-24 rounded-2xl shadow-lg"
            src="/SV.webp"
            alt="Logo"
          />
          <h2 className="mt-6 text-3xl font-bold text-gray-900 font-lao">
            ເຂົ້າສູ່ລະບົບ
          </h2>
          <p className="mt-2 text-sm text-gray-600 font-lao">
            ກະລຸນາປ້ອນຂໍ້ມູນເພື່ອເຂົ້າສູ່ລະບົບ
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-xl p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 font-lao mb-2">
                ຊື່ຜູ້ໃຊ້
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  placeholder="ປ້ອນຊື່ຜູ້ໃຊ້"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 font-lao mb-2">
                ລະຫັດຜ່ານ
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  placeholder="ປ້ອນລະຫັດຜ່ານ"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || !formData.username || !formData.password}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-lao"
              >
                {loading ? (
                  <div className="flex items-center">
                    <LoadingSpinner size="sm" className="mr-2" />
                    ກຳລັງເຂົ້າສູ່ລະບົບ...
                  </div>
                ) : (
                  'ເຂົ້າສູ່ລະບົບ'
                )}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 font-lao">
                ຍັງບໍ່ມີບັນຊີ?{' '}
                <Link
                  to="/register"
                  className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
                >
                  ລົງທະບຽນທີ່ນີ້
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
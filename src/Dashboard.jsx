import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  AcademicCapIcon, 
  ChartBarIcon, 
  UserPlusIcon,
  ArrowRightIcon 
} from '@heroicons/react/24/outline';

export default function Dashboard() {
  const navigate = useNavigate();

  const cards = [
    {
      title: "ເກັບໜ່ວຍກິດຄືນ",
      description: "ການກວດເບິ່ງ ແລະ ເກັບໜ່ວຍກິດຄືນ",
      icon: ChartBarIcon,
      path: "/credit-recovery",
      color: "from-blue-500 to-blue-600",
      hoverColor: "hover:from-blue-600 hover:to-blue-700"
    },
    {
      title: "ເບີ່ງຄະແນນ",
      description: "ເບີ່ງຄະແນນນັກສຶກສາ",
      icon: AcademicCapIcon,
      path: "/score",
      color: "from-green-500 to-green-600",
      hoverColor: "hover:from-green-600 hover:to-green-700"
    },
    {
      title: "ລົງທະບຽນ",
      description: "ບ່ອນລົງທະບຽນຂໍ້ມູນນັກສຶກສາ",
      icon: UserPlusIcon,
      path: "/register",
      color: "from-purple-500 to-purple-600",
      hoverColor: "hover:from-purple-600 hover:to-purple-700"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-lao mb-4">
              ຍີນດີຕ້ອນຮັບ
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 font-lao">
              ສະຖາບັນທຸລະກິດແສງສະຫວັນ
            </p>
            <div className="mt-8 flex justify-center">
              <img 
                src="/SV.webp" 
                alt="Logo" 
                className="h-24 w-24 rounded-full shadow-lg bg-white p-2"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 font-lao mb-4">
            ເລືອກບໍລິການ
          </h2>
          <p className="text-lg text-gray-600 font-lao">
            ເລືອກບໍລິການທີ່ທ່ານຕ້ອງການໃຊ້ງານ
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                onClick={() => navigate(card.path)}
                className={`relative group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl`}
              >
                <div className={`bg-gradient-to-br ${card.color} ${card.hoverColor} rounded-2xl p-8 text-white shadow-xl transition-all duration-300`}>
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                      <Icon className="h-8 w-8" />
                    </div>
                    <ArrowRightIcon className="h-6 w-6 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                  
                  <h3 className="text-2xl font-bold font-lao mb-3">
                    {card.title}
                  </h3>
                  
                  <p className="text-white text-opacity-90 font-lao leading-relaxed">
                    {card.description}
                  </p>
                  
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Info Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 font-lao mb-4">
              ຂໍ້ມູນຕິດຕໍ່
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-600">
              <div>
                <h4 className="font-semibold font-lao mb-2">ທີ່ຢູ່</h4>
                <p className="font-lao">ບ້ານ ສີຫວາດ ເມືອງ ຈັນທະບູລີ</p>
                <p className="font-lao">ແຂວງ ນະຄອນຫຼວງວຽງຈັນ</p>
              </div>
              <div>
                <h4 className="font-semibold font-lao mb-2">ເບີໂທ</h4>
                <p>021-223-822</p>
                <p>020 589 790 79</p>
              </div>
              <div>
                <h4 className="font-semibold font-lao mb-2">ອີເມວ</h4>
                <p>svistinotitution.info@gmail.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
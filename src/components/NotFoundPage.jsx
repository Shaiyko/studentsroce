import React from 'react';
import { Link } from 'react-router-dom';
import { ExclamationTriangleIcon, HomeIcon } from '@heroicons/react/24/outline';

export default function NotFoundPage({ message = "ບໍ່ພົບໜ້າທີ່ຄົ້ນຫາ", showLogin = true }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-red-100 rounded-full">
              <ExclamationTriangleIcon className="h-12 w-12 text-red-600" />
            </div>
          </div>
          
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          
          <h2 className="text-xl font-semibold text-gray-700 font-lao mb-4">
            {message}
          </h2>
          
          <p className="text-gray-500 font-lao mb-8">
            ໜ້າທີ່ທ່ານຄົ້ນຫາບໍ່ມີຢູ່ ຫຼື ຖືກຍ້າຍໄປແລ້ວ
          </p>
          
          <div className="space-y-3">
            <Link
              to="/"
              className="inline-flex items-center justify-center w-full px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-colors font-lao"
            >
              <HomeIcon className="h-5 w-5 mr-2" />
              ກັບໄປໜ້າຫຼັກ
            </Link>
            
            {showLogin && (
              <Link
                to="/login"
                className="inline-flex items-center justify-center w-full px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors font-lao"
              >
                ໄປໜ້າເຂົ້າສູ່ລະບົບ
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
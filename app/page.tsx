'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleUserClick = () => {
    setLoading(true);
    setTimeout(() => {
      router.push('/user/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm">
        {/* logo */}
        <Image
          src="/logopu.png"
          alt="Logo Perusahaan"
          width={40}
          height={40}
          className="mx-auto mb-3"
        />

        {/* header */}
        <h1 className="text-base font-bold text-center mb-4 text-gray-800 leading-tight">
          Dashboard Monitoring <br /> Barang Milik Negara (BMN)
          <br />
          <span className="text-gray-500 text-xs font-normal">
            Pusat Data & Teknologi Informasi <br /> Kementerian Pekerjaan Umum
          </span>
        </h1>

        {/* button user */}
        <button
          onClick={handleUserClick}
          disabled={loading}
          className={`cursor-pointer w-full text-xs flex items-center font-medium py-2 rounded-lg mb-3 flex justify-center items-center ${loading
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              <span className="text-white text-xs">Loading</span>
            </>
          ) : (
            'Lanjut sebagai Pengguna'
          )}
        </button>

        <div className="flex items-center my-2">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-3 text-gray-500 text-xs">atau</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* button admin */}
        <button
          onClick={() => router.push('/admin-login')}
          className="cursor-pointer w-full flex items-center justify-center font-medium text-white text-xs py-2 rounded-md text-white py-1.5 rounded-lg bg-purple-500 hover:bg-purple-600 mt-2"
        >
          Login sebagai Admin
        </button>
      </div>
    </div>
  );
}

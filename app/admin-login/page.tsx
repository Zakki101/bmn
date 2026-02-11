'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      if (username === 'admin' && password === '1234') {
        router.push('/admin/dashboard');
      } else {
        alert('Username atau password salah!');
        setLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm">
        {/* logo */}
        <Image
          src="/logopu.png"
          alt="Logo Perusahaan"
          width={40}
          height={40}
          className="mx-auto mb-3"
        />

        {/* header */}
        <h1 className="text-[16px] font-bold text-center mb-4 text-gray-800 leading-snug">
          Login Admin <br />
          <span className="text-gray-500 text-[12px] font-normal">
            Dashboard Monitoring BMN
          </span>
        </h1>

        {/* form */}
        <form onSubmit={handleAdminLogin} className="space-y-3">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center font-medium bg-purple-500 text-white text-xs py-2 rounded-md hover:bg-purple-600 cursor-pointer disabled:opacity-70"
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
              'Login'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

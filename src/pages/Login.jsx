import React from 'react';
import { useAuth } from '@/lib/AuthContext';

export default function Login() {
  const { navigateToLogin } = useAuth();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#020817]">
      <div className="flex flex-col items-center gap-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Synapse Flow</h1>
          <p className="text-white/60">Sign in to continue</p>
        </div>
        <button
          onClick={navigateToLogin}
          className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium transition-colors"
        >
          Sign In
        </button>
      </div>
    </div>
  );
}

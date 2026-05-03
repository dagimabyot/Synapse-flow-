import { useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { BrainCircuit } from 'lucide-react';

export default function Login() {
  useEffect(() => {
    // Redirect to the Base44 login flow with dashboard as the target
    base44.auth.redirectToLogin(window.location.origin + '/dashboard');
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#020817]">
      <div className="flex flex-col items-center gap-6">
        {/* Logo */}
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 blur-sm opacity-60" />
          <div className="relative w-full h-full rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center">
            <BrainCircuit className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Loading spinner */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 border-2 border-white/5 rounded-full" />
            <div className="absolute inset-0 w-12 h-12 border-2 border-transparent border-t-cyan-500 rounded-full animate-spin" />
          </div>
          <div className="text-center">
            <p className="text-white font-semibold mb-2">Redirecting to Login</p>
            <p className="text-sm text-white/40">Please wait while we prepare your login...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

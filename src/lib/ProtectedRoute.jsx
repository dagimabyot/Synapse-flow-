import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

export default function ProtectedRoute({ children }) {
  const { isLoadingAuth, isLoadingPublicSettings, isAuthenticated, authError, authChecked, checkAppState } = useAuth();

  // When a protected route mounts, always trigger auth check if not yet done
  useEffect(() => {
    if (!authChecked && !isLoadingAuth && !isLoadingPublicSettings) {
      checkAppState();
    }
  }, []);

  // ── 1. Auth resolving — show spinner, never redirect ──────────
  if (isLoadingAuth || isLoadingPublicSettings || (!authChecked && !isAuthenticated)) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#020817]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 border-2 border-white/5 rounded-full" />
            <div className="absolute inset-0 w-12 h-12 border-2 border-transparent border-t-cyan-500 rounded-full animate-spin" />
          </div>
          <p className="text-[10px] text-white/25 tracking-[0.2em] uppercase">Authenticating</p>
        </div>
      </div>
    );
  }

  // ── 2. User exists in system but not registered for this app ──
  if (authError?.type === 'user_not_registered') {
    return <UserNotRegisteredError />;
  }

  // ── 3. Authenticated — render the protected page ───────────────
  if (isAuthenticated) {
    return children;
  }

  // ── 4. Not authenticated — go to landing, no login redirect ───
  return <Navigate to="/" replace />;
}
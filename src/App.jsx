import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider } from '@/lib/AuthContext';
import { ThemeProvider } from '@/lib/ThemeContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ProtectedRoute from '@/lib/ProtectedRoute';

// Pages
import MainApp from './pages/MainApp';
import Login from './pages/Login';

// Add page imports here

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router>
            <Routes>

              {/*
               * ── PUBLIC ROUTES ──────────────────────────────────────────
               * These routes render immediately with zero auth checks.
               */}
              <Route path="/" element={<Login />} />

              {/*
               * ── PROTECTED ROUTES ───────────────────────────────────────
               * Wrapped in <ProtectedRoute> which handles the auth check.
               * Only these routes ever trigger an auth loading state.
               * Unauthenticated users are sent back to "/" (login page).
               */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <MainApp />
                </ProtectedRoute>
              } />

              {/* Add more protected routes here the same way */}

              {/*
               * ── SPECIAL ERROR ROUTES ───────────────────────────────────
               */}
              <Route path="/not-registered" element={<UserNotRegisteredError />} />
              <Route path="*" element={<PageNotFound />} />

            </Routes>
          </Router>
          <Toaster />
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

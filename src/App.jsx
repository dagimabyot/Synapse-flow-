import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider } from '@/lib/AuthContext';
import { ThemeProvider } from '@/lib/ThemeContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ProtectedRoute from '@/lib/ProtectedRoute';

// Pages
import Landing from './pages/Landing';
import MainApp from './pages/MainApp';
import RequestAccess from './pages/RequestAccess';

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
               * No guards, no session checks, no redirects on load.
               */}
              <Route path="/" element={<Landing />} />
              <Route path="/request-access" element={<RequestAccess />} />

              {/*
               * ── PROTECTED ROUTES ───────────────────────────────────────
               * Wrapped in <ProtectedRoute> which handles the auth check.
               * Only these routes ever trigger an auth loading state.
               * Unauthenticated users are sent back to "/" (not "/login").
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
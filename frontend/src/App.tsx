import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { AdminDashboard } from './components/AdminDashboard';
import { StudentDirectory } from './components/StudentDirectory';
import { StudentProfilePage } from './components/StudentProfilePage';
import { MessagingHub } from './components/MessagingHub';
import { FinanceManager } from './components/FinanceManager';
import { CertificateGenerator } from './components/CertificateGenerator';
import { TeachersManager } from './components/TeachersManager';
import { ClassesNotesManager } from './components/ClassesNotesManager';
import { TimetableManager } from './components/TimetableManager';
import { AuthPage } from './components/AuthPage';
import { authApi } from './api/client';
import { Loader2 } from 'lucide-react';

export function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [activeRole, setActiveRole] = useState('ADMIN');
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(() => {
    const saved = localStorage.getItem('edupro_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Sync data-theme attribute on root html node for CSS tokens
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Check token validity on startup
  useEffect(() => {
    const token = localStorage.getItem('edupro_jwt_token');
    if (token) {
      authApi.getMe()
        .then((user) => {
          setCurrentUser(user);
          localStorage.setItem('edupro_user', JSON.stringify(user));
        })
        .catch(() => {
          localStorage.removeItem('edupro_jwt_token');
          localStorage.removeItem('edupro_user');
          setCurrentUser(null);
        })
        .finally(() => {
          setLoadingAuth(false);
        });
    } else {
      setLoadingAuth(false);
    }
  }, []);

  // 1. Initial auth check loading state
  if (loadingAuth) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main, #0f172a)', color: 'var(--text-muted)' }}>
        <Loader2 size={36} className="animate-spin" style={{ marginBottom: 12, color: '#3b82f6' }} />
        <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Vérification de la session...</div>
      </div>
    );
  }

  // 2. Security Gate: If not authenticated, require Sign In / Sign Up
  if (!currentUser) {
    return <AuthPage onLoginSuccess={(user) => setCurrentUser(user)} />;
  }

  // 3. Authenticated App Layout
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="app-shell">
        <Navigation
          theme={theme}
          setTheme={setTheme}
          activeRole={activeRole}
          setActiveRole={setActiveRole}
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
        />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/students" element={<StudentDirectory />} />
            <Route path="/students/:id" element={<StudentProfilePage />} />
            <Route path="/teachers" element={<TeachersManager />} />
            <Route path="/classes" element={<ClassesNotesManager />} />
            <Route path="/timetable" element={<TimetableManager />} />
            <Route path="/messages" element={<MessagingHub />} />
            <Route path="/finance" element={<FinanceManager />} />
            <Route path="/documents" element={<CertificateGenerator />} />
          </Routes>
        </main>
      </div>

      {/* Footer with Parent Integration Indicator */}
      <footer style={{ borderTop: '1px solid var(--border-color)', padding: '16px 24px', textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)', background: 'var(--bg-surface)' }}>
        <div>EDUPRO System v1.0 • Modern Educational Management Platform</div>
        <div style={{ marginTop: 4, color: 'var(--text-subtle)' }}>
          Part of Parent Application Ecosystem • Multi-Tenant MongoDB Engine • NestJS Modular Monolith API
        </div>
      </footer>
    </div>
  );
}

export default App;

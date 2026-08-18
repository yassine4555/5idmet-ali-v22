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

export function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [activeRole, setActiveRole] = useState('ADMIN');

  // Sync data-theme attribute on root html node for CSS tokens
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="app-shell">
        <Navigation theme={theme} setTheme={setTheme} activeRole={activeRole} setActiveRole={setActiveRole} />

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

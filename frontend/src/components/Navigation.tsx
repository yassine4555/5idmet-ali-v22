import React from 'react';
import { Home, Users, BookOpen, Calendar, MessageCircle, DollarSign, FileText, Moon, Sun } from 'lucide-react';

import { NavLink, useNavigate } from 'react-router-dom';

interface NavigationProps {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  activeRole: string;
  setActiveRole: (role: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ theme, setTheme, activeRole, setActiveRole }) => {
  const navigate = useNavigate();
  const menu = [
    { id: 'dashboard', label: 'Tableau de bord', icon: Home, path: '/' },
    { id: 'students', label: 'Étudiants', icon: Users, path: '/students' },
    { id: 'teachers', label: 'Enseignants', icon: BookOpen, path: '/teachers' },
    { id: 'classes', label: 'Classes & Notes', icon: BookOpen, path: '/classes' },
    { id: 'timetable', label: 'Emploi du temps', icon: Calendar, path: '/timetable' },
    { id: 'messaging', label: 'Messages', icon: MessageCircle, path: '/messages' },
    { id: 'finance', label: 'Finance', icon: DollarSign, path: '/finance' },
    { id: 'documents', label: 'Documents', icon: FileText, path: '/documents' },
  ];

  return (
    <aside className="sidebar card-glass">
      <div className="sidebar-top">
        <div className="brand" onClick={() => navigate('/')}>
          <div className="brand-logo">E</div>
          <div className="brand-text">
            <div className="brand-title">EDUPRO</div>
            <div className="brand-sub">Plateforme éducative</div>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menu.map((m) => {
          const Icon = m.icon;
          return (
            <NavLink key={m.id} to={m.path} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <Icon size={18} />
              <span className="nav-label">{m.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div style={{ marginBottom: 8 }}>
          <select value={activeRole} onChange={(e) => setActiveRole(e.target.value)} className="role-select">
            <option value="ADMIN">Admin</option>
            <option value="TEACHER">Enseignant</option>
            <option value="STUDENT">Étudiant</option>
            <option value="PARENT">Parent</option>
          </select>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>{theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}</button>
        </div>
      </div>
    </aside>
  );
};

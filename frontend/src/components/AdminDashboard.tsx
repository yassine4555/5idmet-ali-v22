import React from 'react';
import { RoadmapStepper } from './RoadmapStepper';
import { Users, BookOpen, DollarSign, Award, CheckSquare, Calendar as CalendarIcon, Clock, ArrowUpRight } from 'lucide-react';

import { useNavigate } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const stats = [
    { title: 'Total Étudiants', value: '1,248', change: '+12%', icon: Users, color: '#4F46E5' },
    { title: 'Classes & Formations', value: '42', change: '+4', icon: BookOpen, color: '#06B6D4' },
    { title: 'Taux de Réussite', value: '94.2%', change: '+3.5%', icon: Award, color: '#10B981' },
    { title: 'Encaissements Mois', value: '118,400 €', change: '83%', icon: DollarSign, color: '#F59E0B' },
  ];

  const tasks = [
    { id: 1, title: 'Validation des bulletins T2 - Terminales S1', assignee: 'Mme. Bernard', deadline: 'Aujourd hui 17:00', done: false },
    { id: 2, title: 'Envoi relances factures en retard (14 relances)', assignee: 'Service Finance', deadline: 'Demain', done: true },
    { id: 3, title: 'Génération certificats de scolarité L1', assignee: 'Secrétariat', deadline: '14 Août', done: false },
  ];

  const schedule = [
    { time: '08:30 - 10:00', class: 'Terminales S1', subject: 'Mathématiques (Mme. Bernard)', room: 'Salle 204' },
    { time: '10:15 - 11:45', class: '3ème B', subject: 'Physique-Chimie (M. Dubois)', room: 'Labo Sciences' },
    { time: '14:00 - 16:00', class: 'L1 Informatique', subject: 'Algorithmique (Dr. Leroy)', room: 'Amphi A' },
  ];

  return (
    <div className="animate-fade-in" style={{ padding: '24px 0' }}>
      {/* Workflow Stepper */}
      <RoadmapStepper />

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="card-glass" style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>{stat.title}</span>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${stat.color}15`, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={20} />
                </div>
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: 4 }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10B981', display: 'flex', alignItems: 'center', gap: 4 }}>
                <ArrowUpRight size={14} /> {stat.change} ce trimestre
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Tasks & Schedule Preview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24 }}>
        {/* Module Quick Shortcuts & Task Management */}
        <div className="card-glass" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Tâches Administratives & Priorités</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Gestion centralisée des activités scolaires</p>
            </div>
            <button className="btn btn-outline" style={{ fontSize: '0.8rem' }} onClick={() => navigate('/students')}>
              Gérer la communauté ➔
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {tasks.map((task) => (
              <div
                key={task.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 14,
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-color)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <CheckSquare size={18} color={task.done ? 'var(--success-500)' : 'var(--text-subtle)'} />
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, textDecoration: task.done ? 'line-through' : 'none', opacity: task.done ? 0.7 : 1 }}>
                      {task.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Assigné à: <strong style={{ color: 'var(--text-main)' }}>{task.assignee}</strong>
                    </div>
                  </div>
                </div>
                <span className={`badge ${task.done ? 'badge-success' : 'badge-warning'}`}>
                  {task.deadline}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* School Calendar / Schedule Sidebar */}
        <div className="card-glass" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
            <CalendarIcon size={20} color="var(--primary-500)" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Emploi du temps du jour</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {schedule.map((item, i) => (
              <div key={i} style={{ padding: 12, borderRadius: 'var(--radius-md)', background: 'var(--bg-surface-elevated)', borderLeft: '4px solid var(--primary-500)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-500)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Clock size={12} /> {item.time}
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', marginTop: 2 }}>{item.class}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{item.subject}</div>
                <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-subtle)', marginTop: 4 }}>📍 {item.room}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

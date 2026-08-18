import React from 'react';
import { Calendar, FolderKanban, Users, TrendingUp, Award, CheckCircle2 } from 'lucide-react';

export const RoadmapStepper: React.FC = () => {
  const steps = [
    { label: 'Planifier', desc: 'Organisez votre année', icon: Calendar, active: true, done: true },
    { label: 'Organiser', desc: 'Structurez ressources', icon: FolderKanban, active: true, done: true },
    { label: 'Collaborer', desc: 'Échangez facilement', icon: Users, active: true, done: false },
    { label: 'Suivre', desc: 'Avancement & notes', icon: TrendingUp, active: false, done: false },
    { label: 'Réussir', desc: 'Objectifs & talents', icon: Award, active: false, done: false },
  ];

  return (
    <div className="card-glass" style={{ padding: '16px 24px', marginBottom: 24 }}>
      <div style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12, letterSpacing: '0.5px' }}>
        Roadmap Pédagogique (EDUPRO Workflow)
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                background: step.done ? 'var(--primary-light)' : 'var(--bg-surface-elevated)',
                border: step.done ? '1px solid var(--primary-500)' : '1px solid var(--border-color)',
                transition: 'all 0.2s ease',
              }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 8,
                  background: step.done ? 'var(--primary-500)' : 'var(--bg-surface)',
                  color: step.done ? '#FFF' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: step.done ? '0 2px 8px rgba(79,70,229,0.3)' : 'none',
                }}
              >
                {step.done ? <CheckCircle2 size={18} /> : <Icon size={18} />}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: step.done ? 'var(--primary-500)' : 'var(--text-main)' }}>
                  {step.label}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {step.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

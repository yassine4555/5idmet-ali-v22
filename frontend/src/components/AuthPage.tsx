import React, { useState } from 'react';
import { ShieldCheck, LogIn, UserPlus, AlertCircle, Loader2, BookOpen } from 'lucide-react';
import { authApi } from '../api/client';

interface AuthPageProps {
  onLoginSuccess: (user: any) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'INSTITUTION_ADMIN',
    phone: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'login') {
        const res = await authApi.login({
          email: form.email,
          password: form.password,
        });
        localStorage.setItem('edupro_jwt_token', res.accessToken);
        localStorage.setItem('edupro_user', JSON.stringify(res.user));
        onLoginSuccess(res.user);
      } else {
        const res = await authApi.signup({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          password: form.password,
          role: form.role,
          phone: form.phone || undefined,
        });
        localStorage.setItem('edupro_jwt_token', res.accessToken);
        localStorage.setItem('edupro_user', JSON.stringify(res.user));
        onLoginSuccess(res.user);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Erreur d\'authentification. Vérifiez vos identifiants.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-main, #0f172a)',
      color: 'var(--text-main, #f8fafc)',
      padding: 20,
    }}>
      <div className="card-glass animate-fade-in" style={{
        width: '100%',
        maxWidth: 440,
        padding: 32,
        borderRadius: 16,
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
        border: '1px solid var(--border-color, rgba(255, 255, 255, 0.1))',
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 12,
            boxShadow: '0 8px 16px rgba(59, 130, 246, 0.3)',
          }}>
            <BookOpen size={28} color="#ffffff" />
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-0.5px' }}>EDUPRO</h1>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted, #94a3b8)', marginTop: 4 }}>
            Plateforme de gestion éducative sécurisée
          </p>
        </div>

        {/* Tab Toggle */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          background: 'var(--bg-surface-elevated, rgba(255, 255, 255, 0.05))',
          padding: 4,
          borderRadius: 10,
          marginBottom: 20,
        }}>
          <button
            type="button"
            onClick={() => { setMode('login'); setError(null); }}
            style={{
              padding: '8px 12px',
              borderRadius: 8,
              border: 'none',
              fontWeight: 700,
              fontSize: '0.86rem',
              cursor: 'pointer',
              background: mode === 'login' ? 'var(--primary-600, #3b82f6)' : 'transparent',
              color: mode === 'login' ? '#ffffff' : 'var(--text-muted, #94a3b8)',
              transition: 'all 0.2s ease',
            }}
          >
            Se connecter
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setError(null); }}
            style={{
              padding: '8px 12px',
              borderRadius: 8,
              border: 'none',
              fontWeight: 700,
              fontSize: '0.86rem',
              cursor: 'pointer',
              background: mode === 'signup' ? 'var(--primary-600, #3b82f6)' : 'transparent',
              color: mode === 'signup' ? '#ffffff' : 'var(--text-muted, #94a3b8)',
              transition: 'all 0.2s ease',
            }}
          >
            S'inscrire
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{
            padding: '12px 14px',
            marginBottom: 16,
            border: '1px solid var(--danger-500, #ef4444)',
            background: 'rgba(239, 68, 68, 0.1)',
            borderRadius: 8,
            color: '#fca5a5',
            fontSize: '0.84rem',
            display: 'flex',
            gap: 8,
            alignItems: 'center',
          }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 14 }}>
          {mode === 'signup' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>Prénom</label>
                  <input
                    required
                    placeholder="Prénom"
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 8,
                      border: '1px solid var(--border-color, rgba(255, 255, 255, 0.15))',
                      background: 'var(--bg-surface-elevated, rgba(255, 255, 255, 0.05))',
                      color: 'var(--text-main, #ffffff)',
                      fontSize: '0.88rem',
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>Nom</label>
                  <input
                    required
                    placeholder="Nom"
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 8,
                      border: '1px solid var(--border-color, rgba(255, 255, 255, 0.15))',
                      background: 'var(--bg-surface-elevated, rgba(255, 255, 255, 0.05))',
                      color: 'var(--text-main, #ffffff)',
                      fontSize: '0.88rem',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>Rôle</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: '1px solid var(--border-color, rgba(255, 255, 255, 0.15))',
                    background: 'var(--bg-surface-elevated, rgba(255, 255, 255, 0.05))',
                    color: 'var(--text-main, #ffffff)',
                    fontSize: '0.88rem',
                  }}
                >
                  <option value="INSTITUTION_ADMIN">Administrateur</option>
                  <option value="TEACHER">Enseignant</option>
                  <option value="STUDENT">Étudiant</option>
                  <option value="PARENT">Parent</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>Adresse Email</label>
            <input
              required
              type="email"
              placeholder="votre.email@exemple.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 8,
                border: '1px solid var(--border-color, rgba(255, 255, 255, 0.15))',
                background: 'var(--bg-surface-elevated, rgba(255, 255, 255, 0.05))',
                color: 'var(--text-main, #ffffff)',
                fontSize: '0.88rem',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>Mot de passe</label>
            <input
              required
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 8,
                border: '1px solid var(--border-color, rgba(255, 255, 255, 0.15))',
                background: 'var(--bg-surface-elevated, rgba(255, 255, 255, 0.05))',
                color: 'var(--text-main, #ffffff)',
                fontSize: '0.88rem',
              }}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{
              marginTop: 6,
              padding: '12px 16px',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.92rem',
              borderRadius: 8,
            }}
          >
            {loading ? <Loader2 size={18} /> : (mode === 'login' ? <LogIn size={18} /> : <UserPlus size={18} />)}
            {mode === 'login' ? 'Connexion' : 'Créer mon compte'}
          </button>
        </form>

        <div style={{ marginTop: 20, textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted, #94a3b8)' }}>
          <ShieldCheck size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4, color: '#22c55e' }} />
          Accès sécurisé par authentification JWT & Bcrypt
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { LogIn, UserPlus, LogOut, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { authApi } from '../api/client';

interface AuthModalProps {
  currentUser: any;
  setCurrentUser: (user: any) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ currentUser, setCurrentUser }) => {
  const [isOpen, setIsOpen] = useState(false);
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

  const handleOpen = (m: 'login' | 'signup') => {
    setMode(m);
    setError(null);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setError(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('edupro_jwt_token');
    localStorage.removeItem('edupro_user');
    setCurrentUser(null);
  };

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
        setCurrentUser(res.user);
        handleClose();
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
        setCurrentUser(res.user);
        handleClose();
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Erreur d\'authentification');
    } finally {
      setLoading(false);
    }
  };

  if (currentUser) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.84rem' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--primary-600, #3b82f6)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
            {currentUser.firstName?.[0] || 'U'}
          </div>
          <div>
            <div style={{ fontWeight: 700 }}>{currentUser.firstName} {currentUser.lastName}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{currentUser.role}</div>
          </div>
        </div>
        <button className="btn btn-secondary" style={{ padding: '6px 10px', fontSize: '0.78rem' }} onClick={handleLogout}>
          <LogOut size={14} /> Déconnexion
        </button>
      </div>
    );
  }

  return (
    <>
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.82rem' }} onClick={() => handleOpen('login')}>
          <LogIn size={15} /> Connexion
        </button>
        <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.82rem' }} onClick={() => handleOpen('signup')}>
          <UserPlus size={15} /> S'inscrire
        </button>
      </div>

      {isOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          backdropFilter: 'blur(4px)',
        }}>
          <div className="card-glass" style={{ width: '100%', maxWidth: 440, padding: 24, borderRadius: 'var(--radius-lg, 12px)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ShieldCheck size={22} style={{ color: 'var(--primary-500, #3b82f6)' }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                  {mode === 'login' ? 'Connexion à EDUPRO' : 'Créer un compte'}
                </h3>
              </div>
              <button onClick={handleClose} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--text-muted)' }}>✕</button>
            </div>

            {error && (
              <div style={{ padding: '10px 12px', marginBottom: 14, border: '1px solid var(--danger-500)', background: 'var(--danger-light, #fef2f2)', borderRadius: 6, color: 'var(--danger-500)', fontSize: '0.84rem', display: 'flex', gap: 8, alignItems: 'center' }}>
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
              {mode === 'signup' && (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>Prénom</label>
                      <input required placeholder="Prénom" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid var(--border-color)', background: 'var(--bg-surface-elevated)', color: 'var(--text-main)', fontSize: '0.86rem' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>Nom</label>
                      <input required placeholder="Nom" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid var(--border-color)', background: 'var(--bg-surface-elevated)', color: 'var(--text-main)', fontSize: '0.86rem' }} />
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>Rôle</label>
                    <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid var(--border-color)', background: 'var(--bg-surface-elevated)', color: 'var(--text-main)', fontSize: '0.86rem' }}>
                      <option value="INSTITUTION_ADMIN">Administrateur</option>
                      <option value="TEACHER">Enseignant</option>
                      <option value="STUDENT">Étudiant</option>
                      <option value="PARENT">Parent</option>
                    </select>
                  </div>
                </>
              )}

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>Email</label>
                <input required type="email" placeholder="nom@exemple.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid var(--border-color)', background: 'var(--bg-surface-elevated)', color: 'var(--text-main)', fontSize: '0.86rem' }} />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>Mot de passe</label>
                <input required type="password" placeholder="••••••••" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid var(--border-color)', background: 'var(--bg-surface-elevated)', color: 'var(--text-main)', fontSize: '0.86rem' }} />
              </div>

              <button className="btn btn-primary" style={{ marginTop: 8, padding: '10px 14px', justifyContent: 'center' }} disabled={loading}>
                {loading ? <Loader2 size={16} /> : (mode === 'login' ? <LogIn size={16} /> : <UserPlus size={16} />)}
                {mode === 'login' ? 'Se connecter' : 'S\'inscrire'}
              </button>
            </form>

            <div style={{ marginTop: 14, textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {mode === 'login' ? (
                <>Pas encore de compte ? <button style={{ background: 'none', border: 'none', color: 'var(--primary-600, #3b82f6)', cursor: 'pointer', fontWeight: 700 }} onClick={() => handleOpen('signup')}>Créer un compte</button></>
              ) : (
                <>Déjà un compte ? <button style={{ background: 'none', border: 'none', color: 'var(--primary-600, #3b82f6)', cursor: 'pointer', fontWeight: 700 }} onClick={() => handleOpen('login')}>Se connecter</button></>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

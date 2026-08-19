import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertCircle, Loader2, RefreshCw, Trash2, UserPlus, Save } from 'lucide-react';
import { teachersApi } from '../api/client';

const inputStyle: React.CSSProperties = {
  padding: '10px 12px',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--border-color)',
  background: 'var(--bg-surface-elevated)',
  color: 'var(--text-main)',
  fontSize: '0.86rem',
};

const getId = (v: any) => String(v?.id || v?._id || '');

export const TeachersManager: React.FC = () => {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    status: 'ACTIVE',
    subjects: '',
  });

  const fetchTeachers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await teachersApi.list(search || undefined);
      setTeachers(data);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Erreur lors du chargement des enseignants');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const t = setTimeout(fetchTeachers, 250);
    return () => clearTimeout(t);
  }, [fetchTeachers]);

  const resetForm = () => {
    setForm({ firstName: '', lastName: '', email: '', phone: '', status: 'ACTIVE', subjects: '' });
    setEditingId(null);
    setCreating(false);
  };

  const beginCreate = () => {
    resetForm();
    setCreating(true);
  };

  const beginEdit = (teacher: any) => {
    setCreating(false);
    const id = getId(teacher);
    setEditingId(id);
    setForm({
      firstName: teacher.firstName || '',
      lastName: teacher.lastName || '',
      email: teacher.email || '',
      phone: teacher.phone || '',
      status: teacher.status || 'ACTIVE',
      subjects: (teacher.profile?.professionalInfo?.subjects || []).join(', '),
    });
  };

  const rows = useMemo(
    () =>
      teachers.map((teacher) => ({
        id: getId(teacher),
        fullName: `${teacher.firstName || ''} ${teacher.lastName || ''}`.trim(),
        email: teacher.email || '—',
        phone: teacher.phone || '—',
        subjects: (teacher.profile?.professionalInfo?.subjects || []).join(', ') || '—',
        assignedClasses: (teacher.assignedClasses || []).map((c: any) => c.name).join(', ') || '—',
      })),
    [teachers],
  );

  const saveTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email) return;
    const subjects = form.subjects.split(',').map((v) => v.trim()).filter(Boolean);
    try {
      setSaving(true);
      setTempPassword(null);
      if (creating) {
        const result = await teachersApi.create({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone || undefined,
          professionalInfo: { subjects },
        });
        if (result.tempPassword) setTempPassword(result.tempPassword);
      } else if (editingId) {
        await teachersApi.update(editingId, {
          firstName: form.firstName,
          lastName: form.lastName,
          phone: form.phone,
          status: form.status,
          professionalInfo: { subjects },
        });
      }
      resetForm();
      await fetchTeachers();
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const removeTeacher = async (id: string, fullName: string) => {
    if (!window.confirm(`Supprimer ${fullName} ?`)) return;
    try {
      setDeleteLoadingId(id);
      await teachersApi.delete(id);
      setTeachers((prev) => prev.filter((t) => getId(t) !== id));
      if (editingId === id) resetForm();
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Erreur lors de la suppression');
    } finally {
      setDeleteLoadingId(null);
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '24px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Enseignants</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>CRUD complet connecté à /api/v1/teachers</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary" onClick={fetchTeachers}>
            <RefreshCw size={16} />
          </button>
          <button className="btn btn-primary" onClick={beginCreate}>
            <UserPlus size={16} /> Ajouter
          </button>
        </div>
      </div>

      {error && (
        <div style={{ padding: '12px 14px', marginBottom: 14, border: '1px solid var(--danger-500)', background: 'var(--danger-light)', borderRadius: 'var(--radius-md)', color: 'var(--danger-500)', display: 'flex', gap: 8, alignItems: 'center' }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {tempPassword && (
        <div style={{ padding: '12px 14px', marginBottom: 14, border: '1px solid var(--success-500, #22c55e)', background: 'var(--success-light, #f0fdf4)', borderRadius: 'var(--radius-md)', color: 'var(--success-700, #15803d)' }}>
          <strong>✅ Enseignant créé.</strong> Mot de passe temporaire : <code style={{ background: '#dcfce7', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>{tempPassword}</code>
          <span style={{ marginLeft: 8, fontSize: '0.8rem' }}>Communiquez-le à l'enseignant pour sa première connexion.</span>
          <button type="button" style={{ marginLeft: 12, fontSize: '0.78rem', cursor: 'pointer', background: 'none', border: 'none', textDecoration: 'underline', color: 'inherit' }} onClick={() => setTempPassword(null)}>Fermer</button>
        </div>
      )}

      <div className="card-glass" style={{ padding: 16, marginBottom: 14, display: 'grid', gridTemplateColumns: '1fr auto', gap: 10 }}>
        <input placeholder="Rechercher un enseignant..." value={search} onChange={(e) => setSearch(e.target.value)} style={inputStyle} />
        <span className="badge badge-primary">{rows.length} enseignant(s)</span>
      </div>

      {(creating || editingId) && (
        <form onSubmit={saveTeacher} className="card-glass animate-fade-in" style={{ padding: 16, marginBottom: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10, marginBottom: 10 }}>
            <input required placeholder="Prénom" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} style={inputStyle} />
            <input required placeholder="Nom" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} style={inputStyle} />
            <input required type="email" disabled={!creating} placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={inputStyle} />
            <input placeholder="Téléphone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} style={inputStyle} />
            <input placeholder="Matières (CSV)" value={form.subjects} onChange={(e) => setForm({ ...form, subjects: e.target.value })} style={inputStyle} />
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} style={inputStyle}>
              <option value="ACTIVE">ACTIVE</option>
              <option value="SUSPENDED">SUSPENDED</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-primary" disabled={saving}>
              {saving ? <Loader2 size={16} /> : <Save size={16} />} {creating ? 'Créer' : 'Mettre à jour'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={resetForm}>Annuler</button>
          </div>
        </form>
      )}

      <div className="card-glass" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)' }}>
            <Loader2 size={30} style={{ margin: '0 auto 8px', display: 'block' }} />
            Chargement...
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-surface-elevated)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px 14px', textAlign: 'left' }}>Nom</th>
                <th style={{ padding: '12px 14px', textAlign: 'left' }}>Email</th>
                <th style={{ padding: '12px 14px', textAlign: 'left' }}>Téléphone</th>
                <th style={{ padding: '12px 14px', textAlign: 'left' }}>Matières</th>
                <th style={{ padding: '12px 14px', textAlign: 'left' }}>Classes assignées</th>
                <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} style={{ borderTop: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 700 }}>{row.fullName}</td>
                  <td style={{ padding: '12px 14px' }}>{row.email}</td>
                  <td style={{ padding: '12px 14px' }}>{row.phone}</td>
                  <td style={{ padding: '12px 14px' }}>{row.subjects}</td>
                  <td style={{ padding: '12px 14px', color: 'var(--text-muted)' }}>{row.assignedClasses}</td>
                  <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: 8 }}>
                      <button className="btn btn-secondary" style={{ padding: '6px 10px' }} onClick={() => beginEdit(teachers.find((t) => getId(t) === row.id))}>Modifier</button>
                      <button className="btn btn-secondary" style={{ padding: '6px 10px', color: 'var(--danger-500)', borderColor: 'var(--danger-500)' }} onClick={() => removeTeacher(row.id, row.fullName)} disabled={deleteLoadingId === row.id}>
                        {deleteLoadingId === row.id ? <Loader2 size={14} /> : <Trash2 size={14} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

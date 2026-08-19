import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertCircle, CalendarPlus, Loader2, RefreshCw, Save, Trash2 } from 'lucide-react';
import { classesApi, teachersApi, timetableApi } from '../api/client';

const inputStyle: React.CSSProperties = {
  padding: '10px 12px',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--border-color)',
  background: 'var(--bg-surface-elevated)',
  color: 'var(--text-main)',
  fontSize: '0.86rem',
};

const getId = (v: any) => String(v?.id || v?._id || v || '');

const toDatetimeLocal = (value: string | undefined) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
};

export const TimetableManager: React.FC = () => {
  const [entries, setEntries] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    classId: '',
    teacherId: '',
    subject: '',
    startTime: '',
    endTime: '',
    location: '',
    notes: '',
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [entriesData, classesData, teachersData] = await Promise.all([
        timetableApi.list(),
        classesApi.list(),
        teachersApi.list(),
      ]);
      setEntries(entriesData);
      setClasses(classesData);
      setTeachers(teachersData);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Erreur lors du chargement de l’emploi du temps');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const classMap = useMemo(() => new Map(classes.map((c) => [getId(c), c.name || getId(c)])), [classes]);
  const teacherMap = useMemo(
    () => new Map(teachers.map((t) => [getId(t), `${t.firstName || ''} ${t.lastName || ''}`.trim()])),
    [teachers],
  );

  const resetForm = () => {
    setEditingId(null);
    setForm({
      classId: '',
      teacherId: '',
      subject: '',
      startTime: '',
      endTime: '',
      location: '',
      notes: '',
    });
  };

  const startEdit = (entry: any) => {
    setEditingId(getId(entry));
    setForm({
      classId: getId(entry.classId),
      teacherId: getId(entry.teacherId),
      subject: entry.subject || '',
      startTime: toDatetimeLocal(entry.startTime),
      endTime: toDatetimeLocal(entry.endTime),
      location: entry.location || '',
      notes: entry.notes || '',
    });
  };

  const saveEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.classId || !form.teacherId || !form.subject || !form.startTime || !form.endTime) return;
    const payload = {
      classId: form.classId,
      teacherId: form.teacherId,
      subject: form.subject,
      startTime: new Date(form.startTime).toISOString(),
      endTime: new Date(form.endTime).toISOString(),
      location: form.location || undefined,
      notes: form.notes || undefined,
    };
    try {
      setSaving(true);
      if (editingId) {
        await timetableApi.update(editingId, payload);
      } else {
        await timetableApi.create(payload);
      }
      resetForm();
      await fetchData();
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const removeEntry = async (id: string) => {
    if (!window.confirm('Supprimer ce créneau ?')) return;
    try {
      await timetableApi.delete(id);
      setEntries((prev) => prev.filter((entry) => getId(entry) !== id));
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Erreur lors de la suppression');
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '24px 0', display: 'grid', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Emploi du temps</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>CRUD connecté à /api/v1/timetable</p>
        </div>
        <button className="btn btn-secondary" onClick={fetchData}>
          <RefreshCw size={16} /> Actualiser
        </button>
      </div>

      {error && (
        <div style={{ padding: '12px 14px', border: '1px solid var(--danger-500)', background: 'var(--danger-light)', borderRadius: 'var(--radius-md)', color: 'var(--danger-500)', display: 'flex', gap: 8, alignItems: 'center' }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <form onSubmit={saveEntry} className="card-glass" style={{ padding: 16 }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: 10 }}>{editingId ? 'Modifier un créneau' : 'Nouveau créneau'}</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 }}>
          <select required value={form.classId} onChange={(e) => setForm({ ...form, classId: e.target.value })} style={inputStyle}>
            <option value="">Classe</option>
            {classes.map((classGroup) => {
              const classId = getId(classGroup);
              return <option key={classId} value={classId}>{classGroup.name}</option>;
            })}
          </select>
          <select required value={form.teacherId} onChange={(e) => setForm({ ...form, teacherId: e.target.value })} style={inputStyle}>
            <option value="">Enseignant</option>
            {teachers.map((teacher) => {
              const teacherId = getId(teacher);
              return <option key={teacherId} value={teacherId}>{teacher.firstName} {teacher.lastName}</option>;
            })}
          </select>
          <input required placeholder="Matière" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} style={inputStyle} />
          <input required type="datetime-local" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} style={inputStyle} />
          <input required type="datetime-local" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} style={inputStyle} />
          <input placeholder="Salle / lieu" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} style={inputStyle} />
          <input placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} style={{ ...inputStyle, gridColumn: '1 / span 3' }} />
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
          <button className="btn btn-primary" disabled={saving}>
            {saving ? <Loader2 size={16} /> : editingId ? <Save size={16} /> : <CalendarPlus size={16} />}
            {editingId ? ' Mettre à jour' : ' Ajouter'}
          </button>
          {editingId && (
            <button type="button" className="btn btn-secondary" onClick={resetForm}>Annuler</button>
          )}
        </div>
      </form>

      <div className="card-glass" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 44, textAlign: 'center', color: 'var(--text-muted)' }}>
            <Loader2 size={30} style={{ margin: '0 auto 8px', display: 'block' }} />
            Chargement...
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-surface-elevated)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '10px 12px', textAlign: 'left' }}>Classe</th>
                <th style={{ padding: '10px 12px', textAlign: 'left' }}>Matière</th>
                <th style={{ padding: '10px 12px', textAlign: 'left' }}>Enseignant</th>
                <th style={{ padding: '10px 12px', textAlign: 'left' }}>Début</th>
                <th style={{ padding: '10px 12px', textAlign: 'left' }}>Fin</th>
                <th style={{ padding: '10px 12px', textAlign: 'left' }}>Lieu</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => {
                const id = getId(entry);
                const className = entry.classId?.name || classMap.get(getId(entry.classId)) || getId(entry.classId);
                const teacherName = entry.teacherId?.firstName
                  ? `${entry.teacherId.firstName} ${entry.teacherId.lastName || ''}`.trim()
                  : teacherMap.get(getId(entry.teacherId)) || getId(entry.teacherId);
                return (
                  <tr key={id} style={{ borderTop: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 700 }}>{className}</td>
                    <td style={{ padding: '10px 12px' }}>{entry.subject}</td>
                    <td style={{ padding: '10px 12px' }}>{teacherName}</td>
                    <td style={{ padding: '10px 12px' }}>{entry.startTime ? new Date(entry.startTime).toLocaleString('fr-FR') : '—'}</td>
                    <td style={{ padding: '10px 12px' }}>{entry.endTime ? new Date(entry.endTime).toLocaleString('fr-FR') : '—'}</td>
                    <td style={{ padding: '10px 12px' }}>{entry.location || '—'}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 8 }}>
                        <button className="btn btn-secondary" style={{ padding: '6px 10px' }} onClick={() => startEdit(entry)}>Modifier</button>
                        <button className="btn btn-secondary" style={{ padding: '6px 10px', color: 'var(--danger-500)', borderColor: 'var(--danger-500)' }} onClick={() => removeEntry(id)}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

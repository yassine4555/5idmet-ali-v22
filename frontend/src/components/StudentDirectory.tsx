import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Eye, UserPlus, Trash2, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { studentsApi } from '../api/client';

export const StudentDirectory: React.FC = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedLevel, setSelectedLevel] = useState('ALL');
  const [showAddForm, setShowAddForm] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [newStudent, setNewStudent] = useState({
    firstName: '', lastName: '', email: '', phone: '', currentGradeLevel: 'Terminales S1',
  });

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await studentsApi.list({
        search: searchTerm || undefined,
        status: selectedStatus !== 'ALL' ? selectedStatus : undefined,
        level: selectedLevel !== 'ALL' ? selectedLevel : undefined,
      });
      setStudents(data);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Erreur lors du chargement des étudiants');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedStatus, selectedLevel]);

  useEffect(() => {
    const timer = setTimeout(fetchStudents, 300);
    return () => clearTimeout(timer);
  }, [fetchStudents]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.firstName || !newStudent.lastName || !newStudent.email) return;
    try {
      setAddLoading(true);
      await studentsApi.create({
        firstName: newStudent.firstName,
        lastName: newStudent.lastName,
        email: newStudent.email,
        phone: newStudent.phone,
        academicInfo: { currentGradeLevel: newStudent.currentGradeLevel },
      });
      setShowAddForm(false);
      setNewStudent({ firstName: '', lastName: '', email: '', phone: '', currentGradeLevel: 'Terminales S1' });
      await fetchStudents();
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Erreur lors de l\'inscription');
    } finally {
      setAddLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Supprimer l'élève ${name} ? Cette action est irréversible.`)) return;
    try {
      setDeleteLoading(id);
      await studentsApi.delete(id);
      setStudents((prev) => prev.filter((s) => s.id !== id));
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Erreur lors de la suppression');
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '24px 0' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Annuaire & Gestion des Étudiants (2a)</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {loading ? 'Chargement...' : `${students.length} étudiant(s) trouvé(s)`}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary" onClick={fetchStudents} disabled={loading} style={{ padding: '8px 12px' }}>
            <RefreshCw size={16} className={loading ? 'spin' : ''} />
          </button>
          <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
            <UserPlus size={18} /> Inscrire un Élève
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div style={{ padding: '12px 16px', background: 'var(--danger-light)', border: '1px solid var(--danger-500)', borderRadius: 'var(--radius-md)', color: 'var(--danger-500)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
          <AlertCircle size={16} /> {error}
          <button onClick={() => setError(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger-500)', fontWeight: 700 }}>✕</button>
        </div>
      )}

      {/* Add Student Form */}
      {showAddForm && (
        <form onSubmit={handleCreate} className="card-glass animate-fade-in" style={{ padding: 20, marginBottom: 20 }}>
          <h3 style={{ fontWeight: 800, marginBottom: 16, fontSize: '1rem' }}>➕ Inscrire un Nouvel Élève</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginBottom: 12 }}>
            {[
              { key: 'firstName', placeholder: 'Prénom *', required: true },
              { key: 'lastName', placeholder: 'Nom de famille *', required: true },
              { key: 'email', placeholder: 'Email *', required: true, type: 'email' },
              { key: 'phone', placeholder: 'Téléphone', required: false },
            ].map((f) => (
              <input
                key={f.key}
                type={f.type || 'text'}
                placeholder={f.placeholder}
                required={f.required}
                value={(newStudent as any)[f.key]}
                onChange={(e) => setNewStudent({ ...newStudent, [f.key]: e.target.value })}
                style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-surface-elevated)', color: 'var(--text-main)', fontSize: '0.88rem', outline: 'none' }}
              />
            ))}
            <select
              value={newStudent.currentGradeLevel}
              onChange={(e) => setNewStudent({ ...newStudent, currentGradeLevel: e.target.value })}
              style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-surface-elevated)', color: 'var(--text-main)', fontSize: '0.88rem' }}
            >
              <option>Terminales S1</option>
              <option>1ère ES</option>
              <option>3ème B</option>
              <option>L1 Informatique</option>
              <option>BTS 1ère Année</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="submit" className="btn btn-primary" disabled={addLoading}>
              {addLoading ? <Loader2 size={16} /> : null} Confirmer l'Inscription
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => setShowAddForm(false)}>Annuler</button>
          </div>
        </form>
      )}

      {/* Search & Filter Bar */}
      <div className="card-glass" style={{ padding: 16, marginBottom: 24, display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 260, position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: 14, top: 12, color: 'var(--text-subtle)' }} />
          <input
            type="text"
            placeholder="Rechercher par nom ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '10px 14px 10px 42px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-surface-elevated)', color: 'var(--text-main)', fontSize: '0.88rem', outline: 'none' }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Filter size={16} color="var(--text-muted)" />
          <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-surface-elevated)', color: 'var(--text-main)', fontSize: '0.85rem' }}>
            <option value="ALL">Tous les statuts</option>
            <option value="ACTIVE">Actif</option>
            <option value="SUSPENDED">Suspendu</option>
          </select>
          <select value={selectedLevel} onChange={(e) => setSelectedLevel(e.target.value)} style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-surface-elevated)', color: 'var(--text-main)', fontSize: '0.85rem' }}>
            <option value="ALL">Toutes les classes</option>
            <option value="Terminales">Terminales</option>
            <option value="1ère">1ère</option>
            <option value="3ème">3ème</option>
            <option value="L1">Université L1</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card-glass" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)' }}>
            <Loader2 size={32} style={{ margin: '0 auto 12px', display: 'block' }} />
            Chargement des données depuis MongoDB...
          </div>
        ) : students.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)' }}>
            <UserPlus size={40} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.3 }} />
            <div style={{ fontWeight: 700 }}>Aucun étudiant trouvé</div>
            <div style={{ fontSize: '0.85rem' }}>Inscrivez votre premier élève en cliquant sur "Inscrire un Élève"</div>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-surface-elevated)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <th style={{ padding: '14px 20px' }}>Élève</th>
                <th style={{ padding: '14px 20px' }}>Matricule</th>
                <th style={{ padding: '14px 20px' }}>Classe</th>
                <th style={{ padding: '14px 20px' }}>Moyenne</th>
                <th style={{ padding: '14px 20px' }}>Statut</th>
                <th style={{ padding: '14px 20px' }}>Finance</th>
                <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.15s ease' }}>
                  <td style={{ padding: '14px 20px', fontWeight: 700 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #4F46E5, #06B6D4)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem' }}>
                        {(student.firstName?.[0] || '?').toUpperCase()}{(student.lastName?.[0] || '').toUpperCase()}
                      </div>
                      <div>
                        <div>{student.firstName} {student.lastName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>{student.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 20px', fontFamily: 'monospace', fontWeight: 600, color: 'var(--primary-500)' }}>{student.registrationId}</td>
                  <td style={{ padding: '14px 20px', fontWeight: 600 }}>{student.currentGradeLevel}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ fontWeight: 800, color: student.gpa >= 14 ? 'var(--success-500)' : 'var(--warning-500)' }}>
                      {student.gpa > 0 ? `${student.gpa} / 20` : '—'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span className={`badge ${student.status === 'ACTIVE' ? 'badge-success' : 'badge-danger'}`}>
                      {student.status === 'ACTIVE' ? 'ACTIF' : 'SUSPENDU'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span className={`badge ${student.paymentStatus === 'PAID' ? 'badge-success' : 'badge-danger'}`}>
                      {student.paymentStatus}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                      <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.78rem' }} onClick={() => navigate(`/students/${student.id}`)}>
                        <Eye size={14} /> Profil
                      </button>
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '6px 10px', fontSize: '0.78rem', color: 'var(--danger-500)', borderColor: 'var(--danger-500)' }}
                        onClick={() => handleDelete(student.id, `${student.firstName} ${student.lastName}`)}
                        disabled={deleteLoading === student.id}
                      >
                        {deleteLoading === student.id ? <Loader2 size={14} /> : <Trash2 size={14} />}
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

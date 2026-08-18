import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertCircle, Loader2, Plus, RefreshCw, Save, Trash2 } from 'lucide-react';
import { classesApi, gradesApi, studentsApi, teachersApi } from '../api/client';

const inputStyle: React.CSSProperties = {
  padding: '10px 12px',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--border-color)',
  background: 'var(--bg-surface-elevated)',
  color: 'var(--text-main)',
  fontSize: '0.86rem',
};

const getId = (v: any) => String(v?.id || v?._id || '');

export const ClassesNotesManager: React.FC = () => {
  const [classes, setClasses] = useState<any[]>([]);
  const [grades, setGrades] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [classSearch, setClassSearch] = useState('');
  const [editingGradeId, setEditingGradeId] = useState<string | null>(null);
  const [editingScore, setEditingScore] = useState('');
  const [newClass, setNewClass] = useState({ name: '', level: '', academicYear: '2026-2027', mainTeacherId: '' });
  const [newGrade, setNewGrade] = useState({
    studentId: '',
    classId: '',
    subject: '',
    type: 'Exam',
    score: '',
    maxScore: '20',
    teacherId: '',
    comment: '',
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [classesData, gradesData, studentsData, teachersData] = await Promise.all([
        classesApi.list(classSearch || undefined),
        gradesApi.list(),
        studentsApi.list(),
        teachersApi.list(),
      ]);
      setClasses(classesData);
      setGrades(gradesData);
      setStudents(studentsData);
      setTeachers(teachersData);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Erreur de chargement des classes et notes');
    } finally {
      setLoading(false);
    }
  }, [classSearch]);

  useEffect(() => {
    const t = setTimeout(fetchData, 250);
    return () => clearTimeout(t);
  }, [fetchData]);

  const studentMap = useMemo(() => {
    return new Map(
      students.map((s) => [getId(s), `${s.firstName || ''} ${s.lastName || ''}`.trim() || getId(s)]),
    );
  }, [students]);

  const classMap = useMemo(() => {
    return new Map(
      classes.map((c) => [getId(c), c.name || getId(c)]),
    );
  }, [classes]);

  const createClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClass.name || !newClass.level || !newClass.academicYear) return;
    try {
      setSaving(true);
      await classesApi.create({
        ...newClass,
        mainTeacherId: newClass.mainTeacherId || undefined,
      });
      setNewClass({ name: '', level: '', academicYear: '2026-2027', mainTeacherId: '' });
      await fetchData();
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Erreur lors de la création de la classe');
    } finally {
      setSaving(false);
    }
  };

  const removeClass = async (id: string, name: string) => {
    if (!window.confirm(`Supprimer la classe "${name}" ?`)) return;
    try {
      await classesApi.delete(id);
      setClasses((prev) => prev.filter((c) => getId(c) !== id));
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Erreur lors de la suppression de la classe');
    }
  };

  const createGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGrade.studentId || !newGrade.classId || !newGrade.subject || !newGrade.score) return;
    try {
      setSaving(true);
      await gradesApi.create({
        studentId: newGrade.studentId,
        classId: newGrade.classId,
        subject: newGrade.subject,
        type: newGrade.type,
        score: Number(newGrade.score),
        maxScore: Number(newGrade.maxScore || 20),
        teacherId: newGrade.teacherId || undefined,
        comment: newGrade.comment || undefined,
      });
      setNewGrade({
        studentId: '',
        classId: '',
        subject: '',
        type: 'Exam',
        score: '',
        maxScore: '20',
        teacherId: '',
        comment: '',
      });
      await fetchData();
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Erreur lors de la création de la note');
    } finally {
      setSaving(false);
    }
  };

  const updateGradeScore = async (gradeId: string) => {
    if (!editingScore) return;
    try {
      setSaving(true);
      await gradesApi.update(gradeId, { score: Number(editingScore) });
      setEditingGradeId(null);
      setEditingScore('');
      await fetchData();
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Erreur lors de la mise à jour de la note');
    } finally {
      setSaving(false);
    }
  };

  const removeGrade = async (id: string) => {
    if (!window.confirm('Supprimer cette note ?')) return;
    try {
      await gradesApi.delete(id);
      setGrades((prev) => prev.filter((g) => getId(g) !== id));
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Erreur lors de la suppression de la note');
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '24px 0', display: 'grid', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Classes & Notes</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>CRUD connecté à /api/v1/classes et /api/v1/grades</p>
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 16 }}>
        <form onSubmit={createClass} className="card-glass" style={{ padding: 16 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: 10 }}>Créer une classe</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 10 }}>
            <input required placeholder="Nom (ex: Terminales S1)" value={newClass.name} onChange={(e) => setNewClass({ ...newClass, name: e.target.value })} style={inputStyle} />
            <input required placeholder="Niveau (ex: Lycée)" value={newClass.level} onChange={(e) => setNewClass({ ...newClass, level: e.target.value })} style={inputStyle} />
            <input required placeholder="Année académique" value={newClass.academicYear} onChange={(e) => setNewClass({ ...newClass, academicYear: e.target.value })} style={inputStyle} />
            <select value={newClass.mainTeacherId} onChange={(e) => setNewClass({ ...newClass, mainTeacherId: e.target.value })} style={inputStyle}>
              <option value="">Prof principal (optionnel)</option>
              {teachers.map((teacher) => {
                const teacherId = getId(teacher);
                return <option key={teacherId} value={teacherId}>{teacher.firstName} {teacher.lastName}</option>;
              })}
            </select>
          </div>
          <button className="btn btn-primary" style={{ marginTop: 10 }} disabled={saving}>
            {saving ? <Loader2 size={16} /> : <Plus size={16} />} Ajouter la classe
          </button>
        </form>

        <form onSubmit={createGrade} className="card-glass" style={{ padding: 16 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: 10 }}>Ajouter une note</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 10 }}>
            <select required value={newGrade.studentId} onChange={(e) => setNewGrade({ ...newGrade, studentId: e.target.value })} style={inputStyle}>
              <option value="">Étudiant</option>
              {students.map((student) => {
                const studentId = getId(student);
                return <option key={studentId} value={studentId}>{student.firstName} {student.lastName}</option>;
              })}
            </select>
            <select required value={newGrade.classId} onChange={(e) => setNewGrade({ ...newGrade, classId: e.target.value })} style={inputStyle}>
              <option value="">Classe</option>
              {classes.map((classGroup) => {
                const classId = getId(classGroup);
                return <option key={classId} value={classId}>{classGroup.name}</option>;
              })}
            </select>
            <input required placeholder="Matière" value={newGrade.subject} onChange={(e) => setNewGrade({ ...newGrade, subject: e.target.value })} style={inputStyle} />
            <select value={newGrade.type} onChange={(e) => setNewGrade({ ...newGrade, type: e.target.value })} style={inputStyle}>
              <option value="Exam">Exam</option>
              <option value="Quiz">Quiz</option>
              <option value="Homework">Homework</option>
            </select>
            <input required type="number" min="0" placeholder="Score" value={newGrade.score} onChange={(e) => setNewGrade({ ...newGrade, score: e.target.value })} style={inputStyle} />
            <input type="number" min="1" placeholder="Max score" value={newGrade.maxScore} onChange={(e) => setNewGrade({ ...newGrade, maxScore: e.target.value })} style={inputStyle} />
            <select value={newGrade.teacherId} onChange={(e) => setNewGrade({ ...newGrade, teacherId: e.target.value })} style={inputStyle}>
              <option value="">Enseignant (optionnel)</option>
              {teachers.map((teacher) => {
                const teacherId = getId(teacher);
                return <option key={teacherId} value={teacherId}>{teacher.firstName} {teacher.lastName}</option>;
              })}
            </select>
            <input placeholder="Commentaire" value={newGrade.comment} onChange={(e) => setNewGrade({ ...newGrade, comment: e.target.value })} style={inputStyle} />
          </div>
          <button className="btn btn-primary" style={{ marginTop: 10 }} disabled={saving}>
            {saving ? <Loader2 size={16} /> : <Plus size={16} />} Ajouter la note
          </button>
        </form>
      </div>

      <div className="card-glass" style={{ padding: 14 }}>
        <input placeholder="Rechercher une classe..." value={classSearch} onChange={(e) => setClassSearch(e.target.value)} style={{ ...inputStyle, width: '100%' }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: 16 }}>
        <div className="card-glass" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '12px 14px', fontWeight: 800, borderBottom: '1px solid var(--border-color)' }}>Classes ({classes.length})</div>
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}><Loader2 size={28} style={{ margin: '0 auto 8px', display: 'block' }} />Chargement...</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-surface-elevated)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '10px 12px', textAlign: 'left' }}>Nom</th>
                  <th style={{ padding: '10px 12px', textAlign: 'left' }}>Niveau</th>
                  <th style={{ padding: '10px 12px', textAlign: 'left' }}>Année</th>
                  <th style={{ padding: '10px 12px', textAlign: 'left' }}>Étudiants</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {classes.map((classGroup) => {
                  const id = getId(classGroup);
                  return (
                    <tr key={id} style={{ borderTop: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '10px 12px', fontWeight: 700 }}>{classGroup.name}</td>
                      <td style={{ padding: '10px 12px' }}>{classGroup.level}</td>
                      <td style={{ padding: '10px 12px' }}>{classGroup.academicYear}</td>
                      <td style={{ padding: '10px 12px' }}>{classGroup.studentCount || classGroup.studentIds?.length || 0}</td>
                      <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                        <button className="btn btn-secondary" style={{ padding: '6px 10px', color: 'var(--danger-500)', borderColor: 'var(--danger-500)' }} onClick={() => removeClass(id, classGroup.name)}>
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <div className="card-glass" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '12px 14px', fontWeight: 800, borderBottom: '1px solid var(--border-color)' }}>Notes ({grades.length})</div>
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}><Loader2 size={28} style={{ margin: '0 auto 8px', display: 'block' }} />Chargement...</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-surface-elevated)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '10px 12px', textAlign: 'left' }}>Étudiant</th>
                  <th style={{ padding: '10px 12px', textAlign: 'left' }}>Classe</th>
                  <th style={{ padding: '10px 12px', textAlign: 'left' }}>Matière</th>
                  <th style={{ padding: '10px 12px', textAlign: 'left' }}>Score</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {grades.map((grade) => {
                  const id = getId(grade);
                  const isEditing = editingGradeId === id;
                  return (
                    <tr key={id} style={{ borderTop: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '10px 12px' }}>{studentMap.get(String(grade.studentId)) || String(grade.studentId)}</td>
                      <td style={{ padding: '10px 12px' }}>{classMap.get(String(grade.classId)) || String(grade.classId)}</td>
                      <td style={{ padding: '10px 12px' }}>{grade.subject}</td>
                      <td style={{ padding: '10px 12px', fontWeight: 800 }}>
                        {isEditing ? (
                          <input value={editingScore} type="number" min="0" onChange={(e) => setEditingScore(e.target.value)} style={{ ...inputStyle, width: 86, padding: '6px 8px' }} />
                        ) : (
                          `${grade.score} / ${grade.maxScore || 20}`
                        )}
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: 8 }}>
                          {isEditing ? (
                            <button className="btn btn-primary" style={{ padding: '6px 10px' }} onClick={() => updateGradeScore(id)} disabled={saving}>
                              <Save size={14} />
                            </button>
                          ) : (
                            <button className="btn btn-secondary" style={{ padding: '6px 10px' }} onClick={() => { setEditingGradeId(id); setEditingScore(String(grade.score || '')); }}>
                              Modifier
                            </button>
                          )}
                          <button className="btn btn-secondary" style={{ padding: '6px 10px', color: 'var(--danger-500)', borderColor: 'var(--danger-500)' }} onClick={() => removeGrade(id)}>
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
    </div>
  );
};

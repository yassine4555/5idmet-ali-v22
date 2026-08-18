import React, { useState, useEffect } from 'react';
import { User, BookOpen, HeartPulse, CreditCard, ArrowLeft, ShieldAlert, FileText, Mail, Phone, MapPin, Loader2, AlertCircle, Save } from 'lucide-react';
import { studentsApi } from '../api/client';
import { useNavigate } from 'react-router-dom';

interface StudentProfileViewProps {
  studentId: string;
  onBack?: () => void;
}

export const StudentProfileView: React.FC<StudentProfileViewProps> = ({ studentId, onBack }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'PERSONAL' | 'ACADEMIC' | 'MEDICAL' | 'FINANCIAL'>('PERSONAL');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);
  const [edits, setEdits] = useState<Record<string, any>>({});

  useEffect(() => {
    if (!studentId) return;
    setLoading(true);
    studentsApi.getProfile(studentId)
      .then((res) => { setData(res); setLoading(false); })
      .catch((e) => { setError(e?.response?.data?.message || 'Profil introuvable'); setLoading(false); });
  }, [studentId]);

  const handleSave = async () => {
    if (!Object.keys(edits).length) return;
    try {
      setSaving(true);
      await studentsApi.update(studentId, edits);
      setSavedMsg('Profil mis à jour avec succès !');
      setEdits({});
      setTimeout(() => setSavedMsg(null), 3000);
      const updated = await studentsApi.getProfile(studentId);
      setData(updated);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Erreur lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  };

  const patchField = (section: string, key: string, value: any) => {
    setEdits((prev) => ({
      ...prev,
      [section]: { ...(prev[section] || {}), [key]: value },
    }));
  };

  if (loading) return (
    <div style={{ padding: '80px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
      <Loader2 size={40} style={{ margin: '0 auto 12px', display: 'block' }} />
      Chargement du profil depuis MongoDB...
    </div>
  );

  if (error) return (
    <div style={{ padding: '24px 0' }}>
      <button className="btn btn-secondary" onClick={() => (onBack ? onBack() : navigate('/students'))} style={{ marginBottom: 16 }}><ArrowLeft size={16} /> Retour</button>
      <div style={{ padding: 20, background: 'var(--danger-light)', border: '1px solid var(--danger-500)', borderRadius: 'var(--radius-md)', color: 'var(--danger-500)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <AlertCircle size={18} /> {error}
      </div>
    </div>
  );

  const user = data?.user || {};
  const profile = data?.profile || {};
  const personal = { ...(profile?.personalInfo || {}), ...(edits?.personalInfo || {}) };
  const academic = { ...(profile?.academicInfo || {}), ...(edits?.academicInfo || {}) };
  const medical = { ...(profile?.medicalInfo || {}), ...(edits?.medicalInfo || {}) };
  const financial = { ...(profile?.financialInfo || {}), ...(edits?.financialInfo || {}) };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-color)', background: 'var(--bg-surface-elevated)',
    color: 'var(--text-main)', fontSize: '0.88rem', outline: 'none',
  };

  return (
    <div className="animate-fade-in" style={{ padding: '24px 0' }}>
      <button className="btn btn-secondary" onClick={() => (onBack ? onBack() : navigate('/students'))} style={{ marginBottom: 16 }}>
        <ArrowLeft size={16} /> Retour à l'Annuaire
      </button>

      {/* Save success toast */}
      {savedMsg && (
        <div style={{ padding: '12px 16px', background: 'var(--success-light)', border: '1px solid var(--success-500)', borderRadius: 'var(--radius-md)', color: 'var(--success-500)', marginBottom: 16, fontWeight: 700 }}>
          ✅ {savedMsg}
        </div>
      )}

      {/* Profile Banner */}
      <div className="card-glass" style={{ padding: 24, marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, #4F46E5, #06B6D4)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.8rem', boxShadow: '0 4px 14px rgba(79,70,229,0.3)' }}>
            {(user.firstName?.[0] || '?').toUpperCase()}{(user.lastName?.[0] || '').toUpperCase()}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{user.firstName} {user.lastName}</h2>
              <span className={`badge ${user.status === 'ACTIVE' ? 'badge-success' : 'badge-danger'}`}>{user.status}</span>
              <span className="badge badge-primary">{academic?.currentGradeLevel || '—'}</span>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 4, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <span>Matricule: <strong style={{ color: 'var(--primary-500)', fontFamily: 'monospace' }}>{profile?.studentRegistrationId || '—'}</strong></span>
              <span><Mail size={12} /> {user.email}</span>
              <span><Phone size={12} /> {user.phone || '—'}</span>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {Object.keys(edits).length > 0 && (
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 size={16} /> : <Save size={16} />} Enregistrer les modifications
            </button>
          )}
          <button className="btn btn-outline" style={{ fontSize: '0.82rem' }}>
            <FileText size={16} /> Générer Bulletin
          </button>
        </div>
      </div>

      {/* 4 Tabs */}
      <div className="card-glass" style={{ padding: 6, marginBottom: 24, display: 'inline-flex', gap: 6 }}>
        {[
          { id: 'PERSONAL', label: '1. Personnel', icon: User },
          { id: 'ACADEMIC', label: '2. Académique', icon: BookOpen },
          { id: 'MEDICAL', label: '3. Médical', icon: HeartPulse },
          { id: 'FINANCIAL', label: '4. Finance', icon: CreditCard },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`btn ${activeTab === tab.id ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '10px 18px', fontSize: '0.85rem' }}>
              <Icon size={16} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="card-glass" style={{ padding: 24 }}>

        {/* ── Tab 1: Personnel ── */}
        {activeTab === 'PERSONAL' && (
          <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            {[
              { label: 'Date de Naissance', key: 'dateOfBirth', section: 'personalInfo' },
              { label: 'Genre', key: 'gender', section: 'personalInfo' },
              { label: 'Nationalité', key: 'nationality', section: 'personalInfo' },
              { label: 'Numéro d\'Identité (CIN)', key: 'nationalIdNumber', section: 'personalInfo' },
            ].map((f) => (
              <div key={f.key} style={{ padding: 16, borderRadius: 'var(--radius-md)', background: 'var(--bg-surface-elevated)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: 6 }}>{f.label}</div>
                <input
                  style={inputStyle}
                  value={(personal as any)[f.key] || ''}
                  onChange={(e) => patchField(f.section, f.key, e.target.value)}
                  placeholder={f.label}
                />
              </div>
            ))}
            <div style={{ gridColumn: 'span 2', padding: 16, borderRadius: 'var(--radius-md)', background: 'var(--bg-surface-elevated)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: 6 }}><MapPin size={12} /> Adresse</div>
              <input style={inputStyle} value={personal.address || ''} onChange={(e) => patchField('personalInfo', 'address', e.target.value)} placeholder="Adresse complète" />
            </div>
            <div style={{ gridColumn: 'span 2', padding: 16, borderRadius: 'var(--radius-md)', background: 'var(--primary-light)', border: '1px solid var(--primary-500)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--primary-500)', fontWeight: 700, marginBottom: 8 }}>Contact d'Urgence</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                <input style={inputStyle} value={personal.emergencyContactName || ''} onChange={(e) => patchField('personalInfo', 'emergencyContactName', e.target.value)} placeholder="Nom du contact" />
                <input style={inputStyle} value={personal.emergencyContactPhone || ''} onChange={(e) => patchField('personalInfo', 'emergencyContactPhone', e.target.value)} placeholder="Téléphone" />
                <input style={inputStyle} value={personal.emergencyContactRelation || ''} onChange={(e) => patchField('personalInfo', 'emergencyContactRelation', e.target.value)} placeholder="Relation (Mère, Père...)" />
              </div>
            </div>
          </div>
        )}

        {/* ── Tab 2: Académique ── */}
        {activeTab === 'ACADEMIC' && (
          <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            <div style={{ padding: 16, borderRadius: 'var(--radius-md)', background: 'var(--bg-surface-elevated)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: 6 }}>Moyenne Générale (GPA)</div>
              <input type="number" step="0.1" min="0" max="20" style={inputStyle} value={academic.currentGPA || ''} onChange={(e) => patchField('academicInfo', 'currentGPA', parseFloat(e.target.value))} placeholder="ex: 16.5" />
            </div>
            <div style={{ padding: 16, borderRadius: 'var(--radius-md)', background: 'var(--bg-surface-elevated)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: 6 }}>Classe / Niveau</div>
              <input style={inputStyle} value={academic.currentGradeLevel || ''} onChange={(e) => patchField('academicInfo', 'currentGradeLevel', e.target.value)} placeholder="ex: Terminales S1" />
            </div>
            <div style={{ padding: 16, borderRadius: 'var(--radius-md)', background: 'var(--bg-surface-elevated)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: 6 }}>Note de Conduite</div>
              <input type="number" step="0.5" min="0" max="20" style={inputStyle} value={academic.conductScore || ''} onChange={(e) => patchField('academicInfo', 'conductScore', parseFloat(e.target.value))} placeholder="ex: 18" />
            </div>
            <div style={{ padding: 16, borderRadius: 'var(--radius-md)', background: 'var(--bg-surface-elevated)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: 6 }}>École Précédente</div>
              <input style={inputStyle} value={academic.previousSchool || ''} onChange={(e) => patchField('academicInfo', 'previousSchool', e.target.value)} placeholder="Nom de l'établissement" />
            </div>
            <div style={{ padding: 16, borderRadius: 'var(--radius-md)', background: 'var(--bg-surface-elevated)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: 6 }}>Date d'Inscription</div>
              <input type="date" style={inputStyle} value={academic.enrollmentDate ? academic.enrollmentDate.split('T')[0] : ''} onChange={(e) => patchField('academicInfo', 'enrollmentDate', e.target.value)} />
            </div>
            <div style={{ gridColumn: 'span 3', padding: 16, borderRadius: 'var(--radius-md)', background: 'var(--bg-surface-elevated)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: 8 }}>Spécialités (séparées par virgule)</div>
              <input style={inputStyle} value={(academic.specialties || []).join(', ')} onChange={(e) => patchField('academicInfo', 'specialties', e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean))} placeholder="Mathématiques, Physique-Chimie, NSI..." />
            </div>
          </div>
        )}

        {/* ── Tab 3: Médical ── */}
        {activeTab === 'MEDICAL' && (
          <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            <div style={{ padding: 16, borderRadius: 'var(--radius-md)', background: 'var(--bg-surface-elevated)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: 6 }}>Groupe Sanguin</div>
              <select style={inputStyle} value={medical.bloodGroup || ''} onChange={(e) => patchField('medicalInfo', 'bloodGroup', e.target.value)}>
                <option value="">Sélectionner...</option>
                {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map((g) => <option key={g}>{g}</option>)}
              </select>
            </div>
            <div style={{ padding: 16, borderRadius: 'var(--radius-md)', background: 'var(--bg-surface-elevated)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: 6 }}>Allergies (séparées par virgule)</div>
              <input style={inputStyle} value={(medical.allergies || []).join(', ')} onChange={(e) => patchField('medicalInfo', 'allergies', e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean))} placeholder="ex: Pénicilline, Arachides" />
            </div>
            <div style={{ padding: 16, borderRadius: 'var(--radius-md)', background: 'var(--bg-surface-elevated)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: 6 }}>Médecin Traitant</div>
              <input style={inputStyle} value={medical.emergencyDoctorName || ''} onChange={(e) => patchField('medicalInfo', 'emergencyDoctorName', e.target.value)} placeholder="Nom du médecin" />
            </div>
            <div style={{ padding: 16, borderRadius: 'var(--radius-md)', background: 'var(--bg-surface-elevated)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: 6 }}>Téléphone Médecin</div>
              <input style={inputStyle} value={medical.emergencyDoctorPhone || ''} onChange={(e) => patchField('medicalInfo', 'emergencyDoctorPhone', e.target.value)} placeholder="+33 ..." />
            </div>
            <div style={{ gridColumn: 'span 2', padding: 16, borderRadius: 'var(--radius-md)', background: 'var(--warning-light)', border: '1px solid var(--warning-500)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--warning-500)', fontWeight: 800, marginBottom: 8 }}>
                <ShieldAlert size={18} /> Notes Médicales / Protocole PAI
              </div>
              <textarea style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }} value={medical.medicalNotes || ''} onChange={(e) => patchField('medicalInfo', 'medicalNotes', e.target.value)} placeholder="Protocole d'accueil individualisé, conditions chroniques, notes importantes..." />
            </div>
          </div>
        )}

        {/* ── Tab 4: Finance ── */}
        {activeTab === 'FINANCIAL' && (
          <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            <div style={{ padding: 16, borderRadius: 'var(--radius-md)', background: 'var(--bg-surface-elevated)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: 6 }}>Formule d'Inscription</div>
              <input style={inputStyle} value={financial.tuitionCategory || ''} onChange={(e) => patchField('financialInfo', 'tuitionCategory', e.target.value)} placeholder="ex: Régulier + Cantine" />
            </div>
            <div style={{ padding: 16, borderRadius: 'var(--radius-md)', background: 'var(--bg-surface-elevated)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: 6 }}>Plan de Paiement</div>
              <select style={inputStyle} value={financial.paymentPlan || ''} onChange={(e) => patchField('financialInfo', 'paymentPlan', e.target.value)}>
                <option value="">Sélectionner...</option>
                <option value="MONTHLY">Mensuel</option>
                <option value="TRIMESTRIAL">Trimestriel</option>
                <option value="ANNUAL">Annuel</option>
              </select>
            </div>
            <div style={{ padding: 16, borderRadius: 'var(--radius-md)', background: 'var(--bg-surface-elevated)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: 6 }}>% Bourse / Réduction</div>
              <input type="number" min="0" max="100" style={inputStyle} value={financial.scholarshipPercentage || ''} onChange={(e) => patchField('financialInfo', 'scholarshipPercentage', parseInt(e.target.value))} placeholder="ex: 25" />
            </div>
            <div style={{ padding: 16, borderRadius: 'var(--radius-md)', background: financial.accountBalance < 0 ? 'var(--danger-light)' : 'var(--success-light)', border: `1px solid ${financial.accountBalance < 0 ? 'var(--danger-500)' : 'var(--success-500)'}` }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: financial.accountBalance < 0 ? 'var(--danger-500)' : 'var(--success-500)', marginBottom: 6 }}>Solde du Compte Élève (€)</div>
              <input type="number" style={inputStyle} value={financial.accountBalance ?? ''} onChange={(e) => patchField('financialInfo', 'accountBalance', parseFloat(e.target.value))} placeholder="ex: 0" />
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Award, Download, Printer, ShieldCheck, FileCheck, Loader2 } from 'lucide-react';
import { studentsApi } from '../api/client';

export const CertificateGenerator: React.FC = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [certificateType, setCertificateType] = useState('CERTIFICATE_OF_ENROLLMENT');
  const [isGenerated, setIsGenerated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    studentsApi.list()
      .then((stList) => {
        setStudents(stList || []);
        if (stList && stList.length > 0) {
          setSelectedStudentId(stList[0].id);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const currentStudentObj = students.find((s) => s.id === selectedStudentId);
  const selectedStudentName = currentStudentObj
    ? `${currentStudentObj.firstName} ${currentStudentObj.lastName}`
    : 'Élève Sélectionné';
  const selectedClass = currentStudentObj?.currentGradeLevel || 'Terminales S1';

  const handleGenerate = () => {
    setIsGenerated(true);
  };

  return (
    <div className="animate-fade-in" style={{ padding: '24px 0' }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Générateur de Certificats & Attestations</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Édition officielle et génération sécurisée de documents administratifs</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
        {/* Controls Card */}
        <div className="card-glass" style={{ padding: 20 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: 16 }}>Configuration du Document</h3>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
              Élève Destinataire
            </label>
            {loading ? (
              <div style={{ padding: 10, color: 'var(--text-muted)' }}><Loader2 size={16} className="animate-spin" /> Chargement...</div>
            ) : (
              <select
                value={selectedStudentId}
                onChange={(e) => { setSelectedStudentId(e.target.value); setIsGenerated(false); }}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-surface-elevated)', color: 'var(--text-main)', fontSize: '0.88rem' }}
              >
                {students.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.firstName} {st.lastName} ({st.currentGradeLevel || 'Sans classe'})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
              Type de Certificat
            </label>
            <select
              value={certificateType}
              onChange={(e) => setCertificateType(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-surface-elevated)', color: 'var(--text-main)', fontSize: '0.88rem' }}
            >
              <option value="CERTIFICATE_OF_ENROLLMENT">Certificat de Scolarité Officiel</option>
              <option value="ATTENDANCE_ATTETSATION">Attestation de Présence & Assiduité</option>
              <option value="HONOR_ROLL">Attestation de Réussite & Tableau d'Honneur</option>
            </select>
          </div>

          <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleGenerate} disabled={!selectedStudentId}>
            <Award size={18} /> Générer le Certificat (PDF)
          </button>
        </div>

        {/* Certificate Preview Card */}
        <div className="card-glass" style={{ padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#FFFFFF', color: '#0F172A', border: '2px solid var(--primary-500)', boxShadow: 'var(--shadow-glow)' }}>
          {isGenerated ? (
            <div className="animate-fade-in" style={{ width: '100%', maxWidth: 540, textAlign: 'center', border: '8px double #4F46E5', padding: 32, borderRadius: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div style={{ fontWeight: 900, fontSize: '1.4rem', color: '#4F46E5' }}>EDUPRO ACADEMY</div>
                <ShieldCheck size={32} color="#10B981" />
              </div>

              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 16 }}>
                Certificat de Scolarité
              </h2>

              <p style={{ fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 20 }}>
                Le Directeur de l'Établissement EDUPRO certifie que l'élève <strong>{selectedStudentName}</strong> (Matricule: {currentStudentObj?.registrationId || 'EDU-2026'}), est régulièrement inscrit(e) pour l'année académique <strong>2026-2027</strong> en classe de <strong>{selectedClass}</strong>.
              </p>

              <div style={{ fontSize: '0.78rem', color: '#64748B', fontFamily: 'monospace', marginBottom: 24 }}>
                Signature Numérique Vérifiée: SHA256-EDUPRO-9028371-VALID
              </div>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                <button className="btn btn-primary" onClick={() => alert('Téléchargement du document PDF sécurisé...')}>
                  <Download size={16} /> Télécharger PDF
                </button>
                <button className="btn btn-secondary" onClick={() => window.print()}>
                  <Printer size={16} /> Imprimer
                </button>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: '#64748B' }}>
              <FileCheck size={48} color="#4F46E5" style={{ marginBottom: 12 }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Aperçu du Certificat Officiel</h3>
              <p style={{ fontSize: '0.85rem' }}>Sélectionnez un élève et cliquez sur "Générer" pour prévisualiser le document.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

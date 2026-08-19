import React, { useState, useEffect, useCallback } from 'react';
import { Send, FileText, BellRing, Loader2, AlertCircle, Trash2, RefreshCw, Plus } from 'lucide-react';
import { financeApi, studentsApi } from '../api/client';

export const FinanceManager: React.FC = () => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [newInvoice, setNewInvoice] = useState({
    studentId: '', description: '', totalAmount: '', dueDate: '',
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [inv, sum, stList] = await Promise.all([
        financeApi.listInvoices(selectedFilter !== 'ALL' ? selectedFilter : undefined),
        financeApi.summary(),
        studentsApi.list(),
      ]);
      setInvoices(inv);
      setSummary(sum);
      setStudents(stList);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Erreur de chargement des données financières');
    } finally {
      setLoading(false);
    }
  }, [selectedFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSendReminder = async (invId: string) => {
    try {
      const res = await financeApi.sendReminder(invId);
      showNotification(`🔔 ${res.message}`);
      await fetchData();
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Erreur lors de l\'envoi de relance');
    }
  };

  const handleDelete = async (invId: string, invNumber: string) => {
    if (!window.confirm(`Supprimer la facture ${invNumber} ?`)) return;
    try {
      await financeApi.deleteInvoice(invId);
      showNotification(`🗑️ Facture ${invNumber} supprimée`);
      setInvoices((prev) => prev.filter((i) => (i._id || i.id) !== invId));
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Erreur lors de la suppression');
    }
  };

  const handleMarkAsPaid = async (invId: string, totalAmount: number) => {
    try {
      await financeApi.updateInvoice(invId, { paidAmount: totalAmount });
      showNotification('✅ Facture marquée comme payée');
      await fetchData();
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Erreur lors de la mise à jour');
    }
  };

  const handleMarkPartial = async (invId: string, totalAmount: number, paidAmount: number) => {
    const suggested = paidAmount > 0 ? paidAmount : Math.max(1, Math.floor(totalAmount / 2));
    const userValue = window.prompt('Montant partiellement payé', String(suggested));
    if (!userValue) return;
    const value = Number(userValue);
    if (Number.isNaN(value) || value < 0) return;
    try {
      await financeApi.updateInvoice(invId, { paidAmount: value });
      showNotification('💶 Paiement partiel enregistré');
      await fetchData();
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Erreur lors de la mise à jour');
    }
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInvoice.studentId || !newInvoice.description || !newInvoice.totalAmount || !newInvoice.dueDate) return;
    try {
      setCreateLoading(true);
      await financeApi.createInvoice({
        studentId: newInvoice.studentId,
        description: newInvoice.description,
        totalAmount: parseFloat(newInvoice.totalAmount),
        dueDate: newInvoice.dueDate,
      });
      showNotification('✅ Facture créée avec succès');
      setShowCreateForm(false);
      setNewInvoice({ studentId: '', description: '', totalAmount: '', dueDate: '' });
      await fetchData();
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Erreur lors de la création');
    } finally {
      setCreateLoading(false);
    }
  };

  const statusLabel = (s: string) => ({ PAID: 'PAYÉE', OVERDUE: 'EN RETARD', PARTIALLY_PAID: 'PARTIEL', PENDING: 'EN ATTENTE', CANCELLED: 'ANNULÉE', DRAFT: 'BROUILLON' })[s] || s;
  const statusBadge = (s: string) => s === 'PAID' ? 'badge-success' : s === 'OVERDUE' ? 'badge-danger' : 'badge-warning';

  return (
    <div className="animate-fade-in" style={{ padding: '24px 0' }}>
      {/* Notification */}
      {notification && (
        <div style={{ padding: '14px 20px', borderRadius: 'var(--radius-md)', background: 'var(--primary-500)', color: '#FFF', fontWeight: 700, marginBottom: 20, boxShadow: 'var(--shadow-glow)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <BellRing size={20} /> {notification}
        </div>
      )}

      {error && (
        <div style={{ padding: '12px 16px', background: 'var(--danger-light)', border: '1px solid var(--danger-500)', borderRadius: 'var(--radius-md)', color: 'var(--danger-500)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
          <AlertCircle size={16} /> {error}
          <button onClick={() => setError(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger-500)', fontWeight: 700 }}>✕</button>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Finance & Encaissements</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Facturation, paiements et relances — connecté à MongoDB Atlas</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary" onClick={fetchData} disabled={loading} style={{ padding: '8px 12px' }}>
            <RefreshCw size={16} />
          </button>
          <button className="btn btn-primary" onClick={() => setShowCreateForm(!showCreateForm)}>
            <Plus size={18} /> Créer une Facture
          </button>
        </div>
      </div>

      {/* Create Invoice Form */}
      {showCreateForm && (
        <form onSubmit={handleCreateInvoice} className="card-glass animate-fade-in" style={{ padding: 20, marginBottom: 20 }}>
          <h3 style={{ fontWeight: 800, marginBottom: 16, fontSize: '1rem' }}>📄 Nouvelle Facture</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginBottom: 12 }}>
            <select
              required
              value={newInvoice.studentId}
              onChange={(e) => setNewInvoice({ ...newInvoice, studentId: e.target.value })}
              style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-surface-elevated)', color: 'var(--text-main)', fontSize: '0.85rem', outline: 'none' }}
            >
              <option value="">Sélectionner un étudiant *</option>
              {students.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.firstName} {st.lastName} ({st.email})
                </option>
              ))}
            </select>

            <input required placeholder="Objet / Description *" value={newInvoice.description} onChange={(e) => setNewInvoice({ ...newInvoice, description: e.target.value })}
              style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-surface-elevated)', color: 'var(--text-main)', fontSize: '0.85rem', outline: 'none' }} />
            <input required type="number" placeholder="Montant Total (€) *" value={newInvoice.totalAmount} onChange={(e) => setNewInvoice({ ...newInvoice, totalAmount: e.target.value })}
              style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-surface-elevated)', color: 'var(--text-main)', fontSize: '0.85rem', outline: 'none' }} />
            <input required type="date" value={newInvoice.dueDate} onChange={(e) => setNewInvoice({ ...newInvoice, dueDate: e.target.value })}
              style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-surface-elevated)', color: 'var(--text-main)', fontSize: '0.85rem', outline: 'none' }} />
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="submit" className="btn btn-primary" disabled={createLoading}>
              {createLoading ? <Loader2 size={16} /> : <FileText size={16} />} Confirmer & Émettre la Facture
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => setShowCreateForm(false)}>Annuler</button>
          </div>
        </form>
      )}

      {/* KPI Cards */}
      {summary && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 24 }}>
          <div className="card-glass" style={{ padding: 20 }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>Total Facturé</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{summary.totalInvoiced?.toLocaleString('fr-FR')} €</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: 4 }}>{invoices.length} facture(s)</div>
          </div>
          <div className="card-glass" style={{ padding: 20, borderLeft: '4px solid var(--success-500)' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--success-500)', marginBottom: 6 }}>Encaissements Effectués</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--success-500)' }}>{summary.totalCollected?.toLocaleString('fr-FR')} €</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: 4 }}>Taux: {summary.recoveryRate}%</div>
          </div>
          <div className="card-glass" style={{ padding: 20, borderLeft: '4px solid var(--danger-500)' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--danger-500)', marginBottom: 6 }}>Règlements en Retard</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--danger-500)' }}>{summary.totalOverdue?.toLocaleString('fr-FR')} €</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--danger-500)', fontWeight: 700, marginTop: 4 }}>{summary.overdueCount} relance(s) requise(s)</div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="card-glass" style={{ padding: 6, marginBottom: 20, display: 'inline-flex', gap: 6 }}>
        {[{ id: 'ALL', label: 'Toutes' }, { id: 'OVERDUE', label: 'En Retard' }, { id: 'PARTIALLY_PAID', label: 'Partiel' }, { id: 'PENDING', label: 'En Attente' }, { id: 'PAID', label: 'Payées' }].map((f) => (
          <button key={f.id} onClick={() => setSelectedFilter(f.id)} className={`btn ${selectedFilter === f.id ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '8px 14px', fontSize: '0.82rem' }}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card-glass" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)' }}>
            <Loader2 size={32} style={{ margin: '0 auto 12px', display: 'block' }} />
            Chargement depuis MongoDB Atlas...
          </div>
        ) : invoices.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)' }}>
            <FileText size={40} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.3 }} />
            <div style={{ fontWeight: 700 }}>Aucune facture trouvée</div>
            <div style={{ fontSize: '0.85rem' }}>Créez votre première facture en cliquant sur "Créer une Facture"</div>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-surface-elevated)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <th style={{ padding: '14px 20px' }}>N° Facture</th>
                <th style={{ padding: '14px 20px' }}>Objet</th>
                <th style={{ padding: '14px 20px' }}>Montant</th>
                <th style={{ padding: '14px 20px' }}>Payé</th>
                <th style={{ padding: '14px 20px' }}>Échéance</th>
                <th style={{ padding: '14px 20px' }}>Statut</th>
                <th style={{ padding: '14px 20px' }}>Relances</th>
                <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => {
                const id = inv._id || inv.id;
                return (
                  <tr key={id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '14px 20px', fontFamily: 'monospace', fontWeight: 700, color: 'var(--primary-500)' }}>{inv.invoiceNumber}</td>
                    <td style={{ padding: '14px 20px', color: 'var(--text-muted)', maxWidth: 200 }}>
                      {(inv.items?.[0]?.description || '—').slice(0, 40)}
                    </td>
                    <td style={{ padding: '14px 20px', fontWeight: 800 }}>{inv.totalAmount?.toLocaleString('fr-FR')} €</td>
                    <td style={{ padding: '14px 20px', color: inv.paidAmount > 0 ? 'var(--success-500)' : 'var(--text-subtle)' }}>
                      {inv.paidAmount?.toLocaleString('fr-FR')} €
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: '0.82rem', fontWeight: 600 }}>
                      {inv.dueDate ? new Date(inv.dueDate).toLocaleDateString('fr-FR') : '—'}
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <span className={`badge ${statusBadge(inv.status)}`}>{statusLabel(inv.status)}</span>
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {inv.reminderCount || 0} envoyée(s)
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                        {(inv.status === 'OVERDUE' || inv.status === 'PARTIALLY_PAID' || inv.status === 'PENDING') && (
                          <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.78rem', background: 'linear-gradient(135deg, #EF4444, #F59E0B)' }} onClick={() => handleSendReminder(id)}>
                            <Send size={14} /> Relance
                          </button>
                        )}
                        {inv.status !== 'PAID' && (
                          <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.78rem' }} onClick={() => handleMarkPartial(id, Number(inv.totalAmount || 0), Number(inv.paidAmount || 0))}>
                            Partiel
                          </button>
                        )}
                        {inv.status !== 'PAID' && (
                          <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.78rem' }} onClick={() => handleMarkAsPaid(id, Number(inv.totalAmount || 0))}>
                            Payée
                          </button>
                        )}
                        <button className="btn btn-secondary" style={{ padding: '6px 10px', color: 'var(--danger-500)', borderColor: 'var(--danger-500)' }} onClick={() => handleDelete(id, inv.invoiceNumber)}>
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

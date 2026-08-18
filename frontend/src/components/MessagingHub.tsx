import React, { useState } from 'react';
import { Send, Paperclip, Smartphone } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: string;
  role: string;
  avatar: string;
  content: string;
  attachment: string | null;
  reactions: Record<string, number>;
  time: string;
}

export const MessagingHub: React.FC = () => {
  const [activeConvId, setActiveConvId] = useState('conv_1');
  const [isMobilePreview, setIsMobilePreview] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [fileAttachment, setFileAttachment] = useState<string | null>(null);

  const conversations = [
    { id: 'conv_1', title: 'Classe Terminales S1', type: 'CLASS', unread: 3, avatar: '📚', lastMsg: 'N oubliez pas le DM de Physique pour demain !' },
    { id: 'conv_2', title: 'Mme. Claire Bernard (Maths)', type: 'DIRECT', unread: 0, avatar: '👩‍🏫', lastMsg: 'Note mise à jour dans votre bulletin.' },
    { id: 'conv_3', title: 'Annonces Direction Scolaire', type: 'ANNOUNCEMENT', unread: 1, avatar: '📢', lastMsg: 'Calendrier des conseils de classe.' },
  ];

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'M. Thomas Dubois',
      role: 'TEACHER',
      avatar: '👨‍🏫',
      content: 'Bonjour à tous. Le support du chapitre 4 sur les équations différentielles est maintenant disponible !',
      attachment: 'Chapitre_4_Equations_Diff.pdf (2.4 MB)',
      reactions: { '👍': 4, '❤️': 2 },
      time: '10:14',
    },
    {
      id: 'm2',
      sender: 'Lucas Martin',
      role: 'STUDENT',
      avatar: '👨‍🎓',
      content: 'Merci Monsieur ! Est-ce que l exercice 15 page 104 est à rendre obligatoirement ?',
      attachment: null,
      reactions: { '👌': 1 },
      time: '10:20',
    },
    {
      id: 'm3',
      sender: 'M. Thomas Dubois',
      role: 'TEACHER',
      avatar: '👨‍🏫',
      content: 'Non, c est un exercice facultatif pour vous entraîner au prochain DST.',
      attachment: null,
      reactions: { '🔥': 5 },
      time: '10:25',
    },
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() && !fileAttachment) return;

    setMessages([
      ...messages,
      {
        id: `m_${Date.now()}`,
        sender: 'Vous (Élève)',
        role: 'STUDENT',
        avatar: '👤',
        content: inputMessage,
        attachment: fileAttachment,
        reactions: {},
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setInputMessage('');
    setFileAttachment(null);
  };

  const addReaction = (msgId: string, emoji: string) => {
    setMessages(
      messages.map((m) => {
        if (m.id === msgId) {
          const currentCount = m.reactions[emoji] || 0;
          return {
            ...m,
            reactions: { ...m.reactions, [emoji]: currentCount + 1 },
          };
        }
        return m;
      }),
    );
  };

  return (
    <div className="animate-fade-in" style={{ padding: '24px 0' }}>
      {/* Header & Controls (Screen 2c) */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Messagerie & Communication (2c)</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Conversations de classe, pièces jointes, réactions et mode mobile</p>
        </div>
        <button
          className={`btn ${isMobilePreview ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setIsMobilePreview(!isMobilePreview)}
        >
          <Smartphone size={18} /> {isMobilePreview ? 'Aperçu Bureau' : 'Aperçu Version Mobile (2c)'}
        </button>
      </div>

      {/* Main Messaging Container */}
      <div
        className="card-glass"
        style={{
          display: 'grid',
          gridTemplateColumns: isMobilePreview ? '1fr' : '320px 1fr',
          height: 620,
          padding: 0,
          overflow: 'hidden',
          maxWidth: isMobilePreview ? 400 : '100%',
          margin: isMobilePreview ? '0 auto' : '0',
          border: isMobilePreview ? '8px solid var(--border-hover)' : '1px solid var(--border-color)',
          borderRadius: isMobilePreview ? 32 : 'var(--radius-lg)',
        }}
      >
        {/* Left Sidebar: Conversations list */}
        {(!isMobilePreview || activeConvId === '') && (
          <div style={{ borderRight: '1px solid var(--border-color)', background: 'var(--bg-surface-elevated)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: 16, borderBottom: '1px solid var(--border-color)', fontWeight: 800, fontSize: '0.95rem' }}>
              💬 Channels & Discuter
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => setActiveConvId(conv.id)}
                  style={{
                    padding: 14,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    borderBottom: '1px solid var(--border-color)',
                    background: activeConvId === conv.id ? 'var(--primary-light)' : 'transparent',
                    borderLeft: activeConvId === conv.id ? '4px solid var(--primary-500)' : '4px solid transparent',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ fontSize: '1.4rem' }}>{conv.avatar}</div>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{conv.title}</span>
                      {conv.unread > 0 && <span className="badge badge-primary">{conv.unread}</span>}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 2 }}>
                      {conv.lastMsg}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Message Stream */}
        <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--bg-surface)' }}>
          {/* Chat Top Banner */}
          <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-surface-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: '1.3rem' }}>📚</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>Classe Terminales S1</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>28 Élèves • 6 Enseignants • En ligne</div>
              </div>
            </div>
          </div>

          {/* Messages Feed */}
          <div style={{ flex: 1, padding: 20, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {messages.map((msg) => (
              <div key={msg.id} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--bg-surface-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', border: '1px solid var(--border-color)' }}>
                  {msg.avatar}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{msg.sender}</span>
                    <span className={`badge ${msg.role === 'TEACHER' ? 'badge-primary' : 'badge-secondary'}`} style={{ fontSize: '0.65rem' }}>
                      {msg.role === 'TEACHER' ? 'Professeur' : 'Élève'}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>{msg.time}</span>
                  </div>

                  <div style={{ padding: 12, borderRadius: 'var(--radius-md)', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', fontSize: '0.88rem', display: 'inline-block', maxWidth: '85%' }}>
                    {msg.content}

                    {/* Attachment preview box */}
                    {msg.attachment && (
                      <div style={{ marginTop: 8, padding: 8, borderRadius: 8, background: 'var(--primary-light)', border: '1px solid var(--primary-500)', display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.78rem', color: 'var(--primary-500)', fontWeight: 600 }}>
                        <Paperclip size={14} /> {msg.attachment}
                      </div>
                    )}
                  </div>

                  {/* Reaction buttons */}
                  <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                    {Object.entries(msg.reactions).map(([emoji, count]) => (
                      <button
                        key={emoji}
                        onClick={() => addReaction(msg.id, emoji)}
                        style={{ padding: '2px 8px', borderRadius: 12, border: '1px solid var(--border-color)', background: 'var(--bg-app)', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                      >
                        {emoji} <span>{count}</span>
                      </button>
                    ))}
                    <button
                      onClick={() => addReaction(msg.id, '👍')}
                      style={{ padding: '2px 6px', borderRadius: 12, border: '1px dashed var(--border-color)', background: 'transparent', fontSize: '0.75rem', cursor: 'pointer', color: 'var(--text-muted)' }}
                    >
                      +👍
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input Bar */}
          <form onSubmit={handleSend} style={{ padding: 14, borderTop: '1px solid var(--border-color)', background: 'var(--bg-surface-elevated)', display: 'flex', gap: 10, alignItems: 'center' }}>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ padding: 8 }}
              onClick={() => setFileAttachment(fileAttachment ? null : 'Exercice_Rendu_Lucas.pdf')}
              title="Ajouter une pièce jointe"
            >
              <Paperclip size={18} color={fileAttachment ? 'var(--primary-500)' : 'var(--text-muted)'} />
            </button>

            <input
              type="text"
              placeholder="Écrivez votre message à la classe..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-surface)',
                color: 'var(--text-main)',
                fontSize: '0.88rem',
                outline: 'none',
              }}
            />

            <button type="submit" className="btn btn-primary" style={{ padding: '10px 16px' }}>
              <Send size={16} /> Envoyer
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

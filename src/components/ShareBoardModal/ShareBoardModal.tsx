'use client';

import { useState } from 'react';
import { shareBoardByEmail } from '@/lib/boardService';
import { X, UserPlus, Loader2 } from 'lucide-react';
import styles from './ShareBoardModal.module.scss'; 

interface ShareBoardModalProps {
  boardId: string;
  onClose: () => void;
}

export default function ShareBoardModal({ boardId, onClose }: ShareBoardModalProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setStatusMessage(null);

    try {
      const result = await shareBoardByEmail(boardId, email);
      setStatusMessage({ type: 'success', text: result.message });
      setEmail(''); // Limpiamos el input
    } catch (error: any) {
      setStatusMessage({ type: 'error', text: error.message || 'Ocurrió un error.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
  <div className={styles.modalCard}>
    
    <button onClick={onClose} className={styles.closeBtn}>
      <X size={18} />
    </button>

    <h3 className={styles.modalTitle}>
      <UserPlus size={20} /> Compartir tablero
    </h3>
    <p className={styles.modalDescription}>
      Ingresá el correo electrónico de la persona que querés sumar a este espacio de trabajo.
    </p>

    <form onSubmit={handleSubmit} className={styles.modalForm}>
      <input
        type="email"
        placeholder="ejemplo@gmail.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={loading}
        className={styles.modalInput}
      />
      
      <button
        type="submit"
        disabled={loading || !email.trim()}
        className={styles.submitBtn}
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : 'Invitar'}
      </button>
    </form>

    {statusMessage && (
      <p className={`${styles.statusMessage} ${statusMessage.type === 'success' ? styles.success : styles.error}`}>
        {statusMessage.text}
      </p>
    )}
  </div>
</div>
  );
}
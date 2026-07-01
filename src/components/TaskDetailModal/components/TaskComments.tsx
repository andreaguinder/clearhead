'use client';

import { useState } from 'react';
import { Task, Comment } from '@/types/board';
import { auth } from '@/lib/firebase';
import Button from '../../Button/Button';
import { Send, MessageSquare } from 'lucide-react';
import styles from '../TaskDetailModal.module.scss';

interface TaskCommentsProps {
  task: Task;
  onUpdateComments: (updatedComments: Comment[]) => void;
}

export default function TaskComments({ task, onUpdateComments }: TaskCommentsProps) {
  const [newComment, setNewComment] = useState('');
  const currentComments = task.comments || [];

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    // Obtenemos el usuario que está logueado en este milisegundo en Firebase
    const currentUser = auth.currentUser;
    if (!currentUser) {
      alert("Tenés que estar logueada para comentar.");
      return;
    }

    // Creamos el nuevo objeto de comentario colaborativo
    const commentStructure: Comment = {
      id: crypto.randomUUID(), // ID único para este comentario
      text: newComment.trim(),
      userId: currentUser.uid,
      userName: currentUser.displayName || 'Usuario Anónimo',
      userPhoto: currentUser.photoURL || '', // Trae la de su cuenta de Google
      createdAt: new Date().toISOString()
    };

    // Mandamos la lista vieja + el nuevo comentario hacia el estado del tablero
    onUpdateComments([...currentComments, commentStructure]);
    setNewComment(''); // Limpiamos el textarea
  };

  return (
    <section className={styles.section}>
      <h3><MessageSquare size={18} className="inline mr-2" /> Comentarios</h3>

      {/* 1. Formulario para escribir un nuevo comentario */}
      <div className={styles.commentForm} >
        <textarea
          className={styles.textarea}
          style={{ minHeight: '60px', resize: 'none', flex: 1 }}
          placeholder="Escribí un comentario colaborativo..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={(e) => {
            // Mandar con Ctrl + Enter por comodidad
            if (e.key === 'Enter' && e.ctrlKey) {
              e.preventDefault();
              handleAddComment();
            }
          }}
        />
        <Button className={styles.btnSendComment}
          variant="secondary" 
          onClick={handleAddComment}
        >
          <Send size={16} />
        </Button>
      </div>

      {/* 2. Historial de comentarios */}
      <div className={styles.commentsList} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {currentComments.length === 0 ? (
          <p style={{ fontSize: '0.85rem', color: '#888' }}>No hay comentarios todavía.</p>
        ) : (
          // Ordenamos para que los más nuevos aparezcan arriba
          [...currentComments]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map((comment) => (
              <div key={comment.id} style={{ display: 'flex', gap: '0.75rem', fontSize: '0.9rem' }}>
                {/* Foto del Autor */}
                {comment.userPhoto ? (
                  <img 
                    src={comment.userPhoto} 
                    alt={comment.userName} 
                    style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }} 
                  />
                ) : (
                  <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>
                    {comment.userName.charAt(0)}
                  </div>
                )}
                
                {/* Globo del comentario */}
                <div className={styles.commentStyle}>
                  <div className={styles.commentStyleInfoUser}>
                    <strong>{comment.userName}</strong>
                    <span className={styles.commentDate}>
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className={styles.comment}>{comment.text}</p>
                </div>
              </div>
            ))
        )}
      </div>
    </section>
  );
}
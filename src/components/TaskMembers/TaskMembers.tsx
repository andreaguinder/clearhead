'use client';

import { useState } from 'react';
import { Task, Member } from '@/types/board';
import { Plus, X, Users } from 'lucide-react';
import Button from '../Button/Button';
import styles from '../TaskDetailModal.module.scss';

interface TaskMembersProps {
  task: Task;
  onUpdateMembers?: (updatedMembers: Member[]) => void;
  viewOnly?: boolean; // Para reusarlo en la TaskCard sin la lógica de edición
}

// 📌 MOCK DE USUARIOS DEL EQUIPO (Acá simulo un equipo. Después lo podés traer de Firestore o de tu Auth)
const TEAM_USERS: Member[] = [
  { id: 'andy-uid', name: 'Andy Guinder', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80' },
  { id: 'seba-uid', name: 'Seba', photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&q=80' },
  { id: 'gaby-uid', name: 'Gaby', photo: '' },
  { id: 'vero-uid', name: 'Vero', photo: '' }
];

export default function TaskMembers({ task, onUpdateMembers, viewOnly = false }: TaskMembersProps) {
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const currentMembers = task.members || [];

  const handleToggleMember = (user: Member) => {
    if (!onUpdateMembers) return;
    
    const isAlreadyMember = currentMembers.some(m => m.id === user.id);
    if (isAlreadyMember) {
      // Si ya está, lo eliminamos
      onUpdateMembers(currentMembers.filter(m => m.id !== user.id));
    } else {
      // Si no está, lo sumamos
      onUpdateMembers([...currentMembers, user]);
    }
  };

  return (
    <div className={styles.membersSection}>
      {!viewOnly && (
        <h4>
          <Users size={16} className="inline mr-2" /> Miembros
        </h4>
      )}

      <div className={styles.membersList} style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', alignItems: 'center' }}>
        {/* Render de los avatares actuales */}
        {currentMembers.map((member) => (
          <div 
            key={member.id} 
            className={styles.memberAvatarWrapper} 
            style={{ position: 'relative', cursor: viewOnly ? 'default' : 'pointer' }}
            onClick={() => !viewOnly && handleToggleMember(member)}
            title={viewOnly ? member.name : `Quitar a ${member.name}`}
          >
            {member.photo ? (
              <img src={member.photo} alt={member.name} style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-main, #ddd)' }} />
            ) : (
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#4f46e5', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold', border: '2px solid var(--border-main, #ddd)' }}>
                {member.name.charAt(0)}
              </div>
            )}
            
            {/* Cruz flotante para eliminar (solo si no es viewOnly) */}
            {!viewOnly && (
              <div className={styles.avatarOverlayDelete} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: '50%', backgroundColor: 'rgba(239, 68, 68, 0.8)', display: 'none', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <X size={12} />
              </div>
            )}
          </div>
        ))}

        {/* Botón "+" para agregar miembros (Modo Edición) */}
        {!viewOnly && onUpdateMembers && (
          <div style={{ position: 'relative' }}>
            <button 
              className={styles.addMemberBtn}
              onClick={() => setIsOpenDropdown(!isOpenDropdown)}
              style={{ width: '28px', height: '28px', borderRadius: '50%', border: '2px dashed #888', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backgroundColor: 'transparent', color: '#888' }}
              title="Asignar miembro"
            >
              <Plus size={14} />
            </button>

            {/* Selector desplegable flotante */}
            {isOpenDropdown && (
              <div className={styles.membersDropdown} style={{ position: 'absolute', top: '34px', left: 0, backgroundColor: 'var(--bg-modal, #fff)', border: '1px solid var(--border-main, #ccc)', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: 50, width: '180px', padding: '0.5rem' }}>
                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', fontWeight: 'bold', color: '#666', borderBottom: '1px solid #eee', paddingBottom: '4px' }}>Miembros del equipo</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {TEAM_USERS.map((user) => {
                    const isAssigned = currentMembers.some(m => m.id === user.id);
                    return (
                      <button
                        key={user.id}
                        onClick={() => handleToggleMember(user)}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '4px 6px', borderRadius: '4px', border: 'none', backgroundColor: isAssigned ? 'var(--bg-secondary, #f0f0f0)' : 'transparent', cursor: 'pointer', textAlign: 'left', fontSize: '0.85rem' }}
                      >
                        <span style={{ fontSize: '10px' }}>{isAssigned ? '✅' : '⬜'}</span>
                        <span>{user.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
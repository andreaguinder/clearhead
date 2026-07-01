'use client';

import { useState } from 'react';
import { Task, Member } from '@/types/board';
import { Plus, X, Users } from 'lucide-react';
import styles from '../TaskDetailModal.module.scss';

interface TaskMembersProps {
  task: Task;
  members: Member[]; // 🚀 Recibimos la lista real de miembros desde el padre
  onAssignMember: (taskId: string, memberId: string) => void; // 🚀 Usamos la función asignadora unificada
  viewOnly?: boolean; 
}

export default function TaskMembers({ 
  task, 
  members, 
  onAssignMember, 
  viewOnly = false 
}: TaskMembersProps) {
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);

  // 🔍 Buscamos si la tarea actualmente tiene un miembro asignado que coincida con la lista
  const currentAssignedMember = members.find(m => m.uid === task.assignedTo);

  const handleSelectMember = (memberId: string) => {
    // Si cliquea el que ya está asignado, lo desasignamos pasando un string vacío
    if (task.assignedTo === memberId) {
      onAssignMember(task.id, '');
    } else {
      onAssignMember(task.id, memberId);
    }
    setIsOpenDropdown(false);
  };

  return (
    <div className={styles.membersSection}>
      {!viewOnly && (
        <h4>
          <Users size={16} className="inline mr-2" style={{ display: 'inline', marginRight: '8px' }} /> 
          Miembro Asignado
        </h4>
      )}

      <div className={styles.membersList} style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
        
        {/* Render del avatar asignado actualmente */}
        {currentAssignedMember ? (
          <div 
            className={styles.memberAvatarWrapper} 
            style={{ position: 'relative', cursor: viewOnly ? 'default' : 'pointer' }}
            onClick={() => !viewOnly && onAssignMember(task.id, '')}
            title={viewOnly ? currentAssignedMember.name : `Quitar a ${currentAssignedMember.name}`}
          >
            {currentAssignedMember.photoURL ? (
              <img 
                src={currentAssignedMember.photoURL} 
                alt={currentAssignedMember.name} 
                style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-main, #ddd)' }} 
              />
            ) : (
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#4f46e5', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold', border: '2px solid var(--border-main, #ddd)' }}>
                {currentAssignedMember.name?.charAt(0) || currentAssignedMember.email?.charAt(0)}
              </div>
            )}
            
            {/* Cruz flotante para desasignar rápido */}
            {!viewOnly && (
              <div className={styles.avatarOverlayDelete} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: '50%', backgroundColor: 'rgba(239, 68, 68, 0.8)', display: 'none', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <X size={12} />
              </div>
            )}
          </div>
        ) : (
          viewOnly && <span style={{ fontSize: '0.85rem', color: '#888' }}>Sin asignar</span>
        )}

        {/* Botón "+" para abrir el selector desplegable */}
        {!viewOnly && (
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
                  {members.map((user) => {
                    const isAssigned = task.assignedTo === user.uid;
                    return (
                      <button
                        key={user.uid}
                        onClick={() => handleSelectMember(user.uid)}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '4px 6px', borderRadius: '4px', border: 'none', backgroundColor: isAssigned ? 'var(--bg-secondary, #f0f0f0)' : 'transparent', cursor: 'pointer', textAlign: 'left', fontSize: '0.85rem', color: 'inherit' }}
                      >
                        <span style={{ fontSize: '10px' }}>{isAssigned ? '✅' : '⬜'}</span>
                        <span>{user.name || user.email}</span>
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
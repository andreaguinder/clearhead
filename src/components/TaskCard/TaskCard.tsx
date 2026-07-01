'use client';

import { Task, Label, Member } from '@/types/board';
import { LabelPills } from '@/components/Labels/LabelPills';
import { CheckSquare, MessageSquare } from 'lucide-react';
import styles from './TaskCard.module.scss';

interface TaskCardProps {
  task: Task;
  globalLabels: Record<string, Label>;
  onClick: () => void;
  members: Member[]; // Mantenemos la lista para buscar los datos del asignado
}

export default function TaskCard({ 
  task, 
  globalLabels, 
  onClick,
  members
}: TaskCardProps) {
  
  const priorityLabels: Record<Task['priority'], string> = {
    baja: 'Baja',
    normal: 'Normal',
    media: 'Media',
    alta: 'Alta'
  };

  const totalItems = task.checklist?.length || 0;
  const completedItems = task.checklist?.filter(item => item.isCompleted).length || 0;
  const isAllDone = totalItems > 0 && completedItems === totalItems;

  // 🔍 Buscamos al miembro asignado para sacar su foto o inicial
  const assignedMember = members.find(m => m.uid === task.assignedTo);

  return (
    <article className={styles.taskCard} onClick={onClick}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        {/* Etiqueta de prioridad */}
        <span className={`${styles.priorityBadge} ${styles[task.priority]}`}>
          {priorityLabels[task.priority]}
        </span>

        {/* 👤 Avatar estático (Solo lectura, no interrumpe el click de la tarjeta) */}
        {assignedMember && (
          <div className={styles.staticMemberAvatar} title={`Asignado a: ${assignedMember.name}`}>
            {assignedMember.photoURL ? (
              <img 
                src={assignedMember.photoURL} 
                alt={assignedMember.name} 
                style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border-main, #ddd)' }} 
              />
            ) : (
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#4f46e5', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 'bold', border: '1px solid var(--border-main, #ddd)' }}>
                {assignedMember.name?.charAt(0) || assignedMember.email?.charAt(0)}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Título de la tarjeta */}
      <h3 className={styles.taskTitle}>{task.title}</h3>

      {/* Descripción corta */}
      {task.description && <p className={styles.taskDescription}>{task.description}</p>}

      {/* Indicadores */}
      <div style={{ display: 'flex', gap: '32px', justifyContent: 'flex-start', alignItems: 'center', marginBottom: '12px' }}>
        <div>
          {totalItems > 0 && (
            <div className={`${styles.checklistBadge} ${isAllDone ? styles.badgeDone : ''}`}>
              <CheckSquare size={14} />
              <span>{completedItems}/{totalItems}</span>
            </div>
          )}
        </div>
        <div>
          {task.comments && task.comments.length > 0 && (
            <div className={styles.cardIndicator} title={`${task.comments.length} comentarios`}>
              <MessageSquare size={12} style={{ marginRight: '8px' }} />
              <span>{task.comments.length}</span>
            </div>
          )}
        </div>
      </div>

      {/* Contenedor de Etiquetas */}
      {task.labelIds && task.labelIds.length > 0 && (
        <div className={styles.labelsContainer}>
          {task.labelIds.map((labelId) => {
            const label = globalLabels[labelId];
            if (!label) return null;
            return <LabelPills key={label.id} label={label} />;
          })}
        </div>
      )}
    </article>
  );
}
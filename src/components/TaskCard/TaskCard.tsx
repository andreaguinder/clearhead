'use client';

import { Task, Label, Member } from '@/types/board';
import { LabelPills } from '@/components/Labels/LabelPills';
import { CheckSquare, MessageSquare, Calendar } from 'lucide-react'; // 🚀 Importamos Calendar
import styles from './TaskCard.module.scss';
import StackedAvatars from '../StackedAvatars/StackedAvatars';

interface TaskCardProps {
  task: Task;
  globalLabels: Record<string, Label>;
  onClick: () => void;
  members: Member[]; 
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

  // 🚀 Normalizamos para asegurarnos de que siempre sea un array iterable
  const taskAssignedIds = Array.isArray(task.assignedTo) 
    ? task.assignedTo 
    : task.assignedTo ? [task.assignedTo] : [];

  // 🔍 Filtramos los miembros reales que están asignados a esta tarjeta
  const assignedMembers = members.filter(m => taskAssignedIds.includes(m.uid));

  // 🚀 Helper para formatear la fecha a DD/MM/AA de forma nativa y limpia
  const formatDueDate = (dateString: string) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year.slice(-2)}`; // Ej: 14/04/26
  };

  // 🚀 Helper para determinar el estado de urgencia del vencimiento
  const getDueDateStatus = (dateString: string) => {
    if (!dateString) return 'normal';
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Evitamos problemas de zona horaria forzando la interpretación local pura
    const due = new Date(`${dateString}T00:00:00`);
    
    if (due < today) return 'expired'; // Ya pasó la fecha
    
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 2) return 'urgent'; // Vence en 2 días o menos
    return 'normal';
  };

  const dueDateStatus = task.dueDate ? getDueDateStatus(task.dueDate) : 'normal';

  // 🚀 Estilos dinámicos rápidos en base al estado de la fecha
  const getBadgeStyles = (status: string) => {
    if (status === 'expired') {
      return { backgroundColor: '#fef2f2', color: '#ef4444', fontWeight: '600' };
    }
    if (status === 'urgent') {
      return { backgroundColor: '#fff7ed', color: '#ea580c', fontWeight: '600' };
    }
    return { backgroundColor: 'transparent', color: 'var(--text-muted, #666)', fontWeight: 'normal' };
  };

  return (
    <article className={styles.taskCard} onClick={onClick}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        {/* Etiqueta de prioridad */}
        <span className={`${styles.priorityBadge} ${styles[task.priority]}`}>
          {priorityLabels[task.priority]}
        </span>

        {/* 👤 Contenedor de Avatares Múltiples */}
        <StackedAvatars members={assignedMembers} />
      </div>

      {/* Título de la tarjeta */}
      <h3 className={styles.taskTitle}>{task.title}</h3>

      {/* Descripción corta */}
      {task.description && <p className={styles.taskDescription}>{task.description}</p>}

      {/* Indicadores */}
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'flex-start', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap' }}>
        
        {/* 🚀 NUEVO: Indicador de Fecha de Vencimiento */}
        {task.dueDate && (
          <div 
            className={styles.cardIndicator} 
            title={dueDateStatus === 'expired' ? '¡Tarea vencida!' : dueDateStatus === 'urgent' ? 'Vence pronto (menos de 2 días)' : 'Fecha de vencimiento'}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: dueDateStatus !== 'normal' ? '2px 6px' : '0',
              borderRadius: '4px',
              fontSize: '0.75rem',
              ...getBadgeStyles(dueDateStatus)
            }}
          >
            <Calendar size={12} style={{ marginRight: '6px' }} />
            <span>{formatDueDate(task.dueDate)}</span>
          </div>
        )}

        {totalItems > 0 && (
          <div>
            <div className={`${styles.checklistBadge} ${isAllDone ? styles.badgeDone : ''}`}>
              <CheckSquare size={14} />
              <span>{completedItems}/{totalItems}</span>
            </div>
          </div>
        )}
        
        {task.comments && task.comments.length > 0 && (
          <div>
            <div className={styles.cardIndicator} title={`${task.comments.length} comentarios`}>
              <MessageSquare size={12} style={{ marginRight: '6px' }} />
              <span>{task.comments.length}</span>
            </div>
          </div>
        )}
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
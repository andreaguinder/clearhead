'use client';

import { Task, Label } from '@/types/board'; // 🌟 Importamos Label del tipado
import { LabelPills } from '@/components/Labels/LabelPills';
import { CheckSquare } from 'lucide-react';
import styles from './TaskCard.module.scss';

interface TaskCardProps {
  task: Task;
  globalLabels: Record<string, Label>; // 🌟 Recibimos el diccionario global de etiquetas
  onClick: () => void;
}

export default function TaskCard({ task, globalLabels, onClick }: TaskCardProps) {
  // Mapeamos el valor técnico a la etiqueta que lee el usuario
  const priorityLabels: Record<Task['priority'], string> = {
    baja: 'Baja',
    normal: 'Normal',
    media: 'Media',
    alta: 'Alta'
  };

  
const totalItems = task.checklist?.length || 0;
const completedItems = task.checklist?.filter(item => item.isCompleted).length || 0;
const isAllDone = totalItems > 0 && completedItems === totalItems;


  return (
    <article className={styles.taskCard} onClick={onClick}>
      <span className={`${styles.priorityBadge} ${styles[task.priority]}`}>
        {priorityLabels[task.priority]}
      </span>

      <h3 className={styles.taskTitle}>{task.title}</h3>

      {task.description && <p className={styles.taskDescription}>{task.description}</p>}

{totalItems > 0 && (
      <div className={`${styles.checklistBadge} ${isAllDone ? styles.badgeDone : ''}`}>
        <CheckSquare size={14} />
        <span>{completedItems}/{totalItems}</span>
      </div>
    )}
    
      {task.labelIds && task.labelIds.length > 0 && (
        <div className={styles.labelsContainer}>
          {task.labelIds?.map((labelId) => {
            const label = globalLabels[labelId];
            if (!label) return null;
            return <LabelPills key={label.id} label={label} />;
          })}
        </div>
      )}


    </article>
  );
}
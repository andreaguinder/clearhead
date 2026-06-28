import { Task } from '@/types/board';
import styles from './TaskCard.module.scss';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
}

export default function TaskCard({ task, onClick }: TaskCardProps) {
  // Mapeamos el valor técnico a la etiqueta que lee el usuario
  const priorityLabels: Record<Task['priority'], string> = {
    baja: 'Baja',
    normal: 'Normal',
    media: 'Media',
    alta: 'Alta'
  };

  return (
    <article className={styles.taskCard} onClick={onClick}>
      <h3>{task.title}</h3>
      {task.description && <p>{task.description}</p>}
      {/* Usamos la clase dinámica basada en el valor en español */}
      <span className={`${styles.priorityBadge} ${styles[task.priority]}`}>
        {priorityLabels[task.priority]}
      </span>
    </article>
  );
}
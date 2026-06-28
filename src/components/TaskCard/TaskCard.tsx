import { Task } from '@/types/board';
import styles from './TaskCard.module.scss';

interface TaskCardProps {
  task: Task;
  onClick: () => void; 
}

export default function TaskCard({ task, onClick }: TaskCardProps) {
  return (
    <article className={styles.taskCard} onClick={onClick}>
      <h3>{task.title}</h3>
      {task.description && <p>{task.description}</p>}
      <span className={`${styles.priorityBadge} ${styles[task.priority]}`}>
        {task.priority}
      </span>
    </article>
  );
}
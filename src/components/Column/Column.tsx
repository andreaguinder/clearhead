import { Column as ColumnType, Task } from '@/types/board';
import TaskCard from '../TaskCard/TaskCard';
import ActionButton from '../ActionButton/ActionButton';
import styles from './Column.module.scss';

interface ColumnProps {
  column: ColumnType;
  tasks: Task[];
  onTaskClick: (task: Task) => void; // 👈 Recibe la función que espera una tarea
}

export default function Column({ column, tasks, onTaskClick }: ColumnProps) {
  const handleAddTask = () => {
    console.log(`Añadir tarea en la columna: ${column.title}`);
  };

  return (
    <section className={styles.columnCard}>
      <h2 className={styles.columnTitle}>{column.title}</h2>
      
      <div className={styles.tasksList}>
        {tasks.map((task) => (
          <TaskCard 
            key={task.id} 
            task={task} 
            onClick={() => onTaskClick(task)} 
          />
        ))}
      </div>

      <div className={styles.buttonWrapper}>
        <ActionButton type="task" onClick={handleAddTask} />
      </div>
    </section>
  );
}
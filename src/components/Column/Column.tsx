import { Column as ColumnType, Task } from '@/types/board';
import TaskCard from '../TaskCard/TaskCard';
import ActionButton from '../ActionButton/ActionButton';
import styles from './Column.module.scss';

interface ColumnProps {
  column: ColumnType;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onAddTaskClick: () => void; // 👈 Recibimos la prop para añadir tarea
}

export default function Column({ column, tasks, onTaskClick, onAddTaskClick }: ColumnProps) {
  return (
    <section className={styles.columnCard}>
      <h2 className={styles.columnTitle}>{column.title}</h2>
      
      <div className={styles.tasksList}>
        {tasks.map((task) => (
          // Protegemos el renderizado: si el título está vacío (tarea en creación), no la mostramos en el tablero de fondo todavía
          task.title && (
            <TaskCard 
              key={task.id} 
              task={task} 
              onClick={() => onTaskClick(task)} 
            />
          )
        ))}
      </div>

      <div className={styles.buttonWrapper}>
        {/* 👈 Conectamos el ActionButton a la función de creación */}
        <ActionButton type="task" onClick={onAddTaskClick} />
      </div>
    </section>
  );
}
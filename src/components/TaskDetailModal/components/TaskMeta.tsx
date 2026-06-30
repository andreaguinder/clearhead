import { Task } from '@/types/board';
import PrioritySelector from '@/components/Priority/PrioritySelector';
import styles from '../TaskDetailModal.module.scss';

interface TaskMetaProps {
  dueDate: string;
  priority: Task['priority'];
  onUpdateMeta: (fields: Partial<Task>) => void;
}

export default function TaskMeta({ dueDate, priority, onUpdateMeta }: TaskMetaProps) {
  return (
    <div className={styles.metaDataGrid}>
      <div className={styles.metaItem}>
        <h4>Vencimiento</h4>
        <input
          type="date"
          className={styles.dateInput}
          value={dueDate}
          onChange={(e) => onUpdateMeta({ dueDate: e.target.value })}
        />
      </div>

      <div className={styles.metaItem}>
        <PrioritySelector
          selectedPriority={priority}
          onSelect={(val) => onUpdateMeta({ priority: val })}
        />
      </div>
      
      {/* 🚀 EL LUGAR PERFECTO: Mañana metemos acá el componente de asignación de usuarios */}
    </div>
  );
}
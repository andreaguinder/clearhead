import { Task } from '@/types/board';
import PrioritySelector from '@/components/Priority/PrioritySelector';
import styles from '../TaskDetailModal.module.scss';
import { Calendar, Flag } from 'lucide-react';

interface TaskMetaProps {
  dueDate: string;
  priority: Task['priority'];
  onUpdateMeta: (fields: Partial<Task>) => void;
}

export default function TaskMeta({ dueDate, priority, onUpdateMeta }: TaskMetaProps) {
  return (
    <div className={styles.metaDataGrid}>
      <div className={styles.metaItem}>
        <h4><Calendar size={16} className="mr-2" style={{ marginTop: '10px', marginRight: '10px', color: 'var(--text-muted, #666)' }}/>Vencimiento</h4>
        <input
          type="date"
          className={styles.dateInput}
          value={dueDate}
          onChange={(e) => onUpdateMeta({ dueDate: e.target.value })}
        />
      </div>

      <div className={styles.metaItem}>
        <h4><Flag size={16} className="mr-2" style={{ marginTop: '10px', marginRight: '10px', color: 'var(--text-muted, #666)' }} />Prioridad</h4>
        <PrioritySelector
          selectedPriority={priority}
          onSelect={(val) => onUpdateMeta({ priority: val })}
        />
      </div>
      
      {/* 🚀 EL LUGAR PERFECTO: Mañana metemos acá el componente de asignación de usuarios */}
    </div>
  );
}
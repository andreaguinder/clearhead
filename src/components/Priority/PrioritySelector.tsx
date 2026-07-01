import { Task } from '@/types/board';
import styles from './PrioritySelector.module.scss';

interface PrioritySelectorProps {
  selectedPriority: Task['priority'];
  onSelect: (priority: Task['priority']) => void;
}

export default function PrioritySelector({ selectedPriority, onSelect }: PrioritySelectorProps) {
  const priorities: { value: Task['priority']; label: string }[] = [
    { value: 'baja', label: 'Baja' },
    { value: 'normal', label: 'Normal' },
    { value: 'media', label: 'Media' },
    { value: 'alta', label: 'Alta' },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.pillsContainer}>
        {priorities.map((p) => (
          <button
            key={p.value}
            type="button"
            className={`${styles.priorityPill} ${styles[p.value]} ${selectedPriority === p.value ? styles.active : ''}`}
            onClick={() => onSelect(p.value)}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
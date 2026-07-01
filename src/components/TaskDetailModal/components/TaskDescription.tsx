import styles from '../TaskDetailModal.module.scss';
import { Text, Notebook } from 'lucide-react';

interface TaskDescriptionProps {
  shortDescription: string;
  detailedDescription: string;
  onUpdateDescription: (fields: Partial<any>) => void; // Ajustar tipo según tu interfaz Task
}

export default function TaskDescription({ shortDescription, detailedDescription, onUpdateDescription }: TaskDescriptionProps) {
  return (
    <>
      <section className={styles.section}>
        <h3><Text size={16} className={styles.headerIcon} style={{ marginTop: '10px', marginRight: '10px', color: 'var(--text-muted, #666)' }}/> Descripción Corta</h3>
        <input
          type="text"
          className={styles.shortDescriptionInput}
          placeholder="Resumen breve..."
          defaultValue={shortDescription}
          onBlur={(e) => onUpdateDescription({ description: e.target.value })}
        />
      </section>

      <section className={styles.section}>
        <h3><Notebook size={16} className={styles.headerIcon} style={{ marginTop: '10px', marginRight: '10px', color: 'var(--text-muted, #666)' }}/> Descripción Completa</h3>
        <textarea
          className={styles.textarea}
          placeholder="Añade detalle..."
          defaultValue={detailedDescription}
          onBlur={(e) => onUpdateDescription({ detailedDescription: e.target.value })}
        />
      </section>
    </>
  );
}
import styles from '../TaskDetailModal.module.scss';

interface TaskHeaderProps {
  title: string;
  columnName: string;
  onUpdateTitle: (title: string) => void;
  onClose: () => void;
}

export default function TaskHeader({ title, columnName, onUpdateTitle, onClose }: TaskHeaderProps) {
  return (
    <header className={styles.modalHeader}>
      <div className={styles.titleWrapper}>
        <div className={styles.headerInputGroup}>
          <textarea
            className={styles.titleInput}
            placeholder="Dale un título a esta tarjeta..."
            defaultValue={title}
            rows={1}
            onBlur={(e) => e.target.value.trim() && onUpdateTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                e.currentTarget.blur();
              }
            }}
          />
          <p className={styles.subTitle}>en la columna <span>{columnName}</span></p>
        </div>
      </div>
      <button className={styles.closeBtn} onClick={onClose}>✕</button>
    </header>
  );
}
import { useState } from 'react';
import { Label } from '@/types/board';
import LabelManager from '@/components/Labels/LabelManager';
import styles from '../TaskDetailModal.module.scss';

interface TaskLabelsProps {
  taskLabelIds: string[];
  globalLabels: Record<string, Label>;
  onUpdateLabels: (labelIds: string[]) => void;
  onSaveGlobalLabel: (label: Label) => void;
  onDeleteGlobalLabel: (labelId: string) => void;
}

export default function TaskLabels({
  taskLabelIds,
  globalLabels,
  onUpdateLabels,
  onSaveGlobalLabel,
  onDeleteGlobalLabel
}: TaskLabelsProps) {
  const [isLabelMenuOpen, setIsLabelMenuOpen] = useState(false);

  const toggleLabel = (labelId: string) => {
    const newLabelIds = taskLabelIds.includes(labelId)
      ? taskLabelIds.filter((id) => id !== labelId)
      : [...taskLabelIds, labelId];
    onUpdateLabels(newLabelIds);
  };

  return (
    <section className={styles.section}>
      <h3 className={styles.sectionLabel}>Etiquetas</h3>
      <div className={styles.labelsWrapper}>
        {taskLabelIds.map((labelId) => {
          const label = globalLabels[labelId];
          if (!label) return null;
          return (
            <span
              key={label.id}
              className={styles.labelPill}
              style={{ backgroundColor: label.color, color: label.textColor }}
            >
              {label.text}
              <button
                className={styles.removeLabelBtn}
                onClick={(e) => { e.stopPropagation(); toggleLabel(labelId); }}
                style={{ color: label.textColor }}
              >✕</button>
            </span>
          );
        })}
        <button className={styles.addLabelBtn} onClick={() => setIsLabelMenuOpen(!isLabelMenuOpen)}>+</button>
      </div>

      {isLabelMenuOpen && (
        <div className={styles.labelMenu}>
          <LabelManager
            globalLabels={globalLabels}
            taskLabelIds={taskLabelIds}
            onToggleLabel={toggleLabel}
            onSaveLabel={onSaveGlobalLabel}
            onDeleteLabel={onDeleteGlobalLabel}
          />
        </div>
      )}
    </section>
  );
}
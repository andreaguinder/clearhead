'use client';

import { useState } from 'react';
import { StatusId, Task, Label } from '@/types/board';
import LabelManager from '@/components/Labels/LabelManager';
import styles from './TaskDetailModal.module.scss';

interface TaskDetailModalProps {
  task: Task;
  onClose: () => void;
  onUpdateTask: (updatedTask: Task) => void;
  columnNames: Record<string, string>;
  onDeleteTask: (taskId: string, columnId: StatusId) => void;
  globalLabels: Record<string, Label>;
  onSaveGlobalLabel: (label: Label) => void;
  onDeleteGlobalLabel: (labelId: string) => void;
}

export default function TaskDetailModal({ 
  task, 
  onClose, 
  onUpdateTask, 
  onDeleteTask, 
  columnNames, 
  globalLabels, 
  onSaveGlobalLabel, 
  onDeleteGlobalLabel 
}: TaskDetailModalProps) {
  
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isLabelMenuOpen, setIsLabelMenuOpen] = useState(false);

  // Lógica para alternar etiquetas en la tarea
  const toggleLabel = (labelId: string) => {
    const currentLabels = task.labelIds || [];
    const newLabelIds = currentLabels.includes(labelId)
      ? currentLabels.filter((id) => id !== labelId)
      : [...currentLabels, labelId];
    
    onUpdateTask({ ...task, labelIds: newLabelIds });
  };

  const handleConfirmDelete = () => {
    onDeleteTask(task.id, task.status);
  };

  const handleTitleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (!e.target.value.trim()) return;
    onUpdateTask({ ...task, title: e.target.value });
  };

  const handleShortDescriptionBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    onUpdateTask({ ...task, description: e.target.value });
  };

  const handleDescriptionBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    onUpdateTask({ ...task, detailedDescription: e.target.value });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateTask({ ...task, dueDate: e.target.value });
  };

  const priorities: { value: Task['priority']; label: string }[] = [
    { value: 'baja', label: 'Baja' },
    { value: 'normal', label: 'Normal' },
    { value: 'media', label: 'Media' },
    { value: 'alta', label: 'Alta' },
  ];

  const handlePrioritySelect = (value: Task['priority']) => {
    onUpdateTask({ ...task, priority: value });
  };

  const columnNameHTML = columnNames[task.status] || task.status;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        
        <header className={styles.modalHeader}>
          <div className={styles.titleWrapper}>
            <span className={styles.icon}>📋</span>
            <div className={styles.headerInputGroup}>
              <input 
                type="text" 
                className={styles.titleInput} 
                placeholder="Dale un título a esta tarjeta..."
                defaultValue={task.title}
                onBlur={handleTitleBlur}
              />
              <p className={styles.subTitle}>en la columna <span>{columnNameHTML}</span></p>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </header>

        <div className={styles.modalBody}>
          <main className={styles.mainContent}>
            
            <section className={styles.section}>
              <h3 className={styles.sectionLabel}>Etiquetas</h3>
              <div className={styles.labelsWrapper}>
                {task.labelIds?.map((labelId) => {
                  const label = globalLabels[labelId];
                  if (!label) return null;
                  return (
                    <span key={label.id} className={styles.labelPill} style={{ backgroundColor: label.color }}>
                      {label.text}
                      <button className={styles.removeLabelBtn} onClick={(e) => {
                        e.stopPropagation();
                        toggleLabel(labelId);
                      }}>×</button>
                    </span>
                  );
                })}
                <button className={styles.addLabelBtn} onClick={() => setIsLabelMenuOpen(!isLabelMenuOpen)}>+</button>
              </div>

              {isLabelMenuOpen && (
    <div className={styles.labelMenu}>
      <LabelManager 
        globalLabels={globalLabels}
        taskLabelIds={task.labelIds || []}
        onToggleLabel={toggleLabel}
        onSaveLabel={onSaveGlobalLabel}
        onDeleteLabel={onDeleteGlobalLabel}
      />
    </div>
  )}

              {/* Menú desplegable de etiquetas */}
              {isLabelMenuOpen && (
                <div className={styles.labelMenu}>
                  <h4>Seleccionar etiquetas</h4>
                  {Object.values(globalLabels).map((label) => (
                    <div key={label.id} className={styles.labelOption}>
                      <span 
                        onClick={() => toggleLabel(label.id)}
                        style={{ backgroundColor: label.color }}
                        className={styles.miniPill}
                      />
                      <span onClick={() => toggleLabel(label.id)} style={{ cursor: 'pointer', flex: 1 }}>
                        {label.text}
                      </span>
                      <button onClick={() => onDeleteGlobalLabel(label.id)}>🗑️</button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <div className={styles.metaDataGrid}>
              <div className={styles.metaItem}>
                <h4>Vencimiento</h4>
                <input 
                  type="date" 
                  className={styles.dateInput}
                  value={task.dueDate || ''} 
                  onChange={handleDateChange}
                />
              </div>

              <div className={styles.metaItem}>
                <h4>Prioridad</h4>
                <div className={styles.pillsContainer}>
                  {priorities.map((p) => (
                    <button
                      key={p.value}
                      type="button"
                      className={`${styles.priorityPill} ${styles[p.value]} ${task.priority === p.value ? styles.active : ''}`}
                      onClick={() => handlePrioritySelect(p.value)}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <section className={styles.section}>
              <h3>📌 Descripción Corta</h3>
              <input 
                type="text"
                className={styles.shortDescriptionInput}
                placeholder="Resumen breve..."
                defaultValue={task.description || ''}
                onBlur={handleShortDescriptionBlur}
              />
            </section>

            <section className={styles.section}>
              <h3>📝 Descripción Completa</h3>
              <textarea 
                className={styles.textarea} 
                placeholder="Añade detalle..."
                defaultValue={task.detailedDescription || ''}
                onBlur={handleDescriptionBlur}
              />
            </section>
          </main>

          <aside className={styles.sidebar}>
            <h4>Sugerencias</h4>
            <button className={styles.sidebarBtn} onClick={() => setIsLabelMenuOpen(!isLabelMenuOpen)}>🏷️ Etiquetas</button>
            
            {!isConfirmingDelete ? (
              <button className={`${styles.sidebarBtn} ${styles.dangerBtn}`} onClick={() => setIsConfirmingDelete(true)}>
                🗑️ Eliminar Tarjeta
              </button>
            ) : (
              <div className={styles.confirmDeleteWrapper}>
                <p>¿Seguro?</p>
                <div className={styles.confirmActions}>
                  <button className={styles.deleteConfirmBtn} onClick={handleConfirmDelete}>Sí</button>
                  <button className={styles.cancelConfirmBtn} onClick={() => setIsConfirmingDelete(false)}>No</button>
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
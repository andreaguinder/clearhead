'use client';

import { useState } from 'react';
import { StatusId, Task, Label } from '@/types/board';
import LabelManager from '@/components/Labels/LabelManager';
import PrioritySelector from '@/components/Priority/PrioritySelector';
import { Trash2, Check, X } from 'lucide-react';
import styles from './TaskDetailModal.module.scss';
import  Button  from "../Button/Button";

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

  const handleTitleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
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
  
           <div className={styles.headerInputGroup}>
  <textarea 
    className={styles.titleInput} 
    placeholder="Dale un título a esta tarjeta..."
    defaultValue={task.title}
    rows={1} // Arranca midiendo una sola línea
    onBlur={handleTitleBlur}
    onKeyDown={(e) => {
      // Si el usuario aprieta Enter, evita el salto de línea manual y guarda (opcional)
      if (e.key === 'Enter') {
        e.preventDefault();
        e.currentTarget.blur();
      }
    }}
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
                      >×</button>
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
  <PrioritySelector 
    selectedPriority={task.priority} 
    onSelect={(val) => onUpdateTask({ ...task, priority: val })} 
  />
</div></div>

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

            
{!isConfirmingDelete ? (
  <Button 
    // Usamos el secundario para mantener el hover oscuro base
    variant="secondary" 
    // ¡TUS CLASES! Que tienen el color rojo, márgenes, etc.
    className={`${styles.sidebarBtn} ${styles.dangerBtn}`} 
    onClick={() => setIsConfirmingDelete(true)}
  >
    <Trash2 size={16} className="mr-2" />
    <span>Eliminar Tarjeta</span>
  </Button>
) : (
  <div className={styles.confirmDeleteWrapper}>
    <p>¿Seguro?</p>
    <div className={styles.confirmActions}>
      <Button 
        variant="secondary" 
        className={styles.deleteConfirmBtn} // ¡TU CLASE! (Seguro es roja)
        onClick={handleConfirmDelete}
      >
        <Check size={16} className="mr-1" />
        Sí
      </Button>
      
      <Button 
        variant="ghost" // Usamos ghost que seguro es el que ya usabas antes
        className={styles.cancelConfirmBtn} // ¡TU CLASE!
        onClick={() => setIsConfirmingDelete(false)}
      >
        <X size={16} className="mr-1" />
        No
      </Button>
    </div>
  </div>
)}
          </aside>
        </div>
      </div>
    </div>
  );
}
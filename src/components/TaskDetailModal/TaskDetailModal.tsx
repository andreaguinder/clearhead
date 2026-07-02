'use client';

import { useState } from 'react';
import { StatusId, Task, Label, Member } from '@/types/board'; 
import { Trash2, Check, X, Wrench } from 'lucide-react';
import TaskCheckList from '../TaskCheckList/TaskCheckList';
import Button from "../Button/Button";
import styles from './TaskDetailModal.module.scss';

// Subcomponentes modulares
import TaskHeader from './components/TaskHeader';
import TaskLabels from './components/TaskLabels';
import TaskMeta from './components/TaskMeta';
import TaskDescription from './components/TaskDescription';
import TaskComments from './components/TaskComments';

import { MemberSelector } from '@/components/MemberSelector/MemberSelector'; 

interface TaskDetailModalProps {
  task: Task;
  onClose: () => void;
  onUpdateTask: (updatedTask: Task) => void;
  columnNames: Record<string, string>;
  onDeleteTask: (taskId: string, columnId: StatusId) => void;
  globalLabels: Record<string, Label>;
  onSaveGlobalLabel: (label: Label) => void;
  onDeleteGlobalLabel: (labelId: string) => void;
  members: Member[]; 
  // 1. Cambiamos la firma para que reciba el array completo de IDs seleccionados
  onAssignMembers: (taskId: string, memberIds: string[]) => void; 
}

export default function TaskDetailModal({
  task,
  onClose,
  onUpdateTask,
  onDeleteTask,
  columnNames,
  globalLabels,
  onSaveGlobalLabel,
  onDeleteGlobalLabel,
  members, 
  onAssignMembers // 🚀 Recibimos la nueva función estructurada
}: TaskDetailModalProps) {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  // 2. Forzamos el tipado seguro para manejar la transición de string a array en Firestore
  const currentAssignedIds = Array.isArray(task.assignedTo) 
    ? task.assignedTo 
    : task.assignedTo ? [task.assignedTo] : [];

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        
        {/* 1. HEADER (Título y Columna) */}
        <TaskHeader 
          title={task.title} 
          columnName={columnNames[task.status] || task.status} 
          onUpdateTitle={(newTitle) => onUpdateTask({ ...task, title: newTitle })}
          onClose={onClose}
        />

        <div className={styles.modalBody}>
          <main className={styles.mainContent}>
            
            {/* 2. ETIQUETAS */}
            <TaskLabels 
              taskLabelIds={task.labelIds || []}
              globalLabels={globalLabels}
              onUpdateLabels={(newLabelIds) => onUpdateTask({ ...task, labelIds: newLabelIds })}
              onSaveGlobalLabel={onSaveGlobalLabel}
              onDeleteGlobalLabel={onDeleteGlobalLabel}
            />

            {/* 3. METADATA GRID (Vencimiento, Prioridad) */}
            <TaskMeta 
              dueDate={task.dueDate || ''}
              priority={task.priority}
              onUpdateMeta={(fields) => onUpdateTask({ ...task, ...fields })}
            />

            {/* 4. DESCRIPCIONES */}
            <TaskDescription 
              shortDescription={task.description || ''}
              detailedDescription={task.detailedDescription || ''}
              onUpdateDescription={(fields) => onUpdateTask({ ...task, ...fields })}
            />

            {/* 5. CHECKLIST */}
            <TaskCheckList
              items={task.checklist || []}
              onUpdateChecklist={(updatedItems) => onUpdateTask({ ...task, checklist: updatedItems })}
            />

            {/* Botón de Acciones dentro de la sección principal */}
            <h3>
              <Wrench size={16} className={styles.headerIcon} style={{ marginTop: '20px', marginRight: '10px', color: 'var(--text-muted, #666)' }}/>
              Acciones
            </h3>
            
            <div className={styles.eliminarTarjeta}>
              {!isConfirmingDelete ? (
                <Button
                  variant="secondary"
                  className={`${styles.sidebarBtn} ${styles.dangerBtn}`}
                  onClick={() => setIsConfirmingDelete(true)}
                >
                  <span>Eliminar Tarjeta</span>
                  <Trash2 size={16} style={{ marginLeft: '8px' }} />
                </Button>
              ) : (
                <div className={styles.confirmDeleteWrapper}>
                  <div className={styles.confirmActions}>
                    <Button
                      variant="secondary"
                      className={styles.deleteConfirmBtn}
                      onClick={() => onDeleteTask(task.id, task.status)}
                    >
                      <Check size={16} className="mr-1" /> Sí
                    </Button>
                    <Button
                      variant="ghost"
                      className={styles.cancelConfirmBtn}
                      onClick={() => setIsConfirmingDelete(false)}
                    >
                      <X size={16} className="mr-1" /> No
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </main>

          {/* SIDEBAR DE ACCIONES COLABORATIVAS */}
          <aside className={styles.sidebar}>
            {/* 🚀 Selector de Miembros Corregido */}
            <MemberSelector
              members={members} // Usamos la prop real del componente
              currentAssignedIds={currentAssignedIds} 
              onAssign={(updatedIds) => {
                // Actualiza el estado local de la tarea de inmediato
                onUpdateTask({ ...task, assignedTo: updatedIds });
                // Dispara el guardado en la base de datos remota
                onAssignMembers(task.id, updatedIds);
              }}
              variant="sidebar"
            />

            {/* 💬 Sección unificada de comentarios */}
            <TaskComments
              task={task}
              onUpdateComments={(updatedComments) => onUpdateTask({ ...task, comments: updatedComments })}
            />
          </aside>
        </div>
      </div>
    </div>
  );
}
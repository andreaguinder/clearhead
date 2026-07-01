'use client';

import { useState, useRef, useEffect } from 'react';
import { Column as ColumnType, Task, Label, Member } from '@/types/board'; // 🚀 Importamos Member
import TaskCard from '../TaskCard/TaskCard';
import ActionButton from '../ActionButton/ActionButton';
import styles from './Column.module.scss';

interface ColumnProps {
  column: ColumnType;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onAddTaskClick: () => void;
  onUpdateColumnTitle: (columnId: string, newTitle: string) => void;
  globalLabels: Record<string, Label>;
  members: Member[]; // 🚀 Agregado a la interfaz
  onAssignMember: (taskId: string, memberId: string) => void; // 🚀 Agregado a la interfaz
}

export default function Column({ 
  column, 
  tasks, 
  onTaskClick, 
  onAddTaskClick, 
  onUpdateColumnTitle,
  globalLabels,
  members, // 🚀 Recibimos los miembros
  onAssignMember // 🚀 Recibimos la función asignadora
}: ColumnProps) {
  
  const [isEditing, setIsEditing] = useState(false);
  const [localTitle, setLocalTitle] = useState(column.title);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sincroniza el estado local si el título cambia de forma externa
  useEffect(() => {
    setLocalTitle(column.title);
  }, [column.title]);

  // Hace foco automático y selecciona el texto completo para facilitar la edición
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    // Si dejó texto válido y mutó, disparamos la actualización al padre
    if (localTitle.trim() && localTitle.trim() !== column.title) {
      onUpdateColumnTitle(column.id, localTitle.trim());
    } else {
      setLocalTitle(column.title); // Revierte el input si lo dejó vacío o sin cambios
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      inputRef.current?.blur(); // Provoca el blur automático al meter Enter
    }
    if (e.key === 'Escape') {
      setLocalTitle(column.title); // Revierte y cierra
      setIsEditing(false);
    }
  };

  return (
    <section className={styles.columnCard}>
      <div className={styles.columnHeader}>
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            className={styles.columnTitleInput}
            value={localTitle}
            onChange={(e) => setLocalTitle(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            maxLength={25}
          />
        ) : (
          <h2 
            className={styles.columnTitle} 
            onClick={() => setIsEditing(true)}
          >
            {column.title}
          </h2>
        )}
      </div>
      
      <div className={styles.tasksList}>
        {tasks.map((task) => (
          // Protegemos el renderizado: si el título está vacío (tarea en creación), no la mostramos en el tablero de fondo todavía
          task.title && (
            <TaskCard 
              key={task.id} 
              task={task} 
              globalLabels={globalLabels}
              onClick={() => onTaskClick(task)} 
              members={members} // 🚀 Pasamos los miembros abajo a la tarjeta
            />
          )
        ))}
      </div>

      <div className={styles.buttonWrapper}>
        {/* Conectamos el ActionButton a la función de creación */}
        <ActionButton type="task" onClick={onAddTaskClick} />
      </div>
    </section>
  );
}
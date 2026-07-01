'use client';

import { useState, useRef, useEffect } from 'react';
import { Column as ColumnType, Task, Label, Member } from '@/types/board'; 
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
  members: Member[]; 
  onAssignMembers: (taskId: string, memberIds: string[]) => void; // 🚀 Modificado a plural y firma de array
}

export default function Column({ 
  column, 
  tasks, 
  onTaskClick, 
  onAddTaskClick, 
  onUpdateColumnTitle,
  globalLabels,
  members, 
  onAssignMembers 
}: ColumnProps) {
  
  const [isEditing, setIsEditing] = useState(false);
  const [localTitle, setLocalTitle] = useState(column.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalTitle(column.title);
  }, [column.title]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    if (localTitle.trim() && localTitle.trim() !== column.title) {
      onUpdateColumnTitle(column.id, localTitle.trim());
    } else {
      setLocalTitle(column.title); 
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      inputRef.current?.blur(); 
    }
    if (e.key === 'Escape') {
      setLocalTitle(column.title); 
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
          task.title && (
            <TaskCard 
              key={task.id} 
              task={task} 
              globalLabels={globalLabels}
              onClick={() => onTaskClick(task)} 
              members={members} 
            />
          )
        ))}
      </div>

      <div className={styles.buttonWrapper}>
        <ActionButton type="task" onClick={onAddTaskClick} />
      </div>
    </section>
  );
}
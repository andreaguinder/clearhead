"use client";

import { useState } from 'react';
import { initialBoardData } from '@/data/mockData';
import { Task } from '@/types/board'; // 👈 Importamos el tipo Task
import Column from '@/components/Column/Column';
import ActionButton from '@/components/ActionButton/ActionButton';
import TaskDetailModal from '@/components/TaskDetailModal/TaskDetailModal'; // 👈 Importamos el Modal
import styles from './page.module.scss';

export default function Home() {
  const [boardData, setBoardData] = useState(initialBoardData);
  
  // 👈 Estado para controlar qué tarea se está editando en el modal
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const handleAddColumn = () => {
    console.log('Añadir nueva columna');
  };

  return (
    <main className={styles.mainContainer}>
      <h1 className={styles.boardTitle}>ClearHead</h1>
      
      <div className={styles.boardWrapper}>
        {boardData.columnOrder.map((columnId) => {
          const column = boardData.columns[columnId];
          const tasks = column.taskIds.map((taskId) => boardData.tasks[taskId]);

          return (
            <Column 
              key={column.id} 
              column={column} 
              tasks={tasks} 
              onTaskClick={(task) => setActiveTask(task)} // 👈 Al hacer click, activa la tarea
            />
          );
        })}

        <ActionButton type="column" onClick={handleAddColumn} />
      </div>

      {/* 👈 Si hay una tarea activa, mostramos el modal flotando */}
      {activeTask && (
        <TaskDetailModal 
          task={activeTask} 
          onClose={() => setActiveTask(null)} // 👈 Al cerrar, resetea a null
        />
      )}
    </main>
  );
}
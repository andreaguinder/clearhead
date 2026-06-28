"use client";

import { useState } from 'react';
import { initialBoardData } from '@/data/mockData';
import { Task, StatusId } from '@/types/board';
import Column from '@/components/Column/Column';
import ActionButton from '@/components/ActionButton/ActionButton';
import TaskDetailModal from '@/components/TaskDetailModal/TaskDetailModal';
import styles from './page.module.scss';

export default function Home() {
  const [boardData, setBoardData] = useState(initialBoardData);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const handleAddColumn = () => {
    console.log('Añadir nueva columna');
  };

  // 👈 NUEVO: Prepara una tarea vacía y abre el modal
  const handleOpenCreateTaskModal = (columnId: StatusId) => {
    const newTaskId = `task-${Date.now()}`; // Generamos un ID único basado en el tiempo
    
    const blankTask: Task = {
      id: newTaskId,
      title: '', // Arranca vacío para que el usuario lo escriba
      description: '',
      detailedDescription: '',
      status: columnId, // Se asigna automáticamente a la columna donde se hizo click
      priority: 'normal', // Prioridad por defecto en español
      createdAt: new Date().toISOString().split('T')[0], // Fecha de hoy
    };

    setActiveTask(blankTask);
  };

  // 👈 ACTUALIZADO: Maneja tanto la edición como la creación de una tarjeta nueva
  const handleUpdateTask = (updatedTask: Task) => {
    setBoardData((prevData) => {
      const isNewTask = !prevData.tasks[updatedTask.id];
      const columnId = updatedTask.status;

      // 1. Clonamos y actualizamos el objeto de tareas
      const newTasks = {
        ...prevData.tasks,
        [updatedTask.id]: updatedTask,
      };

      // 2. Si es una tarea nueva, tenemos que meter su ID adentro de la columna correspondiente
      let newColumns = { ...prevData.columns };
      if (isNewTask) {
        newColumns[columnId] = {
          ...prevData.columns[columnId],
          taskIds: [...prevData.columns[columnId].taskIds, updatedTask.id],
        };
      }

      return {
        ...prevData,
        tasks: newTasks,
        columns: newColumns,
      };
    });

    setActiveTask(updatedTask);
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
              onTaskClick={(task) => setActiveTask(task)}
              onAddTaskClick={() => handleOpenCreateTaskModal(column.id)} // 👈 Pasamos la nueva función
            />
          );
        })}

        <ActionButton type="column" onClick={handleAddColumn} />
      </div>

      {activeTask && (
        <TaskDetailModal 
          task={activeTask} 
          onClose={() => setActiveTask(null)}
          onUpdateTask={handleUpdateTask}
        />
      )}
    </main>
  );
}
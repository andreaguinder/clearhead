"use client"; // Clave para poder usar el useState más adelante

import { useState } from 'react';
import { initialBoardData } from '@/data/mockData';
import styles from './page.module.scss'; // Importamos nuestro SASS Module

export default function Home() {
  // Inicializamos el estado del tablero con nuestros datos de prueba
  const [boardData, setBoardData] = useState(initialBoardData);

  return (
    <main className={styles.mainContainer}>
      <h1 className={styles.boardTitle}>ClearHead</h1>
      
      {/* Contenedor de las columnas */}
      <div className={styles.boardWrapper}>
        {boardData.columnOrder.map((columnId) => {
          const column = boardData.columns[columnId];
          // Obtenemos las tareas correspondientes a esta columna usando sus IDs
          const tasks = column.taskIds.map((taskId) => boardData.tasks[taskId]);

          return (
            <section key={column.id} className={styles.columnCard}>
              <h2 className={styles.columnTitle}>{column.title}</h2>
              
              {/* Contenedor de las tarjetas dentro de la columna */}
              <div className={styles.tasksList}>
                {tasks.map((task) => (
                  <article key={task.id} className={styles.taskCard}>
                    <h3>{task.title}</h3>
                    {task.description && <p>{task.description}</p>}
                    <span className={`${styles.priorityBadge} ${styles[task.priority]}`}>
                      {task.priority}
                    </span>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
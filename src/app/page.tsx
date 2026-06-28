'use client';

import { useState, useEffect } from 'react';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { initialBoardData } from '@/data/mockData';
import { Task, StatusId, BoardData } from '@/types/board';
import Column from '@/components/Column/Column';
import ActionButton from '@/components/ActionButton/ActionButton';
import TaskDetailModal from '@/components/TaskDetailModal/TaskDetailModal';
import styles from './page.module.scss';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [boardData, setBoardData] = useState<BoardData>(initialBoardData);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // 1. Escuchar el estado real de Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Funciones reales de Login / Logout con Firebase
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error al iniciar sesión con Google", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setActiveTask(null);
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
  };

  // 3. Controladores del Tablero (Tus funciones de las cards y columnas)
  const handleCreateColumn = (title: string) => {
    const newColumnId = `column-${Date.now()}` as StatusId;
    setBoardData((prev) => ({
      ...prev,
      columns: { ...prev.columns, [newColumnId]: { id: newColumnId, title, taskIds: [] } },
      columnOrder: [...prev.columnOrder, newColumnId],
    }));
  };

  const handleOpenCreateTaskModal = (columnId: StatusId) => {
    const newTaskId = `task-${Date.now()}`;
    setActiveTask({
      id: newTaskId, title: '', description: '', detailedDescription: '',
      status: columnId, priority: 'normal', createdAt: new Date().toISOString().split('T')[0],
    });
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setBoardData((prev) => {
      const isNew = !prev.tasks[updatedTask.id];
      const newTasks = { ...prev.tasks, [updatedTask.id]: updatedTask };
      let newColumns = { ...prev.columns };
      if (isNew) {
        newColumns[updatedTask.status] = {
          ...prev.columns[updatedTask.status],
          taskIds: [...prev.columns[updatedTask.status].taskIds, updatedTask.id],
        };
      }
      return { ...prev, tasks: newTasks, columns: newColumns };
    });
    setActiveTask(updatedTask);
  };

  const handleDeleteTask = (taskId: string, columnId: StatusId) => {
    setBoardData((prev) => {
      const newTasks = { ...prev.tasks };
      delete newTasks[taskId];
      return {
        ...prev,
        tasks: newTasks,
        columns: { 
          ...prev.columns, 
          [columnId]: { ...prev.columns[columnId], taskIds: prev.columns[columnId].taskIds.filter(id => id !== taskId) } 
        }
      };
    });
    setActiveTask(null);
  };

  // Mientras Firebase verifica si hay sesión, mostramos un loader limpio
  if (authLoading) {
    return (
      <main className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <h2 style={{ color: '#fff' }}>Cargando ClearHead...</h2>
        </div>
      </main>
    );
  }

  // VISTA DE LOGIN: Si no hay usuario real en Firebase, mostramos la tarjeta
  if (!user) {
    return (
      <main className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <h1 className={styles.title}>🧠 ClearHead</h1>
          <p className={styles.subtitle}>Organizá tus ideas de manera limpia y eficiente.</p>
          
          <button className={styles.loginBtn} onClick={handleLogin}>
            <svg className={styles.googleIcon} viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
            <span>Iniciar sesión con Google</span>
          </button>
        </div>
      </main>
    );
  }

  // VISTA DEL TABLERO COMPLETO: Si está logueado, recuperamos tu panel original
  return (
    <main className={styles.appContainer}>
      <header className={styles.header}>
        <div className={styles.userInfo}>
          {user.photoURL && <img src={user.photoURL} alt="Avatar" className={styles.avatar} />}
          <h2>¡Hola, {user.displayName || 'Andy'}! 👋</h2>
        </div>
        <button className={styles.logoutBtn} onClick={handleLogout}>Cerrar sesión</button>
      </header>

      <div className={styles.boardWrapper}>
        {boardData.columnOrder.map((columnId) => {
          const column = boardData.columns[columnId];
          const tasks = column?.taskIds.map((taskId) => boardData.tasks[taskId]) || [];

          return (
            <Column 
              key={column.id} 
              column={column} 
              tasks={tasks} 
              onTaskClick={(task) => setActiveTask(task)}
              onAddTaskClick={() => handleOpenCreateTaskModal(column.id)}
            />
          );
        })}

        <ActionButton type="column" onCreate={handleCreateColumn} />
      </div>

      {activeTask && (
        <TaskDetailModal 
          task={activeTask} 
          onClose={() => setActiveTask(null)}
          onUpdateTask={handleUpdateTask}
          columnNames={Object.keys(boardData.columns).reduce((acc, id) => {
            acc[id] = boardData.columns[id as StatusId].title;
            return acc;
          }, {} as Record<string, string>)}
          onDeleteTask={handleDeleteTask}
        />
      )}
    </main>
  );
}
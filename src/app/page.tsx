'use client';

import { useState, useEffect } from 'react';
import { signOut, onAuthStateChanged, User, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { getBoardData, saveBoardData } from '@/lib/boardService'; 
import { initialBoardData } from '@/data/mockData';
import { Task, StatusId, BoardData, Label } from '@/types/board';
import Column from '@/components/Column/Column';
import ActionButton from '@/components/ActionButton/ActionButton';
import TaskDetailModal from '@/components/TaskDetailModal/TaskDetailModal';
import Header from '@/components/Header/Header';
import styles from './page.module.scss';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [boardData, setBoardData] = useState<BoardData>(initialBoardData);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true); 
  const globalLabels = boardData.labels || {};

  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // 1. Escuchar el estado real de Firebase Auth y cargar la data remota
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Traemos el tablero real del usuario de la nube
        const savedBoard = await getBoardData(currentUser.uid);
        if (savedBoard) {
          // Aseguramos que si el tablero guardado no tiene el nodo labels, se inicialice vacío
          setBoardData({
            labels: {},
            ...savedBoard
          } as unknown as BoardData);
        } else {
          // Si es un usuario nuevo sin datos, le asignamos tus datos mock iniciales
          setBoardData(initialBoardData);
        }
      } else {
        // Al desloguear limpiamos el tablero
        setBoardData(initialBoardData);
      }
      
      setAuthLoading(false);
      // Apagamos la carga inicial para dar luz verde al auto-guardado remoto
      setIsInitialLoad(false);
    });
    
    return () => unsubscribe();
  }, []);

  // Mecanismo de Guardado Automático con Debounce (1.5 segundos)
  useEffect(() => {
    if (!user || isInitialLoad) return;

    const timer = setTimeout(() => {
      saveBoardData(user.uid, boardData as any);
    }, 1500);

    return () => clearTimeout(timer);
  }, [boardData, user, isInitialLoad]);

  // Controlar el cambio de tema en el elemento HTML raíz
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Funciones reales de Login / Logout con Firebase
  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      // Forzar la selección de cuenta para evitar que extensiones interfieran con sesiones automáticas
      provider.setCustomParameters({ prompt: 'select_account' });
      
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  };

  const handleLogout = async () => {
    try {
      setIsInitialLoad(true); // Bloqueamos el auto-guardado antes de limpiar el estado
      await signOut(auth);
      setActiveTask(null);
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
  };

  // Controladores del Tablero
  const handleCreateColumn = (title: string) => {
    const newColumnId = `column-${Date.now()}` as StatusId;
    setBoardData((prev) => ({
      ...prev,
      columns: { ...prev.columns, [newColumnId]: { id: newColumnId, title, taskIds: [] } },
      columnOrder: [...prev.columnOrder, newColumnId],
    }));
  };

  const handleUpdateColumnTitle = (columnId: StatusId, newTitle: string) => {
    setBoardData((prev) => ({
      ...prev,
      columns: {
        ...prev.columns,
        [columnId]: { ...prev.columns[columnId], title: newTitle }
      }
    }));
  };

  const handleOpenCreateTaskModal = (columnId: StatusId) => {
    const newTaskId = `task-${Date.now()}`;
    setActiveTask({
      id: newTaskId,
      title: '',
      description: '',
      detailedDescription: '',
      status: columnId,
      priority: 'normal' as any, 
      createdAt: new Date().toISOString().split('T')[0],
      labelIds: [], 
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
        withData: true,
        tasks: newTasks,
        columns: { 
          ...prev.columns, 
          [columnId]: { ...prev.columns[columnId], taskIds: prev.columns[columnId].taskIds.filter(id => id !== taskId) } 
        }
      };
    });
    setActiveTask(null);
  };

  // Manejadores para crear/editar y borrar etiquetas del panel global
  const handleSaveGlobalLabel = (label: Label) => {
    setBoardData((prev) => ({
      ...prev,
      labels: {
        ...(prev.labels || {}),
        [label.id]: label,
      },
    }));
  };

  const handleDeleteGlobalLabel = (labelId: string) => {
    setBoardData((prev) => {
      const updatedLabels = { ...(prev.labels || {}) };
      delete updatedLabels[labelId];

      const updatedTasks = { ...prev.tasks };
      Object.keys(updatedTasks).forEach((taskId) => {
        updatedTasks[taskId] = {
          ...updatedTasks[taskId],
          labelIds: (updatedTasks[taskId].labelIds || []).filter((id) => id !== labelId),
        };
      });

      return {
        ...prev,
        labels: updatedLabels,
        tasks: updatedTasks,
      };
    });
  };

  // Mientras Firebase verifica si hay sesión, mostramos un loader limpio
  if (authLoading) {
    return (
      <main className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <h2 style={{ color: '#fff' }}><span className={styles.loadingText}></span><span className={styles.logoText}>ClearHead<span className={styles.logoClearHead}></span></span></h2>
        </div>
      </main>
    );
  }

  // Si no hay usuario real en Firebase, mostramos la tarjeta
  if (!user) {
    return (
      <main className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <h1 className={styles.title}>ClearHead<span className={styles.logoClearHead}></span></h1>
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

  // Si está logueado, panel original
  return (
    <div className={styles.appContainer}>
      <Header 
        user={user} 
        theme={theme} 
        onToggleTheme={toggleTheme} 
        onLogout={handleLogout} 
      />

      <main className={styles.mainContainer}>
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
                onUpdateColumnTitle={(columnId, newTitle) => handleUpdateColumnTitle(columnId as StatusId, newTitle)}
                globalLabels={globalLabels} 
              />
            );
          })}

          <ActionButton type="column" onCreate={handleCreateColumn} />
        </div>
      </main>

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
          globalLabels={boardData.labels || {}}
          onSaveGlobalLabel={handleSaveGlobalLabel}
          onDeleteGlobalLabel={handleDeleteGlobalLabel} 
        />
      )}
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext'; 
import { getBoardData, saveBoardData } from '@/lib/boardService'; 
import { initialBoardData } from '@/data/mockData';
import { Task, StatusId, BoardData, Label, Member } from '@/types/board'; 
import Column from '@/components/Column/Column';
import ActionButton from '@/components/ActionButton/ActionButton';
import TaskDetailModal from '@/components/TaskDetailModal/TaskDetailModal';
import Header from '@/components/Header/Header';
import ShareBoardModal from '@/components/ShareBoardModal/ShareBoardModal';
import { MembersNavbar } from '@/components/MembersNavbar/MembersNavbar'; 
import { useParams, useRouter } from 'next/navigation'; // 🚀 Agregamos useRouter para redirigir
import styles from './page.module.scss';

// 👥 Data simulada compatible con tu interfaz central para verificar render y filtros
const mockMembers: Member[] = [
  { uid: 'owner-id', name: 'Andy (Vos)', email: 'andreabelen.guinder@gmail.com' },
  { uid: 'seba-id', name: 'Seba', email: 'seba@test.com' }
];

export default function Home() {
  const params = useParams(); 
  const router = useRouter(); // 🚀 Para control de redirecciones
  const boardId = params.boardId as string; // 🎯 ID dinámico del tablero actual

  const { user, authLoading, logout } = useAuth(); // 🧼 Limpiamos loginWithGoogle de acá
  
  const [boardData, setBoardData] = useState<BoardData>(initialBoardData);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true); 
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [memberFilters, setMemberFilters] = useState<string[]>([]);
  
  const globalLabels = boardData.labels || {};

  // 🛡️ Seguridad: Si el usuario no está logueado, rebota al Login principal (raíz)
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  // 1. Escuchar los cambios del boardId de la URL para cargar su tablero remoto
  useEffect(() => {
    async function loadData() {
      if (!boardId) return;

      setIsInitialLoad(true); // Reseteamos bandera de carga al cambiar de tablero
      
      // 🚀 CAMBIO CLAVE: Buscamos por boardId de la URL, no por user.uid
      const savedBoard = await getBoardData(boardId);
      if (savedBoard) {
        setBoardData({
          labels: {},
          ...savedBoard
        } as unknown as BoardData);
      } else {
        setBoardData(initialBoardData);
      }
      setIsInitialLoad(false);
    }
    
    loadData();
  }, [boardId]); // Escucha si cambia el ID en la URL

  // 💾 Mecanismo de Guardado Automático con Debounce (1.5 segundos)
  useEffect(() => {
    if (!boardId || isInitialLoad) return;

    const timer = setTimeout(() => {
      // 🚀 CAMBIO CLAVE: Guarda los cambios usando el boardId de este espacio
      saveBoardData(boardId, boardData as any);
    }, 1500);

    return () => clearTimeout(timer);
  }, [boardData, boardId, isInitialLoad]);

  // 🎨 Controlar el cambio de tema en el elemento HTML raíz
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleLogout = async () => {
    try {
      setIsInitialLoad(true); 
      await logout();
      setActiveTask(null);
      router.push('/'); // Te manda a la pantalla de entrada
    } catch (error) {
      console.error("Error al cerrar sesión desde la página:", error);
    }
  };

  // 🛠️ Controladores del Tablero
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
      boardId: boardId, // 🚀 Ahora se asocia directamente al ID dinámico de la URL
      title: '',
      description: '',
      detailedDescription: '',
      status: columnId,
      priority: 'normal', 
      createdAt: new Date().toISOString().split('T')[0],
      labelIds: [], 
      assignedTo: [] 
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
    
    setActiveTask((prevActive) => (prevActive?.id === updatedTask.id ? updatedTask : prevActive));
  };

  const handleAssignMembers = (taskId: string, memberIds: string[]) => {
    if (!boardData.tasks[taskId]) return;
    
    setBoardData((prev) => {
      const updatedTasks = { ...prev.tasks };
      updatedTasks[taskId] = {
        ...updatedTasks[taskId],
        assignedTo: memberIds
      };
      return { ...prev, tasks: updatedTasks };
    });
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
      } as any;
    });
    setActiveTask(null);
  };

  const handleSaveGlobalLabel = (label: Label) => {
    setBoardData((prev) => ({
      ...prev,
      labels: { ...(prev.labels || {}), [label.id]: label },
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

      return { ...prev, labels: updatedLabels, tasks: updatedTasks };
    });
  };

  // Pantalla de carga limpia mientras verifica sesión o data inicial
  if (authLoading || isInitialLoad || !user) {
    return (
      <div className={styles.appContainer} style={{ justifyContent: 'center', alignItems: 'center', minHeight: '100vh', color: '#fff' }}>
        <p>Cargando datos del tablero...</p>
      </div>
    );
  }

  return (
    <div className={styles.appContainer}>
<Header 
  user={user} 
  theme={theme} 
  onToggleTheme={toggleTheme} 
  onLogout={handleLogout} 
  boardId={boardId} 
  // 🚀 Acá sí pasás la función, entonces el botón "Compartir" SÍ va a aparecer en el menú
  onOpenShareModal={() => {
    setIsShareModalOpen(true); // Tu estado real para abrir el modal, ¡sin alerts!
  }}
  onNavigateToWorkspaces={() => {
    router.push('/dashboard'); // Te saca del tablero y te devuelve a tus espacios de trabajo
  }}
/>

      <MembersNavbar 
        members={mockMembers} 
        currentFilters={memberFilters} 
        onFilterChange={(uid) => {
          if (uid === '') {
            setMemberFilters([]);
          } else {
            setMemberFilters(prev => 
              prev.includes(uid) ? prev.filter(id => id !== uid) : [...prev, uid]
            );
          }
        }} 
      />

      <main className={styles.mainContainer}>
        <div className={styles.boardWrapper}>
          {boardData.columnOrder.map((columnId) => {
            const column = boardData.columns[columnId];
            const rawTasks = column?.taskIds.map((taskId) => boardData.tasks[taskId]) || [];
            
            const filteredTasks = rawTasks.filter((task) => {
              if (!task) return false;
              if (memberFilters.length === 0) return true;
              
              const assignedIds = Array.isArray(task.assignedTo) 
                ? task.assignedTo 
                : task.assignedTo ? [task.assignedTo] : [];

              return assignedIds.some(id => memberFilters.includes(id));
            });

            return (
              <Column 
                key={column.id} 
                column={column} 
                tasks={filteredTasks} 
                onTaskClick={(task) => setActiveTask(task)}
                onAddTaskClick={() => handleOpenCreateTaskModal(column.id)}
                onUpdateColumnTitle={(columnId, newTitle) => handleUpdateColumnTitle(columnId as StatusId, newTitle)}
                globalLabels={globalLabels} 
                members={mockMembers} 
                onAssignMembers={handleAssignMembers} 
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
          members={mockMembers} 
          onAssignMembers={handleAssignMembers} 
        />
      )}

      {isShareModalOpen && user && (
        <ShareBoardModal 
          boardId={boardId} // 🚀 Pasa el boardId dinámico
          onClose={() => setIsShareModalOpen(false)} 
        />
      )}
    </div>
  );
}
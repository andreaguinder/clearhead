import { BoardData } from '@/types/board';

export const initialBoardData: BoardData = {
  tasks: {
    'task-1': {
      id: 'task-1',
      title: 'Diseñar la interfaz en Figma',
      description: 'Armar el wireframe del tablero con modo oscuro',
      status: 'todo',
      priority: 'medium',
      createdAt: '2026-06-28',
    },
    'task-2': {
      id: 'task-2',
      title: 'Configurar SASS Modules',
      description: 'Dejar listas las variables globales de estilos',
      status: 'in-progress',
      priority: 'high',
      createdAt: '2026-06-28',
    },
    'task-3': {
      id: 'task-3',
      title: 'Estructurar tipos de TypeScript',
      description: 'Definir interfaces para Task, Column y Board',
      status: 'done',
      priority: 'low',
      createdAt: '2026-06-28',
    },
  },
  columns: {
    'todo': {
      id: 'todo',
      title: 'Por Hacer',
      taskIds: ['task-1'],
    },
    'in-progress': {
      id: 'in-progress',
      title: 'En Progreso',
      taskIds: ['task-2'],
    },
    'done': {
      id: 'done',
      title: 'Terminado',
      taskIds: ['task-3'],
    },
  },
  columnOrder: ['todo', 'in-progress', 'done'],
};
import { BoardData } from '@/types/board';

export const initialBoardData: BoardData = {
  tasks: {
    'task-1': {
      id: 'task-1',
      title: 'Diseñar la interfaz en Figma',
      description: 'Armar el wireframe del tablero con modo oscuro',
      status: 'Por Hacer',
      priority: 'media',
      createdAt: '2026-06-28',
    },
    'task-2': {
      id: 'task-2',
      title: 'Configurar SASS Modules',
      description: 'Dejar listas las variables globales de estilos',
      status: 'En Progreso',
      priority: 'alta',
      createdAt: '2026-06-28',
    },
    'task-3': {
      id: 'task-3',
      title: 'Estructurar tipos de TypeScript',
      description: 'Definir interfaces para Task, Column y Board',
      status: 'Terminado',
      priority: 'baja',
      createdAt: '2026-06-28',
    },
  },
  columns: {
    'Por Hacer': {
      id: 'Por Hacer',
      title: 'Por Hacer',
      taskIds: ['task-1'],
    },
    'En Progreso': {
      id: 'En Progreso',
      title: 'En Progreso',
      taskIds: ['task-2'],
    },
    'Terminado': {
      id: 'Terminado',
      title: 'Terminado',
      taskIds: ['task-3'],
    },
  },
  columnOrder: ['Por Hacer', 'En Progreso', 'Terminado'],
};
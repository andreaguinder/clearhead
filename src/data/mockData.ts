import { BoardData } from '@/types/board';

export const initialBoardData: BoardData = {
  tasks: {
    'task-1': {
      id: 'task-1',
      title: 'Ir al supermercado',
      description: 'Comprar leche, pan y huevos',
      status: 'Por Hacer',
      priority: 'media',
      createdAt: '2026-06-28',
    },
    'task-2': {
      id: 'task-2',
      title: 'Estudiar para el exámen de matemáticas',
      description: 'Revisar álgebra y geometría',
      status: 'En Progreso',
      priority: 'alta',
      createdAt: '2026-06-28',
    },
    'task-3': {
      id: 'task-3',
      title: 'Limpiar la casa',
      description: 'Vaciar la basura y ordenar las habitaciones',
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
// 1. Definimos cuáles son los únicos estados válidos para nuestras columnas
export type StatusId = 'todo' | 'in-progress' | 'done';

// 2. Estructura de una tarea individual
export interface Task {
  id: string;
  title: string;
  description?: string; // El "?" significa que la descripción es opcional
  status: StatusId;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

// 3. Estructura de una columna del tablero
export interface Column {
  id: StatusId;
  title: string;
  taskIds: string[]; // Una lista de IDs de tareas para saber cuáles van acá y en qué orden
}

// 4. Estructura global de todo el tablero de Trello
export interface BoardData {
  tasks: Record<string, Task>; // Un objeto que guarda todas las tareas indexadas por su ID
  columns: Record<StatusId, Column>; // Un objeto que guarda las 3 columnas
  columnOrder: StatusId[]; // El orden en que se muestran las columnas en la pantalla
}
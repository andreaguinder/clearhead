export type StatusId = 'todo' | 'in-progress' | 'done';

// Definimos la estructura de un elemento dentro de la checklist
export interface ChecklistItem {
  id: string;
  text: string;
  isCompleted: boolean;
}

// Estructura de las etiquetas
export interface Label {
  id: string;
  text: string;
  color: string; // Guardaremos el código HEX del color
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  detailedDescription?: string; // 👈 Agregamos la descripción larga
  status: StatusId;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  dueDate?: string; // 👈 Opcional: Fecha de vencimiento (YYYY-MM-DD)
  checklist?: ChecklistItem[]; // 👈 Opcional: Array de subtareas
  labels?: Label[]; // 👈 Opcional: Array de etiquetas
}

export interface Column {
  id: StatusId;
  title: string;
  taskIds: string[];
}

export interface BoardData {
  tasks: Record<string, Task>;
  columns: Record<StatusId, Column>;
  columnOrder: StatusId[];
}
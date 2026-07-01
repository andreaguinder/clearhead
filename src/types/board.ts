export type StatusId = 'Por Hacer' | 'En Progreso' | 'Terminado';

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
  textColor: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  detailedDescription?: string;
  status: StatusId;
  priority: 'baja' | 'normal' | 'media' | 'alta';
  createdAt: string;
  dueDate?: string; 
  checklist?: ChecklistItem[]; 
  labelIds: string[]; 
  comments?: Comment[];
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
  labels: Record<string, Label>;
}

export interface Comment {
  id: string;
  text: string;
  userId: string;
  userName: string;
  userPhoto: string;
  createdAt: string; 
}
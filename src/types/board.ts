export type StatusId = 'Por Hacer' | 'En Progreso' | 'Terminado';

export interface ChecklistItem {
  id: string;
  text: string;
  isCompleted: boolean;
}

export interface Label {
  id: string;
  text: string;
  color: string; 
  textColor: string;
}

export interface Task {
  id: string;
  boardId: string; // 🚀 CLAVE: Cada tarea sabe a qué tablero pertenece
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
  assignedTo?: string[]; // Array de UIDs de los miembros asignados
}

export interface Column {
  id: StatusId;
  title: string;
  taskIds: string[];
}

// Esto es la DATA INTERNA de las columnas y tareas de UN tablero específico
export interface BoardData {
  tasks: Record<string, Task>;
  columns: Record<StatusId, Column>;
  columnOrder: StatusId[];
  labels: Record<string, Label>;
}

// 🚀 NUEVA INTERFAZ MAESTRA: Estructura global de un Tablero
export interface Board {
  id: string;          // ID único del tablero
  name: string;        // Ej: "Cosas Privadas" o "Proyecto Laburo"
  createdAt: string;
  ownerId: string;     // UID del usuario que creó el tablero (dueño)
  memberIds: string[]; // 🚀 Lista de UIDs de los usuarios invitados (si está vacío, es privado)
  data: BoardData;     // Acá adentro metemos las tareas, columnas y etiquetas de este tablero
}

export interface Comment {
  id: string;
  text: string;
  userId: string;
  userName: string;
  userPhoto: string;
  createdAt: string; 
}

export interface Member {
  uid: string;
  name: string;
  email: string;
  photoURL?: string;
}
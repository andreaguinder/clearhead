import { db } from "./firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

// Defino interfaces básicas para que TypeScript no chille. 
// Adaptalas si tus propiedades se llaman distinto (ej. si usás 'id' o 'tasks' en inglés/español)
interface Task {
  id: string;
  title: string;
  description?: string;
  priority: string;
}

interface Column {
  id: string;
  title: string;
  tasks: Task[]; // o la estructura exacta que manejes en tu estado
}

/**
 * Guarda el estado actual de las columnas del tablero asociadas al ID del usuario logueado.
 */
export const saveBoardData = async (userId: string, columns: Column[]) => {
  if (!userId) return;

  try {
    // Guardamos en la colección 'boards', usando el userId único como nombre del documento
    const boardRef = doc(db, "boards", userId);
    await setDoc(boardRef, {
      columns,
      updatedAt: new Date().toISOString(),
    }, { merge: true }); // 'merge: true' protege otros campos del documento por las dudas
    
    console.log("Tablero guardado en Firestore con éxito!");
  } catch (error) {
    console.error("Error al guardar el tablero en Firestore:", error);
  }
};

/**
 * Trae los datos del tablero del usuario desde Firestore si existen.
 */
export const getBoardData = async (userId: string): Promise<Column[] | null> => {
  if (!userId) return null;

  try {
    const boardRef = doc(db, "boards", userId);
    const boardSnap = await getDoc(boardRef);

    if (boardSnap.exists()) {
      const data = boardSnap.data();
      return data.columns as Column[];
    }
    
    return null; // Si el usuario es nuevo y no tiene tablero creado todavía
  } catch (error) {
    console.error("Error al obtener el tablero desde Firestore:", error);
    return null;
  }
};
import { db } from "./firebase";
import { doc, getDoc, setDoc, updateDoc, arrayUnion, collection, query, where, getDocs } from "firebase/firestore";

interface Task {
  id: string;
  title: string;
  description?: string;
  priority: string;
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

// Guarda el estado actual de las columnas del tablero asociadas al ID del usuario logueado.
export const saveBoardData = async (userId: string, columns: Column[]) => {
  if (!userId) return;

  try {
    // Guardamos en la colección 'boards', usando el userId único como nombre del documento
    const boardRef = doc(db, "boards", userId);
    await setDoc(boardRef, {
      columns,
      updatedAt: new Date().toISOString(),
    }, { merge: true });

    console.log("Tablero guardado en Firestore con éxito!");
  } catch (error) {
    console.error("Error al guardar el tablero en Firestore:", error);
  }
};

// Trae los datos del tablero del usuario desde Firestore si existen.
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

// Comparte el tablero por email y dispara la notificación real de Resend
export const shareBoardByEmail = async (boardId: string, emailToInvite: string) => {
  const cleanEmail = emailToInvite.trim().toLowerCase();
  
  try {
    // 1. Buscamos en la colección 'users' si el mail ya está registrado
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', cleanEmail));
    const querySnapshot = await getDocs(q);
    
    const boardRef = doc(db, 'boards', boardId);
    let messageResult = '';

    if (!querySnapshot.empty) {
      // 🌟 El usuario YA existe en nuestra base de datos
      const userDoc = querySnapshot.docs[0];
      const userUid = userDoc.id;

      // Lo sumamos al array 'allowedUsers' del tablero sin pisar los que ya están
      await updateDoc(boardRef, {
        allowedUsers: arrayUnion(userUid)
      });
      messageResult = '¡Usuario añadido al tablero y notificado por correo!';
    } else {
      // ✉️ El usuario no se registró nunca todavía
      // Lo guardamos en una lista de espera de emails invitados para el futuro
      await updateDoc(boardRef, {
        invitedEmails: arrayUnion(cleanEmail)
      });
      messageResult = 'Invitación enviada. Tendrá acceso cuando se registre.';
    }

    // 🚀 2. Mandamos el correo real llamando a nuestra API de Next.js
    await fetch('/api/send-invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: cleanEmail, boardId })
    });
    
    return { success: true, message: messageResult };

  } catch (error) {
    console.error("Error al compartir el tablero o mandar el mail:", error);
    throw new Error("No se pudo compartir el tablero.");
  }
};
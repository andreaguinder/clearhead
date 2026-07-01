// 📁 context/AuthContext.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  signOut, 
  onAuthStateChanged, 
  User, 
  signInWithRedirect, 
  signInWithPopup, 
  GoogleAuthProvider 
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  authLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // 👤 Función para guardar o actualizar al usuario en Firestore de forma colaborativa
  const syncUserToFirestore = async (currentUser: User) => {
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await setDoc(userRef, {
        uid: currentUser.uid,
        name: currentUser.displayName || 'Usuario Anónimo',
        email: currentUser.email,
        photo: currentUser.photoURL || '',
        lastLogin: new Date().toISOString()
      }, { merge: true }); // Usamos merge para no pisar tableros asignados u otros datos
    } catch (error) {
      console.error("Error sincronizando usuario en Firestore:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // 🔥 Cada vez que se loguea, lo registramos/actualizamos en la base de datos
        await syncUserToFirestore(currentUser);
      }
      
      setAuthLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      
      const isDevelopment = typeof window !== 'undefined' && window.location.hostname === 'localhost';
      
      if (isDevelopment) {
        await signInWithPopup(auth, provider);
      } else {
        await signInWithRedirect(auth, provider);
      }
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, authLoading, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom Hook para usar la sesión al toque en cualquier componente
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}
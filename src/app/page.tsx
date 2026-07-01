'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import styles from './page.module.scss'; // Usá el módulo de estilos que tenía el login original

export default function EntryPage() {
  const { user, authLoading, loginWithGoogle } = useAuth();
  const router = useRouter();

  // Si ya hay un usuario logueado, lo mandamos directo al Dashboard
  useEffect(() => {
    if (!authLoading && user) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
      // El useEffect de arriba se va a encargar de redirigir al dashboard en cuanto impacte el usuario
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  };

  if (authLoading) {
    return (
      <main className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <h2 style={{ color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className={styles.logoZylos}></span>
            <span className={styles.logoText}>Zylos</span>
          </h2>
        </div>
      </main>
    );
  }

  // Si no está logueado, mostramos la pantalla limpia de Login que tenías originalmente
  return (
    <main className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <h1 className={styles.title}><span className={styles.logoZylos}></span>Zylos</h1>
        <p className={styles.subtitle}>Organizá tus ideas de manera limpia y eficiente.</p>
        
        <button className={styles.loginBtn} onClick={handleLogin}>
          <svg className={styles.googleIcon} viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
          </svg>
          <span>Iniciar sesión con Google</span>
        </button>
      </div>
      <div className={styles.footer}>
        <h3>Desarrollado por <a href="https://andreaguinder.com/" target="_blank" rel="noopener noreferrer">Andrea Guinder</a></h3>
      </div>
    </main>
  );
}
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header/Header';
import styles from './page.module.scss';

// Tipado básico local para los metadatos de los tableros
interface BoardMetadata {
  id: string;
  title: string;
  updatedAt?: string;
  role?: 'owner' | 'member';
}

export default function Dashboard() {
  const { user, authLoading, logout } = useAuth();
  const router = useRouter();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Estado para la lista de tableros del usuario
  const [boards, setBoards] = useState<BoardMetadata[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');

  // Simulación de carga inicial de múltiples tableros para la UI
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/'); // Redirigir al login si no está autenticado
      return;
    }

    if (user) {
      // Mock inicial de tableros para ver cómo se renderiza la UI.
      // Más adelante acá mapearemos tu consulta de Firebase.
      setBoards([
        { id: user.uid, title: 'Mi Tablero Principal', updatedAt: 'Hoy', role: 'owner' },
        { id: 'estudio-guinder', title: 'Guinder Studio 🚀', updatedAt: 'Ayer', role: 'owner' },
        { id: 'proyecto-clase', title: 'Feedback Marzo 💻', updatedAt: '12 Jun', role: 'member' }
      ]);
    }
  }, [user, authLoading, router]);

  // Manejo del cambio de tema estético
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error("Error al cerrar sesión desde el dashboard:", error);
    }
  };

  const handleCreateBoard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBoardTitle.trim()) return;

    const newBoard: BoardMetadata = {
      id: `board-${Date.now()}`,
      title: newBoardTitle.trim(),
      updatedAt: 'Recién',
      role: 'owner'
    };

    setBoards((prev) => [...prev, newBoard]);
    setNewBoardTitle('');
    setIsCreateModalOpen(false);

    // Opcional: Redirigir directo al nuevo tablero creado
    // router.push(`/board/${newBoard.id}`);
  };

  if (authLoading || !user) {
    return (
      <div className={styles.dashboardContainer} style={{ justifyContent: 'center', alignItems: 'center' }}>
        <p>Cargando tus espacios de trabajo...</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      {/* Reutilización limpia de tu Header existente */}
      <Header
        user={user}
        theme={theme}
        onToggleTheme={toggleTheme}
        onLogout={handleLogout}
        boardId={user.uid}
      />

      <main className={styles.mainContent}>
        <section className={styles.welcomeSection}>
          <h1>¡Hola, {user.displayName || 'Andy'}!</h1>
          <p>Seleccioná un tablero para empezar a trabajar o creá uno nuevo.</p>
        </section>

        <div className={styles.grid}>
          {/* Mapeo dinámico de tableros */}
          {boards.map((board) => (
            <Link href={`/board/${board.id}`} key={board.id} className={styles.boardCard}>
              <h3>{board.title}</h3>
              <div className={styles.cardFooter}>
                <span className={styles.badge}>
                  {board.role === 'owner' ? 'Dueño' : 'Invitado'}
                </span>
                <span>{board.updatedAt}</span>
              </div>
            </Link>
          ))}

          {/* Tarjeta disparadora de creación de tableros */}
          <button className={styles.createCard} onClick={() => setIsCreateModalOpen(true)}>
            <div className={styles.plusIcon}>+</div>
            <span>Crear nuevo tablero</span>
          </button>
        </div>
      </main>

      {/* Modal de creación rápida en el Dashboard */}
      {isCreateModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsCreateModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2>Nuevo tablero</h2>
            <form onSubmit={handleCreateBoard}>
              <input
                type="text"
                placeholder="Nombre del tablero (ej: Tiendanube Farmacia)"
                value={newBoardTitle}
                onChange={(e) => setNewBoardTitle(e.target.value)}
                autoFocus
                maxLength={40}
              />
              <div className={styles.modalActions}>
                <button type="submit" className={styles.submitBtn} disabled={!newBoardTitle.trim()}>
                  Crear Tablero
                </button>
                <button type="button" className={styles.cancelBtn} onClick={() => setIsCreateModalOpen(false)}>
                  Cancelar
                </button>

              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
'use client';

import { useState } from 'react';
import { LogOut, Share2, Menu, X, Folder } from 'lucide-react';
import styles from './SidebarMenu.module.scss';

interface SidebarMenuProps {
  onLogout: () => Promise<void>;
  onOpenShare?: () => void; // 🚀 Modificado con "?" para que sea opcional
  onGoToWorkspaces: () => void; // Para volver a "Mis espacios de trabajo"
}

export default function SidebarMenu({ onLogout, onOpenShare, onGoToWorkspaces }: SidebarMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const handleAction = (callback: () => void) => {
    setIsOpen(false); // Cierra el menú al hacer clic en una opción
    callback();
  };

  return (
    <>
      {/* Botón Hamburguesa que va a quedar visible en el Header */}
      <button 
        className={styles.hamburgerBtn} 
        onClick={toggleMenu} 
        aria-label="Abrir menú"
      >
        <Menu size={24} />
      </button>

      {/* Backdrop (Fondo oscuro) */}
      <div 
        className={`${styles.backdrop} ${isOpen ? styles.backdropActive : ''}`} 
        onClick={toggleMenu}
      />

      {/* Contenedor del Menú Desplegable Lateral */}
      <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <span className={styles.logoText}>Zylos</span>
          <button className={styles.closeBtn} onClick={toggleMenu} aria-label="Cerrar menú">
            <X size={24} />
          </button>
        </div>

        <nav className={styles.menuList}>
          <button 
            className={styles.menuItem} 
            onClick={() => handleAction(onGoToWorkspaces)}
          >
            <Folder size={20} />
            <span>Mis espacios de trabajo</span>
          </button>

          {/* 🚀 Renderizado Condicional: Si onOpenShare existe, muestra el botón. Si es undefined, lo oculta por completo */}
          {onOpenShare && (
            <button 
              className={styles.menuItem} 
              onClick={() => handleAction(onOpenShare)}
            >
              <Share2 size={20} />
              <span>Compartir tablero</span>
            </button>
          )}

          <hr className={styles.divider} />

          <button 
            className={`${styles.menuItem} ${styles.logoutItem}`} 
            onClick={() => handleAction(onLogout)}
          >
            <LogOut size={20} />
            <span>Cerrar sesión</span>
          </button>
        </nav>
      </aside>
    </>
  );
}
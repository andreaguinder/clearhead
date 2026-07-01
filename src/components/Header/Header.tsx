'use client';

import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { Sun, Moon, LogOut } from 'lucide-react';
import Button from '../Button/Button';
import styles from './Header.module.scss';
import ShareBoardButton from '../ShareBoardButton/ShareBoardButton';

interface HeaderProps {
  user: User;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onLogout: () => void;
  boardId: string; // ID del tablero para compartir
}

export default function Header({ user, theme, onToggleTheme, onLogout, boardId }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.appInfo}>
        <div className={styles.appInfoTheme}>
          <h1>ClearHead</h1>
          <div className={styles.logoClearHead}></div>

          {/* El userInfo ahora contiene el avatar-botón y el dropdown que se usa SIEMPRE */}
          <div className={styles.userInfo}>
            {user.photoURL && (
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={styles.avatarButton}
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
              >
                <img src={user.photoURL} alt="Avatar" className={styles.avatar} />
              </button>
              
            )}

            {/* El menú flotante unificado */}
            {isMenuOpen && (
              <div className={styles.dropdownMenu}>
                <div className={styles.dropdownHeader}>
                  <p>{user.displayName}</p>
                </div>
                <hr className={styles.dropdownDivider} />
                <button onClick={onLogout} className={styles.dropdownLogout}>
                  <LogOut size={16} />
                  <span>Cerrar sesión</span>
                </button>
              </div>
            )}
          </div>
        <ShareBoardButton boardId={boardId} />
        </div>


        <Button variant="theme" onClick={onToggleTheme}>
          {theme === 'light' ? <Moon size={22} className="mr-2" /> : <Sun size={22} className="mr-2" />}
        </Button>
      </div>

    </header>
  );
}
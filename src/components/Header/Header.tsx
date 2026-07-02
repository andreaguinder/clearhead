'use client';

import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { Sun, Moon, LogOut } from 'lucide-react';
import Button from '../Button/Button';
import styles from './Header.module.scss';
import SidebarMenu from '../SidebarMenu/SidebarMenu';

interface HeaderProps {
  user: User;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onLogout: () => Promise<void>;
  onOpenShareModal?: () => void;
  onNavigateToWorkspaces: () => void;
  boardId: string; // ID del tablero para compartir
}

export default function Header({ user, theme, onToggleTheme, onLogout, onOpenShareModal, onNavigateToWorkspaces, boardId }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.appInfo}>
        <div className={styles.appInfoTheme}>
<SidebarMenu 
        onLogout={onLogout}
        onOpenShare={onOpenShareModal}
        onGoToWorkspaces={onNavigateToWorkspaces}
      />
          <div className={styles.logoZylos}></div>
          <h1>Zylos</h1>
          {/* El userInfo ahora contiene el avatar-botón y el dropdown que se usa SIEMPRE */}
          <div className={styles.userInfo}>
  {user.photoURL && (
    <img 
      src={user.photoURL} 
      alt={user.displayName || "Avatar"} 
      className={styles.avatar} 
    />
  )}
</div>
        </div>


        <Button variant="theme" onClick={onToggleTheme}>
          {theme === 'light' ? <Moon size={22} className="mr-2" /> : <Sun size={22} className="mr-2" />}
        </Button>
      </div>

    </header>
  );
}
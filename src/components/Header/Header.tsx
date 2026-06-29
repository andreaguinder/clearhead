// src/components/Header/Header.tsx
'use client';

import React from 'react';
import { User } from 'firebase/auth';
import Button from '../Button/Button';
import styles from './Header.module.scss';

interface HeaderProps {
  user: User;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onLogout: () => void;
}

export default function Header({ user, theme, onToggleTheme, onLogout }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.userInfo}>
        {user.photoURL && (
          <img src={user.photoURL} alt="Avatar" className={styles.avatar} />
        )}
        <h2>¡Hola, {user.displayName || 'Andy'}! 👋</h2>
      </div>

      <div className={styles.actions}>
        {/* Switch de cambio de Theme */}
        <Button variant="theme" onClick={onToggleTheme}>
          {theme === 'light' ? '🌙 Modo Oscuro' : '☀️ Modo Claro'}
        </Button>

        {/* Botón de cerrar sesión */}
        <Button variant="secondary" onClick={onLogout}>
          Cerrar sesión
        </Button>
      </div>
    </header>
  );
}
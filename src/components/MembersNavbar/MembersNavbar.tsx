'use client';

import React, { useState } from 'react';
import styles from './MembersNavbar.module.scss';
import { Member } from '@/types/board';
import { ChevronDown, Check, Users } from 'lucide-react'; // Necesitamos estos iconos para el look premium

interface MembersNavbarProps {
  members: Member[];
  currentFilter: string;
  onFilterChange: (uid: string) => void;
}

export const MembersNavbar: React.FC<MembersNavbarProps> = ({
  members,
  currentFilter,
  onFilterChange,
}) => {
  // Estado para controlar el menú flotante personalizado
  const [isOpen, setIsOpen] = useState(false);

  // Si solo estás vos, no se muestra
  if (members.length <= 1) return null;

  // Buscamos cuál es el miembro por el que se está filtrando actualmente
  const selectedMember = members.find((m) => m.uid === currentFilter);

  const handleSelect = (uid: string) => {
    onFilterChange(uid);
    setIsOpen(false); // Cierra el menú al seleccionar
  };

  // Helper para renderizar las iniciales/avatar dentro del botón y del dropdown de forma unificada
  const renderMiniAvatar = (member?: Member) => {
    if (!member) {
      return (
        <div className={styles.avatarCircle} style={{ backgroundColor: '#94a3b8' }}>
          <Users size={10} />
        </div>
      );
    }
    if (member.photoURL) {
      return <img src={member.photoURL} alt={member.name} className={styles.avatarCircle} />;
    }
    const initial = member.name ? member.name.charAt(0) : member.email.charAt(0);
    return <div className={styles.avatarCircle}>{initial.toUpperCase()}</div>;
  };

  return (
    <div className={styles.membersNavbar}>
      
      {/* 1. Lista de Avatares Rápidos (Izquierda) */}
      <div className={styles.membersList}>
        {members.map((member) => {
          const isActive = currentFilter === member.uid;
          return (
            <div 
              key={member.uid} 
              className={`${styles.memberAvatar} ${isActive ? styles.active : ''}`}
              title={member.name || member.email}
              onClick={() => onFilterChange(isActive ? '' : member.uid)}
            >
              {member.photoURL ? (
                <img src={member.photoURL} alt={member.name} />
              ) : (
                <span>
                  {(member.name || member.email).charAt(0).toUpperCase()}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* 2. Selector Desplegable Premium (Derecha) */}
      <div className={styles.filterSelectWrapper}>
        <span>Filtrar por:</span>
        
        <div className={styles.selectorContainer}>
          {/* El botón gatillo que reemplaza al select */}
          <button
            type="button"
            className={styles.triggerButton}
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className={styles.triggerContent}>
              {renderMiniAvatar(selectedMember)}
              <span>{selectedMember ? (selectedMember.name || selectedMember.email) : 'Todos los miembros'}</span>
            </div>
            <ChevronDown 
              size={14} 
              style={{ 
                transform: isOpen ? 'rotate(180deg)' : 'none', 
                transition: 'transform 0.2s ease', 
                color: '#94a3b8' 
              }} 
            />
          </button>

          {/* Menú Desplegable Flotante */}
          {isOpen && (
            <div className={styles.dropdownMenu}>
              {/* Opción por defecto: Mostrar Todos */}
              <button
                type="button"
                className={`${styles.dropdownItem} ${!currentFilter ? styles.active : ''}`}
                onClick={() => handleSelect('')}
              >
                <div className={styles.memberInfo}>
                  {renderMiniAvatar(undefined)}
                  <span>Todos los miembros</span>
                </div>
                {!currentFilter && <Check size={12} />}
              </button>

              {/* Mapeo de cada uno de los miembros reales */}
              {members.map((member) => {
                const isSelected = member.uid === currentFilter;
                return (
                  <button
                    key={member.uid}
                    type="button"
                    className={`${styles.dropdownItem} ${isSelected ? styles.active : ''}`}
                    onClick={() => handleSelect(member.uid)}
                  >
                    <div className={styles.memberInfo}>
                      {renderMiniAvatar(member)}
                      <span>{member.name || member.email}</span>
                    </div>
                    {isSelected && <Check size={12} />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Backdrop invisible para cerrar el menú si haces clic en cualquier otra parte de la pantalla */}
      {isOpen && <div className={styles.backdrop} onClick={() => setIsOpen(false)} />}
    </div>
  );
};
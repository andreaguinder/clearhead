'use client';

import React, { useState } from 'react';
import styles from './MembersNavbar.module.scss';
import { Member } from '@/types/board';
import { ChevronDown, Check, Users } from 'lucide-react'; 

interface MembersNavbarProps {
  members: Member[];
  currentFilters: string[]; // 🚀 Se mantiene el tipado de múltiples filtros
  onFilterChange: (uid: string) => void;
}

export const MembersNavbar: React.FC<MembersNavbarProps> = ({
  members,
  currentFilters,
  onFilterChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (members.length <= 1) return null;

  // Renderizador de iniciales o foto (se mantiene para el interior del dropdown)
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

  // Texto dinámico para el botón principal del dropdown
  const getDropdownLabel = () => {
    if (currentFilters.length === 0) return 'Todos los miembros';
    if (currentFilters.length === 1) {
      const match = members.find(m => m.uid === currentFilters[0]);
      return match ? (match.name || match.email) : '1 miembro';
    }
    return `${currentFilters.length} miembros seleccionados`;
  };

  return (
    <div className={styles.membersNavbar}>
      
      {/* 🚀 Se eliminó el bloque completo de "membersList" para proteger la UI en mobile */}

      {/* Selector Desplegable Premium */}
      <div className={styles.filterSelectWrapper}>
        <span>Filtrar por:</span>
        
        <div className={styles.selectorContainer}>
          <button
            type="button"
            className={styles.triggerButton}
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className={styles.triggerContent}>
              {/* Si hay un solo filtro activo, renderiza su foto, sino el icono default */}
              {renderMiniAvatar(currentFilters.length === 1 ? members.find(m => m.uid === currentFilters[0]) : undefined)}
              <span>{getDropdownLabel()}</span>
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

          {isOpen && (
            <div className={styles.dropdownMenu}>
              {/* Opción para limpiar: Mostrar Todos */}
              <button
                type="button"
                className={`${styles.dropdownItem} ${currentFilters.length === 0 ? styles.active : ''}`}
                onClick={() => {
                  onFilterChange(''); // Resetea
                  setIsOpen(false);
                }}
              >
                <div className={styles.memberInfo}>
                  {renderMiniAvatar(undefined)}
                  <span>Todos los miembros</span>
                </div>
                {currentFilters.length === 0 && <Check size={12} />}
              </button>

              {/* Lista completa de miembros con checkboxes ocultos (estilo Trello premium) */}
              {members.map((member) => {
                const isSelected = currentFilters.includes(member.uid);
                return (
                  <button
                    key={member.uid}
                    type="button"
                    className={`${styles.dropdownItem} ${isSelected ? styles.active : ''}`}
                    onClick={() => onFilterChange(member.uid)} // Permite selección múltiple interactiva
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

      {/* Backdrop para cerrar haciendo clic afuera */}
      {isOpen && <div className={styles.backdrop} onClick={() => setIsOpen(false)} />}
    </div>
  );
};
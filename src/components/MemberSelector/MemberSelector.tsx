'use client';

import React, { useState } from 'react';
import { Member } from '@/types/board';
import { ChevronDown, Check, User } from 'lucide-react';
import styles from './MemberSelector.module.scss';

interface MemberSelectorProps {
  members: Member[];
  currentAssignedId?: string;
  onAssign: (memberId: string) => void;
  variant?: 'card' | 'sidebar';
}

export const MemberSelector: React.FC<MemberSelectorProps> = ({
  members,
  currentAssignedId = '',
  onAssign,
  variant = 'card',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Buscamos al miembro que se encuentra seleccionado actualmente
  const selectedMember = members.find((m) => m.uid === currentAssignedId);

  const handleSelect = (uid: string) => {
    onAssign(uid);
    setIsOpen(false);
  };

  // Helper para renderizar la burbuja de avatar de manera uniforme en el select
  const renderAvatar = (member?: Member) => {
    if (!member) {
      return (
        <div className={styles.avatarCircle} style={{ backgroundColor: '#94a3b8' }}>
          <User size={12} />
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
    <div className={styles.selectorContainer}>
      {variant === 'sidebar' && <h4 className={styles.sectionTitle}>Asignar Miembro</h4>}

      {/* Botón principal que simula el select nativo */}
      <button
        type="button"
        className={styles.triggerButton}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className={styles.triggerContent}>
          {renderAvatar(selectedMember)}
          <span>
            {selectedMember ? (selectedMember.name || selectedMember.email) : (variant === 'sidebar' ? 'Sin asignar' : '👤 Asignar...')}
          </span>
        </div>
        <ChevronDown 
          size={16} 
          style={{ 
            transform: isOpen ? 'rotate(180deg)' : 'none', 
            transition: 'transform 0.2s ease', 
            color: '#94a3b8' 
          }} 
        />
      </button>

      {/* Backdrop invisible para cerrar al clickear afuera en la pantalla */}
      {isOpen && <div className={styles.backdrop} onClick={() => setIsOpen(false)} />}

      {/* Menú Desplegable Flotante Personalizado */}
      {isOpen && (
        <div className={styles.dropdownMenu}>
          {/* Opción para remover la asignación */}
          <button
            type="button"
            className={`${styles.dropdownItem} ${!currentAssignedId ? styles.active : ''}`}
            onClick={() => handleSelect('')}
          >
            <div className={styles.memberInfo}>
              {renderAvatar(undefined)}
              <span>Sin asignar</span>
            </div>
            {!currentAssignedId && <Check size={14} />}
          </button>

          {/* Mapeo de miembros reales del equipo */}
          {members.map((m) => {
            const isSelected = m.uid === currentAssignedId;
            return (
              <button
                key={m.uid}
                type="button"
                className={`${styles.dropdownItem} ${isSelected ? styles.active : ''}`}
                onClick={() => handleSelect(m.uid)}
              >
                <div className={styles.memberInfo}>
                  {renderAvatar(m)}
                  <span>{m.name || m.email}</span>
                </div>
                {isSelected && <Check size={14} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
'use client';

import React, { useState } from 'react';
import { Member } from '@/types/board';
import { ChevronDown, Check, User } from 'lucide-react';
import styles from './MemberSelector.module.scss';

interface MemberSelectorProps {
  members: Member[];
  // 1. Cambiamos a array para soportar selección múltiple
  currentAssignedIds?: string[]; 
  onAssign: (memberIds: string[]) => void;
  variant?: 'card' | 'sidebar';
}

export const MemberSelector: React.FC<MemberSelectorProps> = ({
  members,
  currentAssignedIds = [], // Inicializa como array vacío por defecto
  onAssign,
  variant = 'card',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // 2. Quitamos la función 'handleSelect' vieja y metemos la lógica de Toggle múltiple
  const handleToggleMember = (uid: string) => {
    let updatedIds: string[];

    if (uid === '') {
      // Si eligen "Sin asignar", limpiamos todo el array
      updatedIds = [];
    } else {
      // Si ya estaba, lo saca. Si no estaba, lo mete.
      if (currentAssignedIds.includes(uid)) {
        updatedIds = currentAssignedIds.filter((id) => id !== uid);
      } else {
        updatedIds = [...currentAssignedIds, uid];
      }
    }
    
    // Le manda el array completo actualizado al componente padre (Firestore)
    onAssign(updatedIds); 
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
      {variant === 'sidebar' && <h4 className={styles.sectionTitle}>Asignar Miembros</h4>}

      {/* Botón principal que simula el select nativo */}
      <button
        type="button"
        className={styles.triggerButton}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className={styles.triggerContent}>
          {/* 3. Renderizamos un resumen estético en el botón principal */}
          {currentAssignedIds.length === 0 ? (
            <>
              {renderAvatar(undefined)}
              <span>{variant === 'sidebar' ? 'Sin asignar' : '👤 Asignar...'}</span>
            </>
          ) : (
            <div className="flex -space-x-1 overflow-hidden items-center">
              <span>{`👥 ${currentAssignedIds.length} asignados`}</span>
            </div>
          )}
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
          {/* Opción para remover todas las asignaciones */}
          <button
            type="button"
            className={`${styles.dropdownItem} ${currentAssignedIds.length === 0 ? styles.active : ''}`}
            onClick={() => handleToggleMember('')}
          >
            <div className={styles.memberInfo}>
              {renderAvatar(undefined)}
              <span>Sin asignar</span>
            </div>
            {currentAssignedIds.length === 0 && <Check size={14} />}
          </button>

          {/* Mapeo de miembros reales del equipo */}
          {members.map((m) => {
            // 4. Chequeamos si el ID actual está incluido en el array
            const isSelected = currentAssignedIds.includes(m.uid);
            return (
              <button
                key={m.uid}
                type="button"
                className={`${styles.dropdownItem} ${isSelected ? styles.active : ''}`}
                // Al hacer clic, hace toggle y NO cierra el menú para poder elegir más
                onClick={() => handleToggleMember(m.uid)}
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
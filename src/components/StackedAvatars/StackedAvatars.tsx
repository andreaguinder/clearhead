'use client';

import React from 'react';
import styles from './StackedAvatars.module.scss';
import { Member } from '@/types/board'; // Ajustá la ruta según tus tipos

interface StackedAvatarsProps {
  members: Member[];
  maxToShow?: number; // Por defecto 4, pero lo hacés configurable por las dudas
}

export default function StackedAvatars({ members, maxToShow = 4 }: StackedAvatarsProps) {
  if (!members || members.length === 0) return null;

  const extraCount = members.length - maxToShow;
  const visibleMembers = members.slice(0, maxToShow);

  return (
    <div className={styles.avatarGroup}>
      
      {/* 🚀 Indicador del PLUS (+X) para los miembros restantes */}
      {extraCount > 0 && (
        <div 
          className={`${styles.avatarCircle} ${styles.avatarPlus}`}
          title={`Y ${extraCount} más asignados`}
          style={{ zIndex: 0 }}
        >
          +{extraCount}
        </div>
      )}

      {/* 🚀 Mapeo de los miembros visibles */}
      {visibleMembers.map((member, index) => (
        <div 
          key={member.uid} 
          className={styles.avatarCircle} 
          title={`Asignado a: ${member.name}`}
          style={{ zIndex: maxToShow - index }}
        >
          {member.photoURL ? (
            <img 
              src={member.photoURL} 
              alt={member.name} 
              className={styles.avatarImage} 
            />
          ) : (
            <div className={styles.avatarFallback}>
              {member.name?.charAt(0) || member.email?.charAt(0)}
            </div>
          )}
        </div>
      ))}

    </div>
  );
}
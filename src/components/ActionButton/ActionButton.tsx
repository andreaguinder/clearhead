import { useState, useRef, useEffect } from 'react';
import styles from './ActionButton.module.scss';

interface ActionButtonProps {
  type: 'task' | 'column';
  onClick?: () => void; // Queda opcional para las tareas
  onCreate?: (title: string) => void; // Nueva función para las columnas
}

export default function ActionButton({ type, onClick, onCreate }: ActionButtonProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-foco en el input apenas se abre
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleOpen = () => {
    if (type === 'task' && onClick) {
      onClick(); // El flujo de la tarea sigue abriendo el modal directamente
    } else {
      setIsEditing(true); // Si es columna, activamos el input local
    }
  };

  const handleSave = () => {
    if (inputValue.trim() && onCreate) {
      onCreate(inputValue.trim());
      setInputValue('');
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') {
      setInputValue('');
      setIsEditing(false);
    }
  };

  // Si es columna y está en modo edición, mostramos la cajita para escribir
  if (type === 'column' && isEditing) {
    return (
      <div className={styles.inputContainer}>
        <input
          ref={inputRef}
          type="text"
          className={styles.columnInput}
          placeholder="Introduzca el título de la lista..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
        />
        <div className={styles.actionRow}>
          <button className={styles.saveBtn} onMouseDown={handleSave}>
            Añadir lista
          </button>
          <button className={styles.cancelBtn} onClick={() => setIsEditing(false)}>
            ✕
          </button>
        </div>
      </div>
    );
  }

  // Botón por defecto
  const label = type === 'task' ? '+ Añadir otra tarjeta' : '+ Añadir otra columna';
  return (
    <button 
      className={`${styles.button} ${type === 'column' ? styles.columnBtn : styles.taskBtn}`}
      onClick={handleOpen}
    >
      {label}
    </button>
  );
}
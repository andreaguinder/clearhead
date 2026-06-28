import styles from './ActionButton.module.scss';

interface ActionButtonProps {
  type: 'task' | 'column';
  onClick: () => void;
}

export default function ActionButton({ type, onClick }: ActionButtonProps) {
  const label = type === 'task' ? '+ Añadir otra tarjeta' : '+ Añadir otra columna';
  
  return (
    <button 
      className={`${styles.button} ${type === 'column' ? styles.columnBtn : styles.taskBtn}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
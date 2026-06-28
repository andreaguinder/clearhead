import { Task } from '@/types/board';
import styles from './TaskDetailModal.module.scss';

interface TaskDetailModalProps {
  task: Task;
  onClose: () => void;
}

export default function TaskDetailModal({ task, onClose }: TaskDetailModalProps) {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      {/* El stopPropagation evita que el modal se cierre al hacer click adentro de la tarjeta blanca */}
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        
        {/* Cabecera */}
        <header className={styles.modalHeader}>
          <div className={styles.titleWrapper}>
            <span className={styles.icon}>📋</span>
            <h2>{task.title}</h2>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </header>

        {/* Cuerpo Principal: Dos columnas como Trello */}
        <div className={styles.modalBody}>
          
          {/* Columna Izquierda: Contenido principal */}
          <main className={styles.mainContent}>
            
            {/* Sección: Descripción Larga */}
            <section className={styles.section}>
              <h3>📝 Descripción Completa</h3>
              <textarea 
                className={styles.textarea} 
                placeholder="Añade una descripción más detallada para esta tarea..."
                defaultValue={task.detailedDescription || ''}
              />
            </section>

            {/* Sección: Checklist (Simulada por ahora) */}
            <section className={styles.section}>
              <h3>☑ Checklist</h3>
              <div className={styles.checklistPlaceholder}>
                <p>Acá van a ir los elementos con su barra de progreso.</p>
              </div>
            </section>

          </main>

          {/* Columna Derecha: Botones de Acción / Laterales */}
          <aside className={styles.sidebar}>
            <h4>Sugerencias para la tarjeta</h4>
            <button className={styles.sidebarBtn}>🏷️ Etiquetas</button>
            <button className={styles.sidebarBtn}>📅 Vencimiento</button>
            <button className={styles.sidebarBtn}>📎 Adjuntar archivo</button>
            <button className={styles.sidebarBtn}>🗑️ Eliminar</button>
          </aside>

        </div>
      </div>
    </div>
  );
}
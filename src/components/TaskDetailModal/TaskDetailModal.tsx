import { Task } from '@/types/board';
import styles from './TaskDetailModal.module.scss';

interface TaskDetailModalProps {
  task: Task;
  onClose: () => void;
  onUpdateTask: (updatedTask: Task) => void;
  columnNames: Record<string, string>;
}

export default function TaskDetailModal({ task, onClose, onUpdateTask, columnNames }: TaskDetailModalProps) {
  
  // 1. Cambiar el título principal
  const handleTitleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (!e.target.value.trim()) return; // Evita que dejen el título vacío
    const updatedTask: Task = {
      ...task,
      title: e.target.value,
    };
    onUpdateTask(updatedTask);
  };

  // 2. Cambiar la descripción corta (la del tablero)
  const handleShortDescriptionBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const updatedTask: Task = {
      ...task,
      description: e.target.value,
    };
    onUpdateTask(updatedTask);
  };

  // 3. Cambiar la descripción larga (detallada)
  const handleDescriptionBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    const updatedTask: Task = {
      ...task,
      detailedDescription: e.target.value,
    };
    onUpdateTask(updatedTask);
  };

  // 4. Cambiar el vencimiento
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedTask: Task = {
      ...task,
      dueDate: e.target.value,
    };
    onUpdateTask(updatedTask);
  };

    const priorities: { value: Task['priority']; label: string }[] = [
  { value: 'baja', label: 'Baja' },
  { value: 'normal', label: 'Normal' },
  { value: 'media', label: 'Media' },
  { value: 'alta', label: 'Alta' },
];

  // 5. Cambiar la prioridad desde el selector
const handlePrioritySelect = (value: Task['priority']) => {
    const updatedTask: Task = {
      ...task,
      priority: value,
    };
    onUpdateTask(updatedTask);
  };

const columnNameHTML = columnNames[task.status] || task.status;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        
        {/* Cabecera */}
        <header className={styles.modalHeader}>
          <div className={styles.titleWrapper}>
            <span className={styles.icon}>📋</span>
            <div className={styles.headerInputGroup}>
              {/* 👈 Ahora el título es un input sin bordes, estilo Trello */}
              <input 
                type="text" 
                className={styles.titleInput} 
                placeholder="Dale un título a esta tarjeta..."
                defaultValue={task.title}
                onBlur={handleTitleBlur}
              />
              <p className={styles.subTitle}>en la columna <span>{columnNameHTML}</span></p>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </header>

        {/* Cuerpo Principal */}
        <div className={styles.modalBody}>
          <main className={styles.mainContent}>
            
            {/* Meta-datos (Vencimiento y Prioridad) */}
            <div className={styles.metaDataGrid}>
              {/* Vencimiento */}
              <div className={styles.metaItem}>
                <h4>Vencimiento</h4>
                <input 
                  type="date" 
                  className={styles.dateInput}
                  value={task.dueDate || ''} 
                  onChange={handleDateChange}
                />
              </div>

              {/* 👈 NUEVO: Selector de Prioridad en formato de Pills */}
      <div className={styles.metaItem}>
        <h4>Prioridad</h4>
        <div className={styles.pillsContainer}>
          {priorities.map((p) => {
            // Evaluamos si esta píldora es la que la tarea tiene activa actualmente
            const isActive = task.priority === p.value;
            
            return (
              <button
                key={p.value}
                type="button"
                // Le pasamos la clase base, la clase del color específico, y si está activa agregamos la clase modificadora
                className={`${styles.priorityPill} ${styles[p.value]} ${isActive ? styles.active : ''}`}
                onClick={() => handlePrioritySelect(p.value)}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>

            {/* 👈 NUEVA SECCIÓN: Descripción Corta */}
            <section className={styles.section}>
              <h3>📌 Descripción Corta (se muestra en la tarjeta)</h3>
              <input 
                type="text"
                className={styles.shortDescriptionInput}
                placeholder="Añade un resumen breve para mostrar en el tablero..."
                defaultValue={task.description || ''}
                onBlur={handleShortDescriptionBlur}
              />
            </section>

            {/* Sección: Descripción Larga */}
            <section className={styles.section}>
              <h3>📝 Descripción Completa</h3>
              <textarea 
                className={styles.textarea} 
                placeholder="Añade una descripción más detallada para esta tarea..."
                defaultValue={task.detailedDescription || ''}
                onBlur={handleDescriptionBlur}
              />
            </section>

            {/* Sección: Checklist */}
            <section className={styles.section}>
              <h3>☑ Checklist</h3>
              <div className={styles.checklistPlaceholder}>
                <p>Próximo paso: Acá van a ir los elementos dinámicos.</p>
              </div>
            </section>

          </main>

          {/* Columna Derecha (Sidebar) */}
          <aside className={styles.sidebar}>
            <h4>Sugerencias</h4>
            <button className={styles.sidebarBtn}>🏷️ Etiquetas</button>
            <button className={styles.sidebarBtn}>🗑️ Eliminar Tarjeta</button>
          </aside>

        </div>
      </div>
    </div>
  );
}
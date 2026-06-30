import { useState } from 'react';
import { Label } from '@/types/board';
import { LabelPills } from './LabelPills';
import styles from './Label.module.scss';

interface LabelManagerProps {
  globalLabels: Record<string, Label>;
  taskLabelIds: string[];
  onToggleLabel: (labelId: string) => void;
  onSaveLabel: (label: Label) => void;
  onDeleteLabel: (labelId: string) => void;
}

export default function LabelManager({
  globalLabels,
  taskLabelIds,
  onToggleLabel,
  onSaveLabel,
  onDeleteLabel
}: LabelManagerProps) {

  const [text, setText] = useState('');
  const [bgColor, setBgColor] = useState('#3b82f6');
  const [textColor, setTextColor] = useState('#ffffff');

  const handleCreate = () => {
    if (!text.trim()) return;
    onSaveLabel({
      id: `label-${Date.now()}`,
      text,
      color: bgColor,
      textColor
    });
    setText('');
  };

  return (
    <div className={styles.managerContainer}>
      {/* Sección para crear nueva etiqueta */}
      <div className={styles.creatorSection}>
        <input className={styles.labelInputNombre} value={text} onChange={(e) => setText(e.target.value)} placeholder="Nombre..." />

        <div className={styles.colorInputs}>
          <label>Fondo: <input className={styles.labelInputPicker} type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} /></label>
          <label>Texto: <input className={styles.labelInputPicker} type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} /></label>
        </div>

        <button onClick={handleCreate}>+</button>
      </div>
      <h4 style={{ margin: '15px 0 5px 0' }}>Seleccionar etiquetas</h4>


      {/* Lista de etiquetas disponibles */}
      <div className={styles.listSection}>
        {Object.values(globalLabels).map((label) => (
          <div key={label.id} className={styles.labelRow}>
            <input className={styles.checkbox}
              type="checkbox"
              checked={taskLabelIds.includes(label.id)}
              onChange={() => onToggleLabel(label.id)}
            />
            <LabelPills label={label} />
            <button
              className={styles.deleteBtn}
              onClick={() => onDeleteLabel(label.id)}
            >
              &#10005;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
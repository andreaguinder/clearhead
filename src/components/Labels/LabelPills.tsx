import styles from './Label.module.scss'; // Asegúrate de que el nombre coincida

interface LabelPillsProps {
  label: { text: string; color: string, textColor: string };
  onRemove?: () => void;
}

export function LabelPills({ label, onRemove }: LabelPillsProps) {
  return (
    <span className={styles.pill} style={{ backgroundColor: label.color, color: label.textColor }}>
      {label.text}
      {onRemove && <button onClick={onRemove} style={{ color: label.textColor }}>×</button>}
    </span>
  );
}
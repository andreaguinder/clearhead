'use client';

import React, { useState } from 'react';
import { Trash2, Plus, CheckCircle2, Circle } from 'lucide-react';
import Button from '../Button/Button';
import styles from './TaskCheckList.module.scss';

export interface ChecklistItem {
    id: string;
    text: string;
    isCompleted: boolean;
}

interface TaskChecklistProps {
    items: ChecklistItem[];
    onUpdateChecklist: (items: ChecklistItem[]) => void;
}

export default function TaskChecklist({ items = [], onUpdateChecklist }: TaskChecklistProps) {
    const [newItemText, setNewItemText] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingText, setEditingText] = useState('');

    //  Alternar el estado completado (Tildar / Destildar)
    const toggleItem = (id: string) => {
        const updated = items.map(item =>
            item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
        );
        onUpdateChecklist(updated);
    };

    //  Agregar un nuevo ítem a la lista
    const handleAddItem = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newItemText.trim()) return;

        const newItem: ChecklistItem = {
            id: crypto.randomUUID(),
            text: newItemText.trim(),
            isCompleted: false
        };

        onUpdateChecklist([...items, newItem]);
        setNewItemText('');
    };

    //  Eliminar un ítem 
    const deleteItem = (id: string) => {
        const updated = items.filter(item => item.id !== id);
        onUpdateChecklist(updated);
    };

    //  Guardar edición al salir del input (Blur) o presionar Enter
    const handleSaveEdit = (id: string) => {
        if (!editingText.trim()) {
            deleteItem(id); // Si lo dejan vacío, lo borramos
        } else {
            const updated = items.map(item =>
                item.id === id ? { ...item, text: editingText.trim() } : item
            );
            onUpdateChecklist(updated);
        }
        setEditingId(null);
    };

    // Calcular el progreso para la barrita (estilo Planner)
    const completedCount = items.filter(i => i.isCompleted).length;
    const totalCount = items.length;
    const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    return (
        <div className={styles.checklistContainer}>
            <div className={styles.checklistHeader}>
                <h3>Checklist</h3>
                {totalCount > 0 && (
                    <span className={styles.progressText}>{completedCount}/{totalCount}</span>
                )}
            </div>

            {/* Barra de progreso elástica */}
            {totalCount > 0 && (
                <div className={styles.progressBarBg}>
                    <div className={styles.progressBarFill} style={{ width: `${progressPercentage}%` }} />
                </div>
            )}

            {/* Lista de sub-tareas */}
            <div className={styles.itemsList}>
                {items.map((item) => (
                    <div
                        key={item.id}
                        className={`${styles.checkItem} ${item.isCompleted ? styles.completed : ''}`}
                    >
                        {/* Botón de Checkbox custom con íconos circulares de Lucide */}
                        <button
                            type="button"
                            className={styles.checkboxBtn}
                            onClick={() => toggleItem(item.id)}
                        >
                            {item.isCompleted ? (
                                <CheckCircle2 size={18} className={styles.checkedIcon} />
                            ) : (
                                <Circle size={18} className={styles.uncheckedIcon} />
                            )}
                        </button>

                        {/* Texto o Input de edición */}
                        <div className={styles.textWrapper}>
                            {editingId === item.id ? (
                                <input
                                    type="text"
                                    className={styles.itemInputEdit}
                                    value={editingText}
                                    onChange={(e) => setEditingText(e.target.value)}
                                    onBlur={() => handleSaveEdit(item.id)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(item.id)}
                                    autoFocus
                                />
                            ) : (
                                <span
                                    className={styles.itemText}
                                    onClick={() => {
                                        setEditingId(item.id);
                                        setEditingText(item.text);
                                    }}
                                >
                                    {item.text}
                                </span>
                            )}
                        </div>

                        {/* El botón del tacho para borrar */}
                        <button
                            type="button"
                            className={styles.deleteItemBtn}
                            onClick={() => deleteItem(item.id)}
                            title="Eliminar ítem"
                        >
                            <Trash2 size={15} />
                        </button>
                    </div>
                ))}
            </div>

            {/* Formulario para añadir rápido */}
            <form onSubmit={handleAddItem} className={styles.addItemForm}>
                <input
                    type="text"
                    placeholder="Añadir un elemento..."
                    value={newItemText}
                    onChange={(e) => setNewItemText(e.target.value)}
                    className={styles.addItemInput}
                />
                <Button variant="secondary" type="submit" className={styles.addBtn} disabled={!newItemText.trim()}>
                    <Plus size={16} />
                </Button>
            </form>
        </div>
    );
}
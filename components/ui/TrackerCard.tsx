"use client";

import { useState } from 'react';
import styles from './TrackerCard.module.css';

interface TrackerItem {
    id: string;
    label: string;
    subLabel?: string;
    completed: boolean;
}

interface TrackerCardProps {
    title: string;
    icon?: React.ReactNode;
    items: TrackerItem[];
}

export default function TrackerCard({ title, icon, items: initialItems }: TrackerCardProps) {
    const [items, setItems] = useState(initialItems);

    const toggleItem = (id: string) => {
        setItems((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, completed: !item.completed } : item
            )
        );
    };

    const progress = Math.round(
        (items.filter((i) => i.completed).length / items.length) * 100
    );

    return (
        <div className={`card ${styles.container}`}>
            <div className={styles.header}>
                <div className={styles.titleRow}>
                    {icon && <span className={styles.icon}>{icon}</span>}
                    <h3 className={styles.title}>{title}</h3>
                </div>
                <div className={styles.progressContainer}>
                    <div className={styles.progressBar}>
                        <div
                            className={styles.progressFill}
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <span className={styles.progressText}>{progress}%</span>
                </div>
            </div>

            <div className={styles.list}>
                {items.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => toggleItem(item.id)}
                        className={`${styles.item} ${item.completed ? styles.completed : ''}`}
                    >
                        <div className={styles.checkCircle}>
                            {item.completed && (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                            )}
                        </div>
                        <div className={styles.itemContent}>
                            <span className={styles.itemLabel}>{item.label}</span>
                            {item.subLabel && <span className={styles.itemSubLabel}>{item.subLabel}</span>}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}

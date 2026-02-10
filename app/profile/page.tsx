"use client";

import { useSocial } from '@/contexts/SocialContext';
import { useState } from 'react';
import styles from './page.module.css';

export default function ProfilePage() {
    const { user, setUserGoal, signOut } = useSocial();
    const [goalInput, setGoalInput] = useState(user?.goal || 10);

    const handleSaveGoal = () => {
        if (user?.id === '1') {
            alert('Please login to save goals permanently!');
            return;
        }
        setUserGoal(goalInput);
        alert('Goal updated successfully!');
    };

    if (!user) {
        return <div className={styles.loading}>Loading profile...</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>My Profile</h1>
                {user.id === '1' ? (
                    <span className={styles.guestBadge}>Guest Mode</span>
                ) : (
                    <span className={styles.verifiedBadge}>Cloud Synced</span>
                )}
            </div>

            <div className={styles.grid}>
                {/* Stats Card */}
                <div className="card">
                    <h2 className={styles.cardTitle}>📊 My Statistics</h2>
                    <div className={styles.statsList}>
                        <div className={styles.statItem}>
                            <span className={styles.statLabel}>Pages Read</span>
                            <span className={styles.statValue}>{user.pagesRead}</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statLabel}>Verses Read</span>
                            <span className={styles.statValue}>{user.versesRead}</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statLabel}>Surahs Completed</span>
                            <span className={styles.statValue}>{user.completedSurahs.length}</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statLabel}>Current Streak</span>
                            <span className={styles.statValue}>{user.streak} days 🔥</span>
                        </div>
                    </div>
                </div>

                {/* Settings Card */}
                <div className="card">
                    <h2 className={styles.cardTitle}>⚙️ Settings</h2>
                    <div className={styles.settingsForm}>
                        <label className={styles.label}>
                            Daily Goal (pages)
                            <input
                                type="number"
                                value={goalInput}
                                onChange={(e) => setGoalInput(parseInt(e.target.value) || 0)}
                                className={styles.input}
                                min="1"
                                max="100"
                            />
                        </label>
                        <button className="btn btn-primary" onClick={handleSaveGoal}>
                            Save Changes
                        </button>
                    </div>
                </div>

                {/* Completed Surahs */}
                <div className="card" style={{ gridColumn: '1 / -1' }}>
                    <h2 className={styles.cardTitle}>✅ Completed Surahs</h2>
                    {user.completedSurahs.length > 0 ? (
                        <div className={styles.surahBadges}>
                            {user.completedSurahs.map(id => (
                                <span key={id} className={styles.badge}>
                                    Surah {id}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className={styles.emptyState}>No surahs completed yet. Start reading!</p>
                    )}
                </div>
                {/* Guest CTA */}
                {user.id === '1' && (
                    <div className={`${styles.card} ${styles.guestCard}`} style={{ gridColumn: '1 / -1' }}>
                        <div className={styles.guestContent}>
                            <h3>Want to save your progress?</h3>
                            <p>You are currently in guest mode. Sign up to sync your progress across devices and join groups!</p>
                            <a href="/auth" className="btn btn-primary">Create Account</a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

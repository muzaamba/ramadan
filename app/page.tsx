"use client";

import Link from 'next/link';
import { useSocial } from '@/contexts/SocialContext';
import { useState, useEffect } from 'react';
import styles from './page.module.css';

export default function Home() {
  const { user, todayHabits, updateHabits } = useSocial();
  const [daysToRamadan, setDaysToRamadan] = useState<number | null>(null);

  useEffect(() => {
    // Assume Ramadan 2026 starts Feb 18
    const ramadanDate = new Date('2026-02-18');
    const today = new Date();
    const diff = Math.ceil((ramadanDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    setDaysToRamadan(diff > 0 ? diff : 0);
  }, []);

  const handleHabitToggle = (habit: keyof typeof todayHabits) => {
    if (typeof todayHabits[habit] === 'boolean') {
      updateHabits({ [habit]: !todayHabits[habit] });
    }
  };

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <div className={styles.greeting}>
              <span className={styles.moon}>🌙</span>
              <p className={styles.ramadanGreeting}>
                {daysToRamadan !== null && daysToRamadan > 0
                  ? `${daysToRamadan} Days until Ramadan`
                  : 'Ramadan Mubarak'}
              </p>
            </div>
            <h1 className={styles.heroTitle}>
              Build Meaningful Habits<br />
              <span className={styles.heroAccent}>Together</span>
            </h1>
            <p className={styles.heroDescription}>
              Track your daily worship, read Qur'an with friends, and grow spiritually this Ramadan—one day at a time.
            </p>
            <div className={styles.heroActions}>
              <Link href="/quran" className="btn btn-primary">
                {user ? 'Continue Reading' : 'Start Reading'}
              </Link>
              <Link href="/groups" className="btn">
                {user ? 'View My Group' : 'Explore Groups'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        <div className={styles.dashboardGrid}>
          {/* Habit Tracker */}
          <div className={styles.dashboardCard}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>🤲 Today's Habits</h2>
              <span className={styles.dateTag}>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            </div>

            <div className={styles.habitList}>
              <div className={styles.habitItem}>
                <div className={styles.habitLabel}>
                  <span className={styles.habitIcon}>🥖</span>
                  <span>Fasting Today?</span>
                </div>
                <button
                  className={`${styles.habitCheck} ${todayHabits.isFasting ? styles.checked : ''}`}
                  onClick={() => handleHabitToggle('isFasting')}
                >
                  {todayHabits.isFasting ? '✓ Yes' : 'No'}
                </button>
              </div>

              <hr className={styles.divider} />

              <h3 className={styles.subTitle}>5 Daily Prayers</h3>
              <div className={styles.prayerGrid}>
                {[
                  { id: 'fajr', label: 'Fajr' },
                  { id: 'dhuhr', label: 'Dhuhr' },
                  { id: 'asr', label: 'Asr' },
                  { id: 'maghrib', label: 'Maghrib' },
                  { id: 'isha', label: 'Isha' }
                ].map((prayer) => (
                  <button
                    key={prayer.id}
                    className={`${styles.prayerBtn} ${todayHabits[prayer.id as keyof typeof todayHabits] ? styles.prayed : ''}`}
                    onClick={() => handleHabitToggle(prayer.id as any)}
                  >
                    {prayer.label}
                  </button>
                ))}
              </div>

              <div className={styles.noteSection}>
                <h3 className={styles.subTitle}>Daily Reflection</h3>
                <textarea
                  className={styles.noteInput}
                  placeholder="Write a small note about your day..."
                  value={todayHabits.note}
                  onChange={(e) => updateHabits({ note: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Ramadan Calendar */}
          <div className={styles.dashboardCard}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>📅 Ramadan Calendar</h2>
              <span className={styles.yearTag}>2026/1447H</span>
            </div>
            <p className={styles.calendarDesc}>Track your 30-day journey below</p>

            <div className={styles.calendarGrid}>
              {Array.from({ length: 30 }).map((_, i) => (
                <div
                  key={i}
                  className={`${styles.calendarDay} ${i < 8 ? styles.pastDay : ''} ${i === 8 ? styles.currentDay : ''}`}
                >
                  <span className={styles.dayNumber}>{i + 1}</span>
                  {i < 8 && <span className={styles.checkIcon}>✓</span>}
                </div>
              ))}
            </div>

            <div className={styles.calendarLegend}>
              <div className={styles.legendItem}><span className={styles.dotPast}></span> Completed</div>
              <div className={styles.legendItem}><span className={styles.dotCurrent}></span> Today</div>
              <div className={styles.legendItem}><span className={styles.dotFuture}></span> Remaining</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features (Legacy but styled) */}
      <section className={styles.featuresSection}>
        <div className="container">
          <div className={styles.featuresHeader}>
            <h2 className={styles.sectionTitle}>Spiritual Growth Features</h2>
            <p className={styles.sectionDescription}>Everything you need to stay consistent this month</p>
          </div>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📖</div>
              <h3 className={styles.featureTitle}>Group Reading</h3>
              <p className={styles.featureDescription}>Join circles and finish the Quran together with real-time tracking.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🤖</div>
              <h3 className={styles.featureTitle}>AI Analysis</h3>
              <p className={styles.featureDescription}>Deen AI analyzes your reading patterns and offers encouraging Somali insights.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🔥</div>
              <h3 className={styles.featureTitle}>Dua & Dhikr</h3>
              <p className={styles.featureDescription}>Integrated tools for daily dhikr and special Ramadan duas.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

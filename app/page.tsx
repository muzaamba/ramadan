"use client";

import Link from 'next/link';
import { useSocial } from '@/contexts/SocialContext';
import { useState, useEffect, useMemo } from 'react';
import styles from './page.module.css';

export default function Home() {
  const { user, todayHabits, updateHabits } = useSocial();
  const [daysToRamadan, setDaysToRamadan] = useState<number | null>(null);
  const [isEditingNote, setIsEditingNote] = useState(false);

  // Ramadan 2026 starts approx Feb 18
  const ramadanStartDate = useMemo(() => {
    const d = new Date('2026-02-18');
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  useEffect(() => {
    const today = new Date();
    const diff = Math.ceil((ramadanStartDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    setDaysToRamadan(diff > 0 ? diff : 0);
  }, [ramadanStartDate]);

  const handleHabitToggle = (habit: keyof typeof todayHabits) => {
    if (typeof todayHabits[habit] === 'boolean') {
      updateHabits({ [habit]: !todayHabits[habit] });
    }
  };

  const calendarDays = useMemo(() => {
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 30; i++) {
      const date = new Date(ramadanStartDate);
      date.setDate(date.getDate() + i);

      const isToday = date.getTime() === today.getTime();
      const isPast = date.getTime() < today.getTime();

      days.push({
        ramadanDay: i + 1,
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        isToday,
        isPast
      });
    }
    return days;
  }, [ramadanStartDate]);

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <div className={styles.heroBadge}>
              <span className={styles.badgeIcon}>✨</span>
              <span className={styles.badgeText}>
                {daysToRamadan !== null && daysToRamadan > 0
                  ? `Step into Ramadan in ${daysToRamadan} days`
                  : 'Blessed Ramadan is Here'}
              </span>
            </div>
            <h1 className={styles.heroTitle}>
              Elevate Your <span className={styles.gradientText}>Worship</span><br />
              Experience
            </h1>
            <p className={styles.heroDescription}>
              A soulful space to track your prayers, fasting, and Qur'an journey with a community of believers.
            </p>
            <div className={styles.heroActions}>
              <Link href="/quran" className={styles.mainCta}>
                Start My Journey
              </Link>
              <Link href="/groups" className={styles.secondaryCta}>
                Explore Circles
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        <div className={styles.dashboardContainer}>
          {/* Daily Rituals Section */}
          <div className={styles.ritualSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Daily Rituals</h2>
              <p className={styles.sectionSubtitle}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            </div>

            <div className={styles.dashboardGrid}>
              {/* Fasting Achievement Card */}
              <div
                className={`${styles.statusCard} ${todayHabits.isFasting ? styles.statusActive : ''}`}
                onClick={() => handleHabitToggle('isFasting')}
                role="button" aria-pressed={todayHabits.isFasting}
              >
                <div className={styles.statusIcon}>🌙</div>
                <div className={styles.statusContent}>
                  <h3>Sawm (Fasting)</h3>
                  <p>{todayHabits.isFasting ? 'Alhamdulillah, you are fasting today.' : 'Click to log today\'s fast'}</p>
                </div>
                <div className={styles.statusCheck}>
                  <div className={styles.checkCircle}>
                    {todayHabits.isFasting && <span className={styles.checkTick}>✓</span>}
                  </div>
                </div>
              </div>

              {/* Prayer Tracker Card */}
              <div className={styles.prayerCard}>
                <div className={styles.cardHeader}>
                  <h3>Salah (Prayers)</h3>
                  <span className={styles.counter}>{Object.entries(todayHabits).filter(([k, v]) => ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'].includes(k) && v === true).length}/5</span>
                </div>
                <div className={styles.prayerGrid}>
                  {[
                    { id: 'fajr', label: 'Fajr', time: 'Dawn' },
                    { id: 'dhuhr', label: 'Dhuhr', time: 'Noon' },
                    { id: 'asr', label: 'Asr', time: 'After' },
                    { id: 'maghrib', label: 'Maghr', time: 'Sun' },
                    { id: 'isha', label: 'Isha', time: 'Night' }
                  ].map((prayer) => (
                    <button
                      key={prayer.id}
                      className={`${styles.prayerItem} ${todayHabits[prayer.id as keyof typeof todayHabits] ? styles.prayed : ''}`}
                      onClick={() => handleHabitToggle(prayer.id as any)}
                    >
                      <span className={styles.prayerLabel}>{prayer.label}</span>
                      <span className={styles.prayerTime}>{prayer.time}</span>
                      <div className={styles.miniCheck}>
                        {todayHabits[prayer.id as keyof typeof todayHabits] ? '✓' : '+'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Reflection Journal Card */}
              <div className={styles.reflectionCard}>
                <div className={styles.cardHeader}>
                  <h3>Spiritual Journal</h3>
                  {!isEditingNote && todayHabits.note && (
                    <button className={styles.editBtn} onClick={() => setIsEditingNote(true)}>Edit</button>
                  )}
                </div>

                {isEditingNote || !todayHabits.note ? (
                  <div className={styles.journalInputWrapper}>
                    <textarea
                      className={styles.journalInput}
                      placeholder="Reflect on your day, a verse you read, or a prayer you made..."
                      value={todayHabits.note}
                      onChange={(e) => updateHabits({ note: e.target.value })}
                      onBlur={() => setIsEditingNote(false)}
                      autoFocus={isEditingNote}
                    />
                    {isEditingNote && (
                      <button className={styles.saveNoteBtn} onClick={() => setIsEditingNote(false)}>Save Reflection</button>
                    )}
                  </div>
                ) : (
                  <div className={styles.journalDisplay} onClick={() => setIsEditingNote(true)}>
                    <p className={styles.journalText}>{todayHabits.note}</p>
                    <span className={styles.journalHint}>Click to add more to your reflection</span>
                  </div>
                )}
              </div>

              {/* Ramadan Journey Calendar */}
              <div className={styles.calendarCard}>
                <div className={styles.cardHeader}>
                  <h3>Ramadan Journey</h3>
                  <span className={styles.yearLabel}>1447 AH</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem' }}>
                  Each cell shows the <strong>Hijri Day</strong> and its <strong>Gregorian Date</strong>.
                </p>
                <div className={styles.calendarGrid}>
                  {calendarDays.map((day) => (
                    <div
                      key={day.ramadanDay}
                      className={`${styles.dayCell} ${day.isPast ? styles.dayPast : ''} ${day.isToday ? styles.dayCurrent : ''}`}
                      title={`Day ${day.ramadanDay} of Ramadan (${day.date})`}
                    >
                      <span className={styles.hijriDay}>{day.ramadanDay}</span>
                      <span className={styles.gregorianDate}>{day.date}</span>
                      {day.isPast && <div className={styles.dayDot} />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Features Branding */}
      <section className={styles.brandFooter}>
        <div className="container">
          <div className={styles.footerInner}>
            <div className={styles.footerStat}>
              <span className={styles.statVal}>100%</span>
              <span className={styles.statLab}>Privacy</span>
            </div>
            <div className={styles.footerStat}>
              <span className={styles.statVal}>Live</span>
              <span className={styles.statLab}>Synced</span>
            </div>
            <div className={styles.footerStat}>
              <span className={styles.statVal}>AI</span>
              <span className={styles.statLab}>Insights</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

"use client";

import Link from 'next/link';
import { useSocial } from '@/contexts/SocialContext';
import styles from './page.module.css';

export default function Home() {
  const { user } = useSocial();

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <div className={styles.greeting}>
              <span className={styles.moon}>🌙</span>
              <p className={styles.ramadanGreeting}>Ramadan Mubarak</p>
            </div>
            <h1 className={styles.heroTitle}>
              Build Meaningful Habits<br />
              <span className={styles.heroAccent}>Together</span>
            </h1>
            <p className={styles.heroDescription}>
              Track your daily worship, read Qur'an with friends, and grow spiritually this Ramadan—one day at a time.
            </p>
            {user ? (
              <div className={styles.heroActions}>
                <Link href="/quran" className="btn btn-primary">
                  Continue Reading
                </Link>
                <Link href="/groups" className="btn">
                  View My Group
                </Link>
              </div>
            ) : (
              <div className={styles.heroActions}>
                <Link href="/quran" className="btn btn-primary">
                  Start Reading
                </Link>
                <Link href="/groups" className="btn">
                  Join a Group
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Today's Progress */}
      {user && (
        <section className={styles.todaySection}>
          <div className="container">
            <h2 className={styles.sectionTitle}>Today's Progress</h2>
            <div className={styles.progressGrid}>
              <div className={styles.progressCard}>
                <div className={styles.progressIcon}>📖</div>
                <div className={styles.progressInfo}>
                  <p className={styles.progressLabel}>Pages Read</p>
                  <p className={styles.progressValue}>{user.pagesRead} <span className={styles.progressGoal}>/ {user.goal}</span></p>
                </div>
              </div>
              <div className={styles.progressCard}>
                <div className={styles.progressIcon}>📿</div>
                <div className={styles.progressInfo}>
                  <p className={styles.progressLabel}>Verses Completed</p>
                  <p className={styles.progressValue}>{user.versesRead}</p>
                </div>
              </div>
              <div className={styles.progressCard}>
                <div className={styles.progressIcon}>🔥</div>
                <div className={styles.progressInfo}>
                  <p className={styles.progressLabel}>Day Streak</p>
                  <p className={styles.progressValue}>{user.streak} days</p>
                </div>
              </div>
              <div className={styles.progressCard}>
                <div className={styles.progressIcon}>✅</div>
                <div className={styles.progressInfo}>
                  <p className={styles.progressLabel}>Surahs Completed</p>
                  <p className={styles.progressValue}>{user.completedSurahs.length}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section className={styles.featuresSection}>
        <div className="container">
          <div className={styles.featuresHeader}>
            <h2 className={styles.sectionTitle}>Your Spiritual Journey</h2>
            <p className={styles.sectionDescription}>
              Simple tools to help you stay consistent and connected
            </p>
          </div>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📖</div>
              <h3 className={styles.featureTitle}>Read Together</h3>
              <p className={styles.featureDescription}>
                Join reading circles and complete Qur'an goals with friends and family
              </p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📊</div>
              <h3 className={styles.featureTitle}>Track Progress</h3>
              <p className={styles.featureDescription}>
                See your daily habits, streaks, and milestones in a calm, encouraging way
              </p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>👥</div>
              <h3 className={styles.featureTitle}>Stay Motivated</h3>
              <p className={styles.featureDescription}>
                Share progress with your group and encourage each other's journey
              </p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🤲</div>
              <h3 className={styles.featureTitle}>Build Habits</h3>
              <p className={styles.featureDescription}>
                Develop consistent worship routines that last beyond Ramadan
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaCard}>
            <h2 className={styles.ctaTitle}>Ready to Begin?</h2>
            <p className={styles.ctaDescription}>
              Start your journey today. Track your progress, join a group, and make this Ramadan your most meaningful yet.
            </p>
            <div className={styles.ctaActions}>
              <Link href="/quran" className="btn btn-primary">
                Start Reading Qur'an
              </Link>
              <Link href="/groups" className="btn">
                Browse Groups
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

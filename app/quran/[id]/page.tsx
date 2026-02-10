"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getSurah } from '@/lib/quran';
import { Surah, Ayah } from '@/types';
import { useSocial } from '@/contexts/SocialContext';
import styles from './page.module.css';

export default function SurahPage() {
    const { id } = useParams();
    const router = useRouter();
    const [surah, setSurah] = useState<Surah | null>(null);
    const [ayahs, setAyahs] = useState<Ayah[]>([]);
    const [loading, setLoading] = useState(true);
    const { logProgress } = useSocial();

    useEffect(() => {
        async function load() {
            if (!id) return;
            try {
                const data = await getSurah(parseInt(id as string));
                if (data) {
                    setSurah(data.surah);
                    setAyahs(data.ayahs);
                }
            } catch (error) {
                console.error("Failed to load surah", error);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [id]);

    const handleFinish = () => {
        if (!surah) return;
        const estimatedPages = Math.ceil(ayahs.length / 15);
        logProgress({
            pages: estimatedPages,
            surahId: surah.number,
            surahName: surah.englishName,
            versesCount: ayahs.length
        });
        router.push('/groups');
    };

    if (loading) {
        return (
            <div className={styles.loading}>
                <p>Loading Surah...</p>
            </div>
        );
    }

    if (!surah) {
        return (
            <div className="container p-8 text-center">
                <h2>Surah not found</h2>
                <Link href="/quran" className="btn btn-primary mt-4">Go back to Quran</Link>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div className={styles.headerContainer}>
                    <Link href="/quran" className={styles.backLink}>
                        <span>←</span> Back
                    </Link>
                    <div className={styles.surahTitleInfo}>
                        <h1 className={styles.surahName}>{surah.englishName}</h1>
                        <p className={styles.surahTranslation}>
                            {surah.englishNameTranslation} • {surah.numberOfAyahs} Ayahs • <span className={styles.revelationType}>{surah.revelationType}</span>
                        </p>
                    </div>
                    <div style={{ width: '60px' }}></div> {/* Spacer for symmetry */}
                </div>
            </div>

            <main className={styles.content}>
                {surah.number !== 1 && surah.number !== 9 && (
                    <div className={styles.bismillah}>
                        ﷽
                    </div>
                )}

                <div className={styles.ayahList}>
                    {ayahs.map((ayah) => (
                        <div key={ayah.number} className={styles.ayahCard}>
                            <div className={styles.ayahTop}>
                                <div className={styles.ayahNumber}>
                                    {surah.number}:{ayah.numberInSurah}
                                </div>
                            </div>
                            <div className={styles.arabicText}>
                                {ayah.text}
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            <div className={styles.footerActions}>
                <div className={styles.floatingBar}>
                    <button className="btn btn-secondary" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        Top
                    </button>
                    <button className="btn btn-primary" onClick={handleFinish}>
                        Mark as Read
                    </button>
                </div>
            </div>
        </div>
    );
}

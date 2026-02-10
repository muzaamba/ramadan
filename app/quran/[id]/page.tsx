"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getSurah } from '@/lib/quran';
import { Surah, Ayah } from '@/types';
import { useSocial } from '@/contexts/SocialContext';
import styles from './page.module.css';

export default function SurahPage() {
    const { id } = useParams();
    const [surah, setSurah] = useState<Surah | null>(null);
    const [ayahs, setAyahs] = useState<Ayah[]>([]);
    const { logProgress } = useSocial();
    const router = useRouter();

    useEffect(() => {
        async function load() {
            if (!id) return;
            const data = await getSurah(parseInt(id as string));
            if (data) {
                setSurah(data.surah);
                setAyahs(data.ayahs);
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
            versesCount: surah.numberOfAyahs
        });
        router.push('/groups');
    };

    if (!surah) return <div className={styles.loading}>Loading Surah...</div>;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <button onClick={() => router.back()} className={styles.backBtn}>
                    ← Back
                </button>
                <div className={styles.headerTitle}>
                    <h1>{surah.englishName}</h1>
                    <p>{surah.englishNameTranslation} • {surah.numberOfAyahs} Ayahs</p>
                </div>
                <button className="btn btn-primary" onClick={handleFinish}>
                    Mark Complete
                </button>
            </header>

            <div className={styles.content}>
                <div className={styles.bismillah}>
                    ﷽
                </div>
                {ayahs.map((ayah) => (
                    <div key={ayah.number} className={styles.ayahContainer}>
                        <div className={styles.ayahNumber}>{ayah.numberInSurah}</div>
                        <p className={styles.ayahText}>{ayah.text}</p>
                    </div>
                ))}
            </div>

            <div className={styles.footer}>
                <button className="btn btn-secondary w-full" onClick={handleFinish}>
                    Finish Reading Session ({Math.ceil(ayahs.length / 15)} pages equivalent)
                </button>
            </div>
        </div>
    );
}

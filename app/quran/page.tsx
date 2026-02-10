"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAllSurahs } from '@/lib/quran';
import { Surah } from '@/types';
import styles from './page.module.css';

export default function QuranIndex() {
    const [surahs, setSurahs] = useState<Surah[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const data = await getAllSurahs();
            setSurahs(data);
            setLoading(false);
        }
        load();
    }, []);

    if (loading) return <div className="container p-8">Loading Quran...</div>;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>The Noble Quran</h1>
            <div className={styles.grid}>
                {surahs.map((surah) => (
                    <Link href={`/quran/${surah.number}`} key={surah.number} className={styles.card}>
                        <div className={styles.number}>{surah.number}</div>
                        <div className={styles.info}>
                            <div className={styles.name}>{surah.englishName}</div>
                            <div className={styles.translation}>{surah.englishNameTranslation}</div>
                        </div>
                        <div className={styles.arabicName}>{surah.name}</div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

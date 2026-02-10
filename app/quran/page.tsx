"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAllSurahs } from '@/lib/quran';
import { Surah } from '@/types';
import styles from './page.module.css';

export default function QuranIndex() {
    const [surahs, setSurahs] = useState<Surah[]>([]);
    const [filteredSurahs, setFilteredSurahs] = useState<Surah[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const data = await getAllSurahs();
                setSurahs(data);
                setFilteredSurahs(data);
            } catch (error) {
                console.error("Failed to load surahs", error);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    useEffect(() => {
        const results = surahs.filter(s =>
            s.englishName.toLowerCase().includes(search.toLowerCase()) ||
            s.number.toString().includes(search) ||
            s.englishNameTranslation.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredSurahs(results);
    }, [search, surahs]);

    if (loading) {
        return (
            <div className="container" style={{ paddingTop: '5rem', textAlign: 'center' }}>
                <p className="text-secondary">Loading the Noble Quran...</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className="container">
                <div className={styles.titleSection}>
                    <h1 className={styles.title}>The Noble Quran</h1>
                    <p className={styles.subtitle}>Read and track your progress through the holy book</p>
                </div>

                <div className={styles.searchBar}>
                    <span className={styles.searchIcon}>🔍</span>
                    <input
                        type="text"
                        placeholder="Search by Surah name or number..."
                        className={styles.searchInput}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className={styles.grid}>
                    {filteredSurahs.map((surah) => (
                        <Link href={`/quran/${surah.number}`} key={surah.number} className={styles.card}>
                            <div className={styles.number}>
                                <span>{surah.number}</span>
                            </div>
                            <div className={styles.info}>
                                <div className={styles.name}>{surah.englishName}</div>
                                <div className={styles.translation}>{surah.englishNameTranslation}</div>
                            </div>
                            <div className={styles.arabicName}>{surah.name}</div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

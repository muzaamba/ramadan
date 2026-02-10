import { Surah, Ayah } from '@/types';

const API_BASE = 'https://api.alquran.cloud/v1';

export async function getAllSurahs(): Promise<Surah[]> {
    try {
        const res = await fetch(`${API_BASE}/surah`);
        const data = await res.json();
        return data.data;
    } catch (error) {
        console.error("Failed to fetch surahs", error);
        return [];
    }
}

export async function getSurah(id: number): Promise<{ surah: Surah, ayahs: Ayah[] } | null> {
    try {
        const res = await fetch(`${API_BASE}/surah/${id}`);
        const data = await res.json();
        return {
            surah: data.data,
            ayahs: data.data.ayahs
        };
    } catch (error) {
        console.error(`Failed to fetch surah ${id}`, error);
        return null;
    }
}

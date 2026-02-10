export interface Surah {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    numberOfAyahs: number;
    revelationType: string;
}

export interface Ayah {
    number: number;
    text: string;
    numberInSurah: number;
    juz: number;
    manzil: number;
    page: number;
    ruku: number;
    hizbQuarter: number;
    sajda: boolean;
}

export interface User {
    id: string;
    name: string;
    avatar?: string;
    pagesRead: number;
    versesRead: number;
    completedSurahs: number[]; // surah IDs
    goal: number; // pages per day
    streak: number;
    lastActive: string;
}

export interface GroupGoal {
    id: string;
    title: string;
    description: string;
    targetType: 'surah' | 'pages';
    targetValue: number; // surahId or pageCount
    deadline?: string;
    postedBy: string; // admin user ID
    participantsCompleted: string[]; // user IDs
}

export interface Activity {
    id: string;
    userId: string;
    userName: string;
    action: string; // "read 5 pages", "finished Surah Yasin"
    timestamp: string;
    isAiAnalysis?: boolean;
}

export interface Group {
    id: string;
    name: string;
    description: string;
    members: string[]; // user IDs
    createdBy: string;
    createdAt: string;
    isPublic: boolean;
    inviteCode: string;
}

export const PRESET_GOALS = [
    { title: 'Read Surah Al-Kahf', description: 'Friday Sunnah', targetType: 'surah' as const, targetValue: 18 },
    { title: 'Read Surah Yasin', description: 'Heart of the Quran', targetType: 'surah' as const, targetValue: 36 },
    { title: 'Read Surah Al-Mulk', description: 'Protection from the grave', targetType: 'surah' as const, targetValue: 67 },
    { title: 'Read Surah Al-Baqarah', description: 'The longest Surah', targetType: 'surah' as const, targetValue: 2 },
    { title: 'Read 10 Pages Daily', description: 'Daily commitment', targetType: 'pages' as const, targetValue: 10 },
    { title: 'Complete a Juz', description: 'Read 20 pages', targetType: 'pages' as const, targetValue: 20 },
];

// Somali AI Messages
export const SOMALI_AI_MESSAGES = {
    surahCompleted: (userName: string, surahName: string, versesCount: number) =>
        `Mashaa Allah! ${userName} ayaa dhammaystay ${surahName}. Taasi waa ${versesCount} aayood oo lagu daray xisaabtayada guud!`,
    goalCompleted: (userName: string, goalTitle: string) =>
        `Hambalyo! ${userName} ayaa dhammaystay hadafka "${goalTitle}"! Allaha ka aqbalo!`,
    groupCreated: (userName: string, groupName: string) =>
        `${userName} ayaa abuuray koox cusub: ${groupName}. Soo biira oo wadaag ujeedada wanaagsan!`,
    memberJoined: (userName: string, groupName: string) =>
        `${userName} ayaa ku soo biiray ${groupName}. Soo dhawoow walaal!`,
};

"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Activity, GroupGoal, Group, PRESET_GOALS, SOMALI_AI_MESSAGES } from '@/types';

interface LogData {
    pages: number;
    surahId?: number;
    surahName?: string;
    versesCount?: number;
}

interface SocialContextType {
    user: User | null;
    currentGroup: Group | null;
    availableGroups: Group[];
    groupMembers: User[];
    activities: Activity[];
    goals: GroupGoal[];
    setUserGoal: (pages: number) => void;
    logProgress: (data: LogData) => void;
    joinGroup: (groupId: string) => void;
    joinGroupByCode: (inviteCode: string) => void;
    leaveGroup: () => void;
    createGroup: (name: string, description: string, isPublic: boolean) => void;
    addGoal: (goal: Omit<GroupGoal, 'id' | 'participantsCompleted' | 'postedBy'>) => void;
}

const SocialContext = createContext<SocialContextType | undefined>(undefined);

const FAKE_USERS: User[] = [
    { id: '2', name: 'Ali', pagesRead: 45, versesRead: 850, completedSurahs: [1, 18], goal: 10, streak: 5, lastActive: '2m ago' },
    { id: '3', name: 'Fatima', pagesRead: 62, versesRead: 1200, completedSurahs: [1, 36, 67], goal: 20, streak: 12, lastActive: '1h ago' },
    { id: '4', name: 'Omar', pagesRead: 30, versesRead: 400, completedSurahs: [1], goal: 5, streak: 3, lastActive: '5h ago' },
];

const INITIAL_GOALS: GroupGoal[] = [
    {
        id: 'g1',
        title: 'Friday Sunnah',
        description: 'Read Surah Al-Kahf',
        targetType: 'surah',
        targetValue: 18,
        postedBy: 'admin',
        participantsCompleted: ['2', '3']
    }
];

const INITIAL_GROUPS: Group[] = [
    {
        id: 'g1',
        name: 'Ramadan 2026 Challenge',
        description: 'Race towards good deeds together',
        members: ['1', '2', '3', '4'],
        createdBy: 'admin',
        createdAt: new Date().toISOString(),
        isPublic: true,
        inviteCode: 'RAMADAN2026'
    }
];

export function SocialProvider({ children }: { children: ReactNode }) {
    // Initialize state lazily to avoid hydration mismatch while loading from localStorage
    const [user, setUser] = useState<User | null>(null);
    const [availableGroups, setAvailableGroups] = useState<Group[]>(INITIAL_GROUPS);
    const [currentGroup, setCurrentGroup] = useState<Group | null>(INITIAL_GROUPS[0]);
    const [groupMembers, setGroupMembers] = useState<User[]>(FAKE_USERS);
    const [goals, setGoals] = useState<GroupGoal[]>(INITIAL_GOALS);
    const [activities, setActivities] = useState<Activity[]>([
        { id: '1', userId: '2', userName: 'Ali', action: 'read 5 pages', timestamp: '2m ago' },
        { id: '2', userId: '3', userName: 'Fatima', action: 'finished Surah Al-Kahf', timestamp: '1h ago' },
    ]);

    useEffect(() => {
        // Run once on mount to load persisted user
        const storedUser = localStorage.getItem('deen_user_v2');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            const newUser: User = {
                id: '1',
                name: 'You',
                pagesRead: 0,
                versesRead: 0,
                completedSurahs: [],
                goal: 10,
                streak: 0,
                lastActive: 'Just now'
            };
            setUser(newUser);
            localStorage.setItem('deen_user_v2', JSON.stringify(newUser));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const setUserGoal = (goal: number) => {
        if (!user) return;
        const updatedUser = { ...user, goal };
        setUser(updatedUser);
        localStorage.setItem('deen_user_v2', JSON.stringify(updatedUser));
    };

    const generateInviteCode = () => {
        return Math.random().toString(36).substring(2, 10).toUpperCase();
    };

    const createGroup = (name: string, description: string, isPublic: boolean) => {
        if (!user) return;
        const newGroup: Group = {
            id: Date.now().toString(),
            name,
            description,
            members: [user.id],
            createdBy: user.id,
            createdAt: new Date().toISOString(),
            isPublic,
            inviteCode: generateInviteCode()
        };
        setAvailableGroups([newGroup, ...availableGroups]);
        setCurrentGroup(newGroup);

        // AI Message in Somali
        setActivities(prev => [{
            id: Date.now().toString(),
            userId: 'ai',
            userName: 'Deen AI',
            action: SOMALI_AI_MESSAGES.groupCreated(user.name, name),
            timestamp: 'Just now',
            isAiAnalysis: true
        }, {
            id: (Date.now() + 1).toString(),
            userId: user.id,
            userName: user.name,
            action: `created a new group: ${name}`,
            timestamp: 'Just now'
        }, ...prev]);
    };

    const joinGroup = (groupId: string) => {
        if (!user) return;
        const group = availableGroups.find(g => g.id === groupId);
        if (!group) return;

        // Add user to group if not already a member
        if (!group.members.includes(user.id)) {
            const updatedGroup = { ...group, members: [...group.members, user.id] };
            setAvailableGroups(availableGroups.map(g => g.id === groupId ? updatedGroup : g));
        }

        setCurrentGroup(group);

        // AI Message in Somali
        setActivities(prev => [{
            id: Date.now().toString(),
            userId: 'ai',
            userName: 'Deen AI',
            action: SOMALI_AI_MESSAGES.memberJoined(user.name, group.name),
            timestamp: 'Just now',
            isAiAnalysis: true
        }, ...prev]);
    };

    const joinGroupByCode = (inviteCode: string) => {
        if (!user) return;
        const group = availableGroups.find(g => g.inviteCode === inviteCode.toUpperCase());
        if (!group) {
            alert('Invalid invite code!');
            return;
        }
        joinGroup(group.id);
    };

    const leaveGroup = () => {
        if (!user || !currentGroup) return;
        const updatedGroup = {
            ...currentGroup,
            members: currentGroup.members.filter(id => id !== user.id)
        };
        setAvailableGroups(availableGroups.map(g => g.id === currentGroup.id ? updatedGroup : g));
        setCurrentGroup(null);
    };

    const addGoal = (goalData: Omit<GroupGoal, 'id' | 'participantsCompleted' | 'postedBy'>) => {
        const newGoal: GroupGoal = {
            ...goalData,
            id: Date.now().toString(),
            postedBy: 'admin', // Demo: Assume current user is admin/admin posted
            participantsCompleted: []
        };
        setGoals([newGoal, ...goals]);

        // Add activity
        setActivities(prev => [{
            id: Date.now().toString(),
            userId: 'admin',
            userName: 'Admin',
            action: `posted a new goal: ${goalData.title}`,
            timestamp: 'Just now'
        }, ...prev]);
    };

    const logProgress = ({ pages, surahId, surahName, versesCount = 0 }: LogData) => {
        if (!user) return;

        const newSurahs = [...user.completedSurahs];
        if (surahId && !newSurahs.includes(surahId)) {
            newSurahs.push(surahId);
        }

        const updatedUser = {
            ...user,
            pagesRead: user.pagesRead + pages,
            versesRead: user.versesRead + versesCount,
            completedSurahs: newSurahs,
            lastActive: 'Just now',
            streak: user.streak + (pages > 0 ? 1 : 0)
        };
        setUser(updatedUser);
        localStorage.setItem('deen_user_v2', JSON.stringify(updatedUser));

        // Check Goals
        const completedGoalIds: string[] = [];
        const updatedGoals = goals.map(g => {
            let completed = false;
            // Check if user already completed it
            if (g.participantsCompleted.includes(user.id)) return g;

            if (g.targetType === 'surah' && surahId === g.targetValue) {
                completed = true;
            }
            // Simple logic for pages goal - doesn't track specific page count for the goal, just cumulative
            // Real app would need "GoalProgress" tracking

            if (completed) {
                completedGoalIds.push(g.id);
                return { ...g, participantsCompleted: [...g.participantsCompleted, user.id] };
            }
            return g;
        });

        if (completedGoalIds.length > 0) {
            setGoals(updatedGoals);
        }

        // Add User Activity
        const newActivities: Activity[] = [{
            id: Date.now().toString(),
            userId: user.id,
            userName: user.name,
            action: surahName ? `read Surah ${surahName} (${versesCount} verses)` : `read ${pages} pages`,
            timestamp: 'Just now'
        }];

        // AI Logic: Analyze the progress
        // 1. Check for Surah completion - Somali AI
        if (surahName && versesCount > 20) {
            newActivities.unshift({
                id: (Date.now() + 1).toString(),
                userId: 'ai',
                userName: 'Deen AI',
                action: SOMALI_AI_MESSAGES.surahCompleted(user.name, surahName, versesCount),
                timestamp: 'Just now',
                isAiAnalysis: true
            });
        }

        // 2. Check for Goals - Somali AI
        if (completedGoalIds.length > 0) {
            const completedGoal = goals.find(g => g.id === completedGoalIds[0]);
            if (completedGoal) {
                newActivities.unshift({
                    id: (Date.now() + 2).toString(),
                    userId: 'ai',
                    userName: 'Deen AI',
                    action: SOMALI_AI_MESSAGES.goalCompleted(user.name, completedGoal.title),
                    timestamp: 'Just now',
                    isAiAnalysis: true
                });
            }
        }

        setActivities(prev => [...newActivities, ...prev]);
    };

    return (
        <SocialContext.Provider value={{
            user,
            currentGroup,
            availableGroups,
            groupMembers,
            activities,
            goals,
            setUserGoal,
            logProgress,
            joinGroup,
            joinGroupByCode,
            leaveGroup,
            createGroup,
            addGoal
        }}>
            {children}
        </SocialContext.Provider>
    );
}

export function useSocial() {
    const context = useContext(SocialContext);
    if (context === undefined) {
        throw new Error('useSocial must be used within a SocialProvider');
    }
    return context;
}

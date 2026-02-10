"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Activity, GroupGoal, Group, PRESET_GOALS, SOMALI_AI_MESSAGES, ChatMessage } from '@/types';
import { supabase } from '@/lib/supabase';

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
    chatMessages: ChatMessage[];
    sendChatMessage: (text: string) => void;
    setUserGoal: (pages: number) => void;
    logProgress: (data: LogData) => void;
    joinGroup: (groupId: string) => void;
    joinGroupByCode: (inviteCode: string) => void;
    leaveGroup: () => void;
    signOut: () => void;
    createGroup: (name: string, description: string, isPublic: boolean) => void;
    addGoal: (goal: Omit<GroupGoal, 'id' | 'groupId' | 'participantsCompleted' | 'postedBy'>) => void;
}

const SocialContext = createContext<SocialContextType | undefined>(undefined);

const GUEST_USER: User = {
    id: '1',
    name: 'Guest User',
    pagesRead: 0,
    versesRead: 0,
    completedSurahs: [],
    goal: 10,
    streak: 0,
    lastActive: 'Just now'
};

export function SocialProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(GUEST_USER);
    const [availableGroups, setAvailableGroups] = useState<Group[]>([]);
    const [currentGroup, setCurrentGroup] = useState<Group | null>(null);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [goals, setGoals] = useState<GroupGoal[]>([]);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [groupMembers, setGroupMembers] = useState<User[]>([]);

    const currentGroupGoals = goals.filter(g => g.groupId === currentGroup?.id);
    const currentGroupActivities = activities.filter(a => a.groupId === currentGroup?.id);
    const currentGroupMessages = chatMessages.filter(m => m.groupId === currentGroup?.id);

    useEffect(() => {
        const initialize = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                await fetchProfileOrCreate(session.user);
                await fetchGroups();
            }
        };

        initialize();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
                await fetchProfileOrCreate(session.user);
                await fetchGroups();
            } else {
                setUser(GUEST_USER);
                setCurrentGroup(null);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        if (!currentGroup) return;

        // Subscriptions for realtime
        const activitySub = supabase
            .channel(`activities:${currentGroup.id}`)
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'activities', filter: `group_id=eq.${currentGroup.id}` },
                payload => {
                    const newActivity = payload.new as any;
                    setActivities(prev => [{
                        id: newActivity.id,
                        groupId: newActivity.group_id,
                        userId: newActivity.user_id,
                        userName: newActivity.user_name,
                        action: newActivity.action,
                        timestamp: newActivity.timestamp,
                        isAiAnalysis: newActivity.is_ai_analysis
                    }, ...prev]);
                })
            .subscribe();

        const chatSub = supabase
            .channel(`chat:${currentGroup.id}`)
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `group_id=eq.${currentGroup.id}` },
                payload => {
                    const newMsg = payload.new as any;
                    setChatMessages(prev => [...prev, {
                        id: newMsg.id,
                        groupId: newMsg.group_id,
                        userId: newMsg.user_id,
                        userName: newMsg.user_name,
                        text: newMsg.text,
                        timestamp: newMsg.timestamp,
                        isAi: newMsg.is_ai
                    }]);
                })
            .subscribe();

        fetchGroupData(currentGroup.id);

        return () => {
            activitySub.unsubscribe();
            chatSub.unsubscribe();
        };
    }, [currentGroup]);

    const fetchProfileOrCreate = async (authUser: any) => {
        let { data, error } = await supabase.from('profiles').select('*').eq('id', authUser.id).maybeSingle();

        // If profile doesn't exist, create it (safe fallback)
        if (!data && !error) {
            const { data: newData, error: insertError } = await supabase.from('profiles').insert({
                id: authUser.id,
                name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
                goal: 10,
                pages_read: 0,
                verses_read: 0,
                completed_surahs: [],
                streak: 0
            }).select().single();

            if (newData) data = newData;
        }

        if (data) {
            setUser({
                id: data.id,
                name: data.name,
                pagesRead: data.pages_read,
                versesRead: data.verses_read,
                completedSurahs: data.completed_surahs,
                goal: data.goal,
                streak: data.streak,
                lastActive: data.last_active
            });
        }
    };

    const fetchGroups = async () => {
        const { data } = await supabase.from('groups').select('*');
        if (data) {
            const mappedGroups: Group[] = data.map((g: any) => ({
                id: g.id,
                name: g.name,
                description: g.description,
                isPublic: g.is_public,
                inviteCode: g.invite_code,
                createdBy: g.created_by,
                createdAt: g.created_at,
                members: []
            }));
            setAvailableGroups(mappedGroups);
        }
    };

    const fetchGroupData = async (groupId: string) => {
        const [goalsRes, activitiesRes, messagesRes, membersRes] = await Promise.all([
            supabase.from('goals').select('*').eq('group_id', groupId),
            supabase.from('activities').select('*').eq('group_id', groupId).order('timestamp', { ascending: false }),
            supabase.from('chat_messages').select('*').eq('group_id', groupId).order('timestamp', { ascending: true }),
            supabase.from('group_members').select('profiles(*)').eq('group_id', groupId)
        ]);

        if (goalsRes.data) {
            const mappedGoals: GroupGoal[] = goalsRes.data.map((g: any) => ({
                id: g.id,
                groupId: g.group_id,
                title: g.title,
                description: g.description,
                targetType: g.target_type,
                targetValue: g.target_value,
                postedBy: g.posted_by,
                participantsCompleted: []
            }));
            setGoals(mappedGoals);
        }

        if (activitiesRes.data) {
            const mappedActivities: Activity[] = activitiesRes.data.map((a: any) => ({
                id: a.id,
                groupId: a.group_id,
                userId: a.user_id,
                userName: a.user_name,
                action: a.action,
                timestamp: a.timestamp,
                isAiAnalysis: a.is_ai_analysis
            }));
            setActivities(mappedActivities);
        }

        if (messagesRes.data) {
            const mappedMessages: ChatMessage[] = messagesRes.data.map((m: any) => ({
                id: m.id,
                groupId: m.group_id,
                userId: m.user_id,
                userName: m.user_name,
                text: m.text,
                timestamp: m.timestamp,
                isAi: m.is_ai
            }));
            setChatMessages(mappedMessages);
        }
        if (membersRes.data) {
            const members = (membersRes.data as any).map((m: any) => ({
                id: m.profiles.id,
                name: m.profiles.name,
                pagesRead: m.profiles.pages_read,
                versesRead: m.profiles.verses_read,
                completedSurahs: m.profiles.completed_surahs,
                goal: m.profiles.goal,
                streak: m.profiles.streak,
                lastActive: m.profiles.last_active
            }));
            setGroupMembers(members);
        }
    };

    const setUserGoal = async (goal: number) => {
        if (!user || user.id === '1') return;
        const { error } = await supabase.from('profiles').update({ goal }).eq('id', user.id);
        if (!error) setUser({ ...user, goal });
    };

    const createGroup = async (name: string, description: string, isPublic: boolean) => {
        if (!user || user.id === '1') return;
        const inviteCode = Math.random().toString(36).substring(2, 10).toUpperCase();
        const { data, error } = await supabase.from('groups').insert({
            name, description, is_public: isPublic, invite_code: inviteCode, created_by: user.id
        }).select().single();

        if (data) {
            await supabase.from('group_members').insert({ group_id: data.id, user_id: user.id });
            const mapped: Group = {
                id: data.id,
                name: data.name,
                description: data.description,
                isPublic: data.is_public,
                inviteCode: data.invite_code,
                createdBy: data.created_by,
                createdAt: data.created_at,
                members: [user.id]
            };
            setAvailableGroups([mapped, ...availableGroups]);
            setCurrentGroup(mapped);
            sendAiChatMessage(SOMALI_AI_MESSAGES.groupCreated(user.name, name), data.id);
        }
    };

    const joinGroup = async (groupId: string) => {
        if (!user || user.id === '1') {
            alert('Please sign in to join groups');
            return;
        }
        const { error } = await supabase.from('group_members').insert({ group_id: groupId, user_id: user.id });
        if (!error) {
            const { data: group } = await supabase.from('groups').select('*').eq('id', groupId).single();
            if (group) {
                const mapped: Group = {
                    id: group.id,
                    name: group.name,
                    description: group.description,
                    isPublic: group.is_public,
                    inviteCode: group.invite_code,
                    createdBy: group.created_by,
                    createdAt: group.created_at,
                    members: []
                };
                setCurrentGroup(mapped);
                sendAiChatMessage(SOMALI_AI_MESSAGES.memberJoined(user.name, group.name), groupId);
                fetchGroups();
            }
        }
    };

    const joinGroupByCode = async (inviteCode: string) => {
        const { data } = await supabase.from('groups').select('*').eq('invite_code', inviteCode.toUpperCase()).single();
        if (data) await joinGroup(data.id);
        else alert('Invalid code!');
    };

    const leaveGroup = async () => {
        if (!user || !currentGroup) return;
        await supabase.from('group_members').delete().eq('group_id', currentGroup.id).eq('user_id', user.id);
        setCurrentGroup(null);
    };

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    const addGoal = async (goalData: any) => {
        if (!user || !currentGroup) return;
        const { data } = await supabase.from('goals').insert({
            ...goalData, group_id: currentGroup.id, posted_by: user.id
        }).select().single();

        if (data) {
            const mapped: GroupGoal = {
                id: data.id,
                groupId: data.group_id,
                title: data.title,
                description: data.description,
                targetType: data.target_type,
                targetValue: data.target_value,
                postedBy: data.posted_by,
                participantsCompleted: []
            };
            setGoals([mapped, ...goals]);
            sendAiChatMessage(`New Goal Posted: **${goalData.title}**. Who's ready to complete this? 🤲`, currentGroup.id);
        }
    };

    const sendAiChatMessage = async (text: string, groupId: string) => {
        await supabase.from('chat_messages').insert({ group_id: groupId, user_id: 'ai', user_name: 'Deen AI', text, is_ai: true });
    };

    const sendChatMessage = async (text: string) => {
        if (!user || !currentGroup) return;
        await supabase.from('chat_messages').insert({ group_id: currentGroup.id, user_id: user.id, user_name: user.name, text });

        if (text.toLowerCase().includes('inshalla') || text.toLowerCase().includes('ameen')) {
            setTimeout(() => sendAiChatMessage(`Aamiin! Allah ha inaga wada aqbalo dadaalka aan samaynayno.`, currentGroup.id), 1000);
        }
    };

    const logProgress = async ({ pages, surahId, surahName, versesCount = 0 }: LogData) => {
        if (!user || user.id === '1') return;

        const updatedSurahs = surahId && !user.completedSurahs.includes(surahId) ? [...user.completedSurahs, surahId] : user.completedSurahs;

        await supabase.from('profiles').update({
            pages_read: user.pagesRead + pages,
            verses_read: user.versesRead + versesCount,
            completed_surahs: updatedSurahs,
            last_active: new Date().toISOString()
        }).eq('id', user.id);

        const { data: memberOf } = await supabase.from('group_members').select('group_id').eq('user_id', user.id);

        if (memberOf) {
            for (const { group_id } of memberOf) {
                await supabase.from('activities').insert({
                    group_id, user_id: user.id, user_name: user.name,
                    action: surahName ? `read Surah ${surahName} (${versesCount} verses)` : `read ${pages} pages`
                });

                if (surahName && versesCount > 20) {
                    await supabase.from('activities').insert({
                        group_id, user_id: 'ai', user_name: 'Deen AI', is_ai_analysis: true,
                        action: SOMALI_AI_MESSAGES.surahCompleted(user.name, surahName, versesCount)
                    });
                }
            }
        }

        fetchProfileOrCreate({ id: user.id });
    };

    const leaderboardMembers = [...groupMembers, ...(user && user.id !== '1' ? [user] : [])]
        .filter((v, i, a) => a.findIndex(v2 => (v2.id === v.id)) === i);

    return (
        <SocialContext.Provider value={{
            user,
            currentGroup,
            availableGroups,
            groupMembers: leaderboardMembers,
            activities: currentGroupActivities,
            goals: currentGroupGoals,
            chatMessages: currentGroupMessages,
            sendChatMessage,
            setUserGoal,
            logProgress,
            joinGroup,
            joinGroupByCode,
            leaveGroup,
            signOut,
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

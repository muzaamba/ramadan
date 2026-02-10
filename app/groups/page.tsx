"use client";

import { useSocial } from '@/contexts/SocialContext';
import { PRESET_GOALS } from '@/types';
import { useState } from 'react';
import styles from './page.module.css';

export default function GroupsPage() {
    const { user, currentGroup, availableGroups, groupMembers, activities, goals, chatMessages, sendChatMessage, joinGroup, joinGroupByCode, leaveGroup, createGroup, addGoal } = useSocial();
    const [showGroupModal, setShowGroupModal] = useState(false);
    const [showGoalModal, setShowGoalModal] = useState(false);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [showJoinByCodeModal, setShowJoinByCodeModal] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');
    const [newGroupDesc, setNewGroupDesc] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [inviteCode, setInviteCode] = useState('');
    const [copiedCode, setCopiedCode] = useState(false);
    const [customGoalTitle, setCustomGoalTitle] = useState('');
    const [customGoalDesc, setCustomGoalDesc] = useState('');
    const [customGoalType, setCustomGoalType] = useState<'surah' | 'pages'>('pages');
    const [customGoalValue, setCustomGoalValue] = useState(1);
    const [chatText, setChatText] = useState('');

    const sortedMembers = [...groupMembers, ...(user ? [user] : [])]
        .filter((v, i, a) => a.findIndex(v2 => (v2.id === v.id)) === i)
        .sort((a, b) => b.pagesRead - a.pagesRead);

    const handleCreateGroup = () => {
        if (newGroupName.trim()) {
            createGroup(newGroupName, newGroupDesc || 'A new study group', isPublic);
            setNewGroupName('');
            setNewGroupDesc('');
            setIsPublic(true);
            setShowGroupModal(false);
        }
    };

    const handleSelectPresetGoal = (preset: typeof PRESET_GOALS[0]) => {
        addGoal(preset);
        setShowGoalModal(false);
    };

    const handleCreateCustomGoal = () => {
        if (customGoalTitle.trim()) {
            addGoal({
                title: customGoalTitle,
                description: customGoalDesc || 'Personal goal for the group',
                targetType: customGoalType,
                targetValue: customGoalValue || 1,
            });
            setCustomGoalTitle('');
            setCustomGoalDesc('');
            setShowGoalModal(false);
        }
    };

    const handleCopyInviteLink = () => {
        if (!currentGroup) return;
        const inviteLink = `${window.location.origin}/groups?invite=${currentGroup.inviteCode}`;
        navigator.clipboard.writeText(inviteLink);
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
    };

    const handleJoinByCode = () => {
        if (inviteCode.trim()) {
            joinGroupByCode(inviteCode);
            setInviteCode('');
            setShowJoinByCodeModal(false);
        }
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (chatText.trim()) {
            sendChatMessage(chatText);
            setChatText('');
        }
    };

    return (
        <div className={styles.container}>
            {/* Hero Section */}
            <div className={styles.hero}>
                <div className={styles.heroContent}>
                    <div className={styles.groupBadge}>
                        {currentGroup?.isPublic ? '🌍 Public Group' : '🔒 Private Group'}
                    </div>
                    <h1 className={styles.heroTitle}>{currentGroup?.name || 'Ramadan Circles'}</h1>
                    <p className={styles.heroSubtitle}>{currentGroup?.description || 'Learn and grow together with the community'}</p>
                    <div className={styles.heroStats}>
                        <div className={styles.statBox}>
                            <span className={styles.statNumber}>{currentGroup?.members.length || 0}</span>
                            <span className={styles.statLabel}>Members</span>
                        </div>
                        <div className={styles.statBox}>
                            <span className={styles.statNumber}>{goals.length}</span>
                            <span className={styles.statLabel}>Goals</span>
                        </div>
                        <div className={styles.statBox}>
                            <span className={styles.statNumber}>{sortedMembers.reduce((sum, m) => sum + m.pagesRead, 0)}</span>
                            <span className={styles.statLabel}>Pages</span>
                        </div>
                    </div>
                </div>
                <div className={styles.heroActions}>
                    <button className="btn btn-primary" onClick={() => setShowGoalModal(true)}>
                        + New Goal
                    </button>
                    {currentGroup && (
                        <button className="btn btn-primary" onClick={() => setShowInviteModal(true)} style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                            📤 Share Invite
                        </button>
                    )}
                    <button className="btn btn-primary" onClick={() => setShowGroupModal(true)} style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                        🔄 Switch Group
                    </button>
                    <button className="btn btn-primary" onClick={() => setShowJoinByCodeModal(true)} style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                        🔗 Join by Code
                    </button>
                    {currentGroup && (
                        <button className={styles.leaveBtn} onClick={leaveGroup}>
                            Leave Group
                        </button>
                    )}
                </div>
            </div>

            <div className="container">
                {/* Active Goals Section */}
                {goals.length > 0 && (
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>🎯 Active Goals</h2>
                        <div className={styles.goalsGrid}>
                            {goals.map(goal => (
                                <div key={goal.id} className={styles.goalCard}>
                                    <div className={styles.goalHeader}>
                                        <h3>{goal.title}</h3>
                                        <span className={styles.goalBadge}>{goal.participantsCompleted.length} ✓</span>
                                    </div>
                                    <p className={styles.goalDesc}>{goal.description}</p>
                                    <div className={styles.participantsRow}>
                                        {goal.participantsCompleted.map((uid) => {
                                            const member = sortedMembers.find(m => m.id === uid);
                                            return (
                                                <div key={uid} className={styles.participantTag}>
                                                    <span className={styles.checkIcon}>✓</span>
                                                    {uid === user?.id ? 'You' : member?.name || 'User'}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Main Content Grid */}
                <div className={styles.grid}>
                    {/* Leaderboard */}
                    <div className="card">
                        <h2 className={styles.cardTitle}>🏆 Leaderboard</h2>
                        <div className={styles.leaderboard}>
                            {sortedMembers.slice(0, 10).map((member, index) => (
                                <div key={member.id} className={styles.leaderRow}>
                                    <div className={styles.rank}>#{index + 1}</div>
                                    <div className={styles.avatar}>
                                        {member.name.charAt(0)}
                                    </div>
                                    <div className={styles.info}>
                                        <div className={styles.name}>
                                            {member.name}
                                            {member.id === user?.id && <span className={styles.youTag}>(You)</span>}
                                        </div>
                                        <div className={styles.stats}>
                                            {member.pagesRead} pages • {member.versesRead || 0} verses
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Group Chat */}
                    <div className="card">
                        <h2 className={styles.cardTitle}>💬 Group Hub</h2>
                        <div className={styles.chatContainer}>
                            <div className={styles.messageList}>
                                {chatMessages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`${styles.messageItem} ${msg.isAi ? styles.aiMessage : ''} ${msg.userId === user?.id ? styles.ownMessage : ''}`}
                                    >
                                        <div className={styles.messageHeader}>
                                            <span className={styles.messageUser}>{msg.userName}</span>
                                        </div>
                                        <div className={styles.messageText}>{msg.text}</div>
                                    </div>
                                ))}
                            </div>
                            <form className={styles.chatInputRow} onSubmit={handleSendMessage}>
                                <input
                                    type="text"
                                    placeholder="Message your group..."
                                    value={chatText}
                                    onChange={(e) => setChatText(e.target.value)}
                                    className={styles.chatInput}
                                />
                                <button type="submit" className="btn btn-primary" style={{ width: 'auto' }}>Send</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals - Standardized */}
            {showInviteModal && currentGroup && (
                <div className={styles.modal} onClick={() => setShowInviteModal(false)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>Share Group</h2>
                            <button className={styles.closeBtn} onClick={() => setShowInviteModal(false)}>×</button>
                        </div>
                        <div className={styles.inviteBox}>
                            <code>{currentGroup.inviteCode}</code>
                            <button className="btn btn-primary" onClick={() => {
                                navigator.clipboard.writeText(currentGroup.inviteCode);
                                setCopiedCode(true);
                                setTimeout(() => setCopiedCode(false), 2000);
                            }} style={{ marginTop: '1rem' }}>
                                {copiedCode ? '✓ Copied!' : 'Copy Code'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showGroupModal && (
                <div className={styles.modal} onClick={() => setShowGroupModal(false)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>Groups</h2>
                            <button className={styles.closeBtn} onClick={() => setShowGroupModal(false)}>×</button>
                        </div>
                        <div className={styles.groupList}>
                            {availableGroups.map(group => (
                                <div key={group.id} className={styles.groupCard}>
                                    <div className={styles.groupCardHeader}>
                                        <h4>{group.name}</h4>
                                        <button
                                            className="btn btn-primary"
                                            style={{ width: 'auto', padding: '0.5rem 1rem' }}
                                            onClick={() => { joinGroup(group.id); setShowGroupModal(false); }}
                                            disabled={currentGroup?.id === group.id}
                                        >
                                            {currentGroup?.id === group.id ? 'Active' : 'Switch'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {showGoalModal && (
                <div className={styles.modal} onClick={() => setShowGoalModal(false)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>New Goal</h2>
                            <button className={styles.closeBtn} onClick={() => setShowGoalModal(false)}>×</button>
                        </div>
                        <div className={styles.presetGoals}>
                            {PRESET_GOALS.map((preset, idx) => (
                                <button key={idx} className={styles.presetGoalBtn} onClick={() => handleSelectPresetGoal(preset)}>
                                    <h4>{preset.title}</h4>
                                    <p>{preset.description}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {showJoinByCodeModal && (
                <div className={styles.modal} onClick={() => setShowJoinByCodeModal(false)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>Join Circle</h2>
                            <button className={styles.closeBtn} onClick={() => setShowJoinByCodeModal(false)}>×</button>
                        </div>
                        <input
                            type="text"
                            placeholder="Enter invite code..."
                            value={inviteCode}
                            onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                            className={styles.input}
                        />
                        <button className="btn btn-primary" onClick={handleJoinByCode}>Join</button>
                    </div>
                </div>
            )}
        </div>
    );
}

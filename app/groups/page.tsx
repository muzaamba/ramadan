"use client";

import { useSocial } from '@/contexts/SocialContext';
import { PRESET_GOALS } from '@/types';
import { useState } from 'react';
import styles from './page.module.css';

export default function GroupsPage() {
    const { user, currentGroup, availableGroups, groupMembers, activities, goals, joinGroup, joinGroupByCode, leaveGroup, createGroup, addGoal } = useSocial();
    const [showGroupModal, setShowGroupModal] = useState(false);
    const [showGoalModal, setShowGoalModal] = useState(false);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [showJoinByCodeModal, setShowJoinByCodeModal] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');
    const [newGroupDesc, setNewGroupDesc] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [inviteCode, setInviteCode] = useState('');
    const [copiedCode, setCopiedCode] = useState(false);

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

    return (
        <div className={styles.container}>
            {/* Hero Section */}
            <div className={styles.hero}>
                <div className={styles.heroContent}>
                    <div className={styles.groupBadge}>
                        {currentGroup?.isPublic ? '🌍 Public Group' : '🔒 Private Group'}
                    </div>
                    <h1 className={styles.heroTitle}>{currentGroup?.name || 'No Group Selected'}</h1>
                    <p className={styles.heroSubtitle}>{currentGroup?.description || 'Join or create a group to start your journey'}</p>
                    <div className={styles.heroStats}>
                        <div className={styles.statBox}>
                            <span className={styles.statNumber}>{currentGroup?.members.length || 0}</span>
                            <span className={styles.statLabel}>Members</span>
                        </div>
                        <div className={styles.statBox}>
                            <span className={styles.statNumber}>{goals.length}</span>
                            <span className={styles.statLabel}>Active Goals</span>
                        </div>
                        <div className={styles.statBox}>
                            <span className={styles.statNumber}>{sortedMembers.reduce((sum, m) => sum + m.pagesRead, 0)}</span>
                            <span className={styles.statLabel}>Total Pages</span>
                        </div>
                    </div>
                </div>
                <div className={styles.heroActions}>
                    <button className="btn btn-primary" onClick={() => setShowGoalModal(true)}>
                        + New Goal
                    </button>
                    {currentGroup && (
                        <button className="btn btn-secondary" onClick={() => setShowInviteModal(true)}>
                            📤 Share Invite
                        </button>
                    )}
                    <button className="btn" onClick={() => setShowGroupModal(true)}>
                        Switch Group
                    </button>
                    <button className="btn" onClick={() => setShowJoinByCodeModal(true)}>
                        🔗 Join by Code
                    </button>
                    {currentGroup && (
                        <button className={styles.leaveBtn} onClick={leaveGroup}>
                            Leave Group
                        </button>
                    )}
                </div>
            </div>

            {/* Invite Modal */}
            {showInviteModal && currentGroup && (
                <div className={styles.modal} onClick={() => setShowInviteModal(false)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <h2>📤 Share Group Invite</h2>
                        <p className={styles.modalDesc}>Share this link or code with friends to invite them to {currentGroup.name}</p>

                        <div className={styles.inviteBox}>
                            <label>Invite Code</label>
                            <div className={styles.codeDisplay}>
                                <code>{currentGroup.inviteCode}</code>
                                <button className="btn btn-primary" onClick={() => {
                                    navigator.clipboard.writeText(currentGroup.inviteCode);
                                    setCopiedCode(true);
                                    setTimeout(() => setCopiedCode(false), 2000);
                                }}>
                                    {copiedCode ? '✓ Copied!' : 'Copy'}
                                </button>
                            </div>
                        </div>

                        <div className={styles.inviteBox}>
                            <label>Invite Link</label>
                            <div className={styles.linkDisplay}>
                                <input
                                    type="text"
                                    readOnly
                                    value={`${window.location.origin}/groups?invite=${currentGroup.inviteCode}`}
                                    className={styles.linkInput}
                                />
                                <button className="btn btn-secondary" onClick={handleCopyInviteLink}>
                                    {copiedCode ? '✓ Copied!' : 'Copy Link'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Join by Code Modal */}
            {showJoinByCodeModal && (
                <div className={styles.modal} onClick={() => setShowJoinByCodeModal(false)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <h2>🔗 Join Group by Code</h2>
                        <p className={styles.modalDesc}>Enter the invite code shared by your friend</p>
                        <input
                            type="text"
                            placeholder="Enter invite code (e.g., ABC123XY)"
                            value={inviteCode}
                            onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                            className={styles.input}
                            autoFocus
                        />
                        <button className="btn btn-primary w-full" onClick={handleJoinByCode}>
                            Join Group
                        </button>
                    </div>
                </div>
            )}

            {/* Group Management Modal */}
            {showGroupModal && (
                <div className={styles.modal} onClick={() => setShowGroupModal(false)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <h2>Manage Groups</h2>

                        <div className={styles.section}>
                            <h3>Available Groups</h3>
                            <div className={styles.groupList}>
                                {availableGroups.filter(g => g.isPublic || g.members.includes(user?.id || '')).map(group => (
                                    <div key={group.id} className={styles.groupCard}>
                                        <div className={styles.groupCardHeader}>
                                            <div>
                                                <h4>{group.name}</h4>
                                                <p className={styles.groupMeta}>
                                                    {group.isPublic ? '🌍 Public' : '🔒 Private'} • {group.members.length} members
                                                </p>
                                            </div>
                                            <button
                                                className={currentGroup?.id === group.id ? 'btn' : 'btn btn-primary'}
                                                onClick={() => {
                                                    if (currentGroup?.id !== group.id) {
                                                        joinGroup(group.id);
                                                        setShowGroupModal(false);
                                                    }
                                                }}
                                                disabled={currentGroup?.id === group.id}
                                            >
                                                {currentGroup?.id === group.id ? '✓ Current' : 'Join'}
                                            </button>
                                        </div>
                                        <p className={styles.groupDesc}>{group.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <hr className={styles.divider} />

                        <div className={styles.section}>
                            <h3>Create New Group</h3>
                            <input
                                type="text"
                                placeholder="Group Name"
                                value={newGroupName}
                                onChange={(e) => setNewGroupName(e.target.value)}
                                className={styles.input}
                            />
                            <textarea
                                placeholder="Description (optional)"
                                value={newGroupDesc}
                                onChange={(e) => setNewGroupDesc(e.target.value)}
                                className={styles.textarea}
                                rows={3}
                            />
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={isPublic}
                                    onChange={(e) => setIsPublic(e.target.checked)}
                                />
                                <span>Make this group public (anyone can join)</span>
                            </label>
                            <button className="btn btn-primary w-full" onClick={handleCreateGroup}>
                                Create Group
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Goal Selection Modal */}
            {showGoalModal && (
                <div className={styles.modal} onClick={() => setShowGoalModal(false)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <h2>Select a Goal</h2>
                        <p className={styles.modalDesc}>Choose from our curated goals for your group</p>
                        <div className={styles.presetGoals}>
                            {PRESET_GOALS.map((preset, idx) => (
                                <button
                                    key={idx}
                                    className={styles.presetGoalBtn}
                                    onClick={() => handleSelectPresetGoal(preset)}
                                >
                                    <h4>{preset.title}</h4>
                                    <p>{preset.description}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Active Goals Section */}
            {goals.length > 0 && (
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>🎯 Active Community Goals</h2>
                    <div className={styles.goalsGrid}>
                        {goals.map(goal => (
                            <div key={goal.id} className={styles.goalCard}>
                                <div className={styles.goalHeader}>
                                    <h3>{goal.title}</h3>
                                    <span className={styles.goalBadge}>{goal.participantsCompleted.length} ✓</span>
                                </div>
                                <p className={styles.goalDesc}>{goal.description}</p>
                                <div className={styles.participantsRow}>
                                    {goal.participantsCompleted.slice(0, 5).map((uid, i) => (
                                        <div key={uid} className={styles.miniAvatar} style={{ zIndex: 10 - i }}>
                                            {uid === user?.id ? 'Y' : sortedMembers.find(m => m.id === uid)?.name.charAt(0) || '?'}
                                        </div>
                                    ))}
                                    {goal.participantsCompleted.length > 5 && (
                                        <span className={styles.moreCount}>+{goal.participantsCompleted.length - 5}</span>
                                    )}
                                    {goal.participantsCompleted.length === 0 && (
                                        <span className={styles.emptyParticipants}>Be the first to complete!</span>
                                    )}
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
                                {index === 0 && <span className={styles.crown}>👑</span>}
                                {index === 1 && <span className={styles.medal}>🥈</span>}
                                {index === 2 && <span className={styles.medal}>🥉</span>}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Activity Feed */}
                <div className="card">
                    <h2 className={styles.cardTitle}>📊 Live Activity & AI Insights</h2>
                    <div className={styles.feed}>
                        {activities.slice(0, 15).map((activity) => (
                            <div
                                key={activity.id}
                                className={`${styles.feedItem} ${activity.isAiAnalysis ? styles.aiItem : ''}`}
                            >
                                <div className={styles.feedAvatar} style={activity.isAiAnalysis ? { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' } : {}}>
                                    {activity.isAiAnalysis ? '🤖' : activity.userName.charAt(0)}
                                </div>
                                <div className={styles.feedContent}>
                                    <p>
                                        <strong>{activity.userName}</strong> {activity.action}
                                    </p>
                                    <span className={styles.timestamp}>{activity.timestamp}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

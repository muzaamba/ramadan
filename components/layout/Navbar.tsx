"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSocial } from '@/contexts/SocialContext';
import { useState, useEffect } from 'react';
import styles from './Navbar.module.css';

export default function Navbar() {
    const pathname = usePathname();
    const { user, signOut } = useSocial();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Close menu when route changes
    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    const isActive = (path: string) => pathname === path;

    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo}>
                    <span className={styles.logoIcon}>🌙</span>
                    <span className={styles.logoText}>DeenTracker</span>
                </Link>

                {/* Mobile Hamburger */}
                <button
                    className={styles.hamburger}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <div className={`${styles.bar} ${isMenuOpen ? styles.bar1 : ''}`}></div>
                    <div className={`${styles.bar} ${isMenuOpen ? styles.bar2 : ''}`}></div>
                    <div className={`${styles.bar} ${isMenuOpen ? styles.bar3 : ''}`}></div>
                </button>

                <div className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`}>
                    <Link
                        href="/quran"
                        className={`${styles.navLink} ${isActive('/quran') ? styles.active : ''}`}
                    >
                        Qur'an
                    </Link>
                    <Link
                        href="/groups"
                        className={`${styles.navLink} ${isActive('/groups') ? styles.active : ''}`}
                    >
                        Groups
                    </Link>

                    {user && user.id !== '1' ? (
                        <div className={styles.userSection}>
                            <Link
                                href="/profile"
                                className={`${styles.navLink} ${isActive('/profile') ? styles.active : ''}`}
                            >
                                <span className={styles.userName}>{user.name.split(' ')[0]}</span>
                            </Link>
                            <button onClick={signOut} className={styles.logoutBtn}>
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link
                            href="/auth"
                            className={styles.loginBtn}
                        >
                            Login
                        </Link>
                    )}
                </div>
            </div>
            {/* Overlay for mobile */}
            {isMenuOpen && <div className={styles.overlay} onClick={() => setIsMenuOpen(false)}></div>}
        </nav>
    );
}

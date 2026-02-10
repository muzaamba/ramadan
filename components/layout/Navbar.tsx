"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSocial } from '@/contexts/SocialContext';
import styles from './Navbar.module.css';

export default function Navbar() {
    const pathname = usePathname();
    const { user, signOut } = useSocial();

    const isActive = (path: string) => pathname === path;

    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo}>
                    <span className={styles.logoIcon}>🌙</span>
                    <span className={styles.logoText}>DeenTracker</span>
                </Link>

                <div className={styles.nav}>
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
                                {user.name.split(' ')[0]}
                            </Link>
                            <button onClick={signOut} className={styles.logoutBtn}>
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link
                            href="/auth"
                            className={`${styles.loginBtn}`}
                        >
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}

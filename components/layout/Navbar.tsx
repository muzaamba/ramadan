"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

export default function Navbar() {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo}>
                    <span className={styles.logoIcon}>🌙</span>
                    <span className={styles.logoText}>Ramadan</span>
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
                    <Link
                        href="/profile"
                        className={`${styles.navLink} ${isActive('/profile') ? styles.active : ''}`}
                    >
                        Profile
                    </Link>
                </div>
            </div>
        </nav>
    );
}

"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function AuthPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const [message, setMessage] = useState<{ type: 'error' | 'success' | 'info', text: string } | null>(null);
    const router = useRouter();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                router.push('/profile');
            } else {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: { full_name: name },
                    }
                });

                if (error) throw error;

                if (data.user && data.session) {
                    // Logged in immediately
                    router.push('/profile');
                } else {
                    // Confirmation required
                    setMessage({
                        type: 'info',
                        text: 'Account created! Please check your email to confirm your account before logging in.'
                    });
                }
            }
        } catch (error: any) {
            console.error('Auth error:', error);
            setMessage({ type: 'error', text: error.message || 'An error occurred during authentication.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
                <h1 className={styles.title}>{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
                <p className={styles.subtitle}>
                    {isLogin ? 'Log in to continue your Ramadan journey' : 'Join our community this Ramadan'}
                </p>

                {message && (
                    <div className={`${styles.alert} ${styles[message.type]}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleAuth} className={styles.form}>
                    {!isLogin && (
                        <div className={styles.formGroup}>
                            <label>Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Abdullahi Faras"
                                required
                            />
                        </div>
                    )}
                    <div className={styles.formGroup}>
                        <label>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            minLength={6}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
                        {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
                    </button>
                </form>

                <div className={styles.toggle}>
                    {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                    <button onClick={() => setIsLogin(!isLogin)} className={styles.toggleBtn}>
                        {isLogin ? 'Sign Up' : 'Login'}
                    </button>
                </div>
            </div>
        </div>
    );
}

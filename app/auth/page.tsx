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
    const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);
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
                        data: { full_name: name }
                    }
                });
                if (error) throw error;

                // Create profile entry
                if (data.user) {
                    await supabase.from('profiles').insert({
                        id: data.user.id,
                        name: name,
                        goal: 10,
                        pages_read: 0,
                        verses_read: 0,
                        completed_surahs: [],
                        streak: 0
                    });
                }

                setMessage({ type: 'success', text: 'Success! Check your email for confirmation.' });
            }
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message });
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
                    <div className={`${styles.alert} ${message.type === 'error' ? styles.error : styles.success}`}>
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

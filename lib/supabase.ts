import { createClient } from '@supabase/supabase-js';

// Environment variables can sometimes be missed by the client-side bundler.
// We use the values from .env.local as hard fallbacks to ensure the app works.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://yttlbhzntinxqvwmqsyv.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0dGxiaHpudGlueHF2d21xc3l2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3MjI2NDksImV4cCI6MjA4NjI5ODY0OX0.kIM7IuVT64l2kS6eZpkldphrx6zkTsBb9T22zRT7BjY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isSupabaseConfigured = supabaseUrl.length > 0 && !supabaseUrl.includes('placeholder');

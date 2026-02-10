# Supabase Setup Guide for Ramadan Habit Tracker

To migrate from the current mock database to Supabase, follow these steps:

## 1. Create Supabase Project
Go to [supabase.com](https://supabase.com) and create a new project.

## 2. SQL Schema
Run the following SQL in the **SQL Editor** of your Supabase dashboard to create the tables:

```sql
-- 1. Create Tables
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  goal INTEGER DEFAULT 10,
  pages_read INTEGER DEFAULT 0,
  verses_read INTEGER DEFAULT 0,
  completed_surahs INTEGER[] DEFAULT '{}',
  streak INTEGER DEFAULT 0,
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE groups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT TRUE,
  invite_code TEXT UNIQUE,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE group_members (
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  PRIMARY KEY (group_id, user_id)
);

CREATE TABLE goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  target_type TEXT CHECK (target_type IN ('surah', 'pages')),
  target_value INTEGER,
  posted_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  user_id TEXT, -- Can be 'ai' or UUID
  user_name TEXT,
  action TEXT NOT NULL,
  is_ai_analysis BOOLEAN DEFAULT FALSE,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  user_id TEXT, -- Can be 'ai' or UUID
  user_name TEXT,
  text TEXT NOT NULL,
  is_ai BOOLEAN DEFAULT FALSE,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE activities;
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;

-- 3. Set up RLS (Row Level Security)
-- For simplicity in this demo, we'll allow all authenticated users to read/write.
-- In a production app, you should restrict these further!

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Groups are viewable by everyone" ON groups FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create groups" ON groups FOR INSERT WITH CHECK (auth.role() = 'authenticated');

ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Memberships are viewable by everyone" ON group_members FOR SELECT USING (true);
CREATE POLICY "Users can join groups" ON group_members FOR INSERT WITH CHECK (auth.role() = 'authenticated');

ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Goals are viewable by everyone" ON goals FOR SELECT USING (true);
CREATE POLICY "Members can create goals" ON goals FOR INSERT WITH CHECK (auth.role() = 'authenticated');

ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Activities are viewable by everyone" ON activities FOR SELECT USING (true);
CREATE POLICY "Authenticated users can post activities" ON activities FOR INSERT WITH CHECK (auth.role() = 'authenticated' OR user_id = 'ai');

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Messages are viewable by everyone" ON chat_messages FOR SELECT USING (true);
CREATE POLICY "Authenticated users can post messages" ON chat_messages FOR INSERT WITH CHECK (auth.role() = 'authenticated' OR user_id = 'ai');
```

## 3. Environment Variables
I have already set up your `.env.local`. If you need to change it:
```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## 4. Run the Dev Server
```bash
npm run dev
```

/*
  # Food Preferences App Schema

  1. New Tables
    - users (managed by Supabase Auth)
    - user_preferences
      - id (uuid, primary key)
      - user_id (uuid, foreign key to auth.users)
      - taste_preferences (jsonb)
      - texture_preferences (text[])
      - dietary_restrictions (text[])
      - preferred_cuisines (text[])
      - created_at (timestamp)

  2. Security
    - Enable RLS on user_preferences table
    - Add policies for users to manage their own preferences
*/

CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  taste_preferences jsonb NOT NULL,
  texture_preferences text[] NOT NULL,
  dietary_restrictions text[] NOT NULL,
  preferred_cuisines text[] NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own preferences"
  ON user_preferences
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
  ON user_preferences
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own preferences"
  ON user_preferences
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
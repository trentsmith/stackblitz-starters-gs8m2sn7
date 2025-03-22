export interface User {
  id: string;
  email: string;
  password:string;
  created_at: Date;
}

export interface UserPreferences {
  id: string;
  user_id: string;
  taste_preferences: {
    sweet: number;
    savory: number;
    sour: number;
    bitter: number;
    spicy: number;
    salty: number;
  };
  texture_preferences: string[];
  dietary_restrictions: string[];
  preferred_cuisines: string[];
  created_at: Date;
}
import { Injectable } from '@angular/core';
import { UserPreferences } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class PreferencesService {
  private readonly STORAGE_KEY = 'user_preferences';

  constructor() {}

  async savePreferences(preferences: Partial<UserPreferences>) {
    try {
      const allPreferences = this.getAllPreferences();
      //allPreferences[preferences.user_id!] = preferences;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allPreferences));
      return preferences;
    } catch (error) {
      throw error;
    }
  }

  async getPreferences(userId: string) {
    try {
      const allPreferences = this.getAllPreferences();
      return allPreferences[userId] || null;
    } catch (error) {
      throw error;
    }
  }

  private getAllPreferences(): Record<string, UserPreferences> {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  }

  generateRecommendations(preferences: UserPreferences) {
    const recommendations = [];
    
    if (preferences.taste_preferences.spicy > 7) {
      recommendations.push('Thai Green Curry', 'Szechuan Hot Pot');
    }
    
    if (preferences.taste_preferences.sweet > 7) {
      recommendations.push('Mango Sticky Rice', 'Tiramisu');
    }
    
    if (preferences.texture_preferences.includes('crunchy')) {
      recommendations.push('Tempura', 'Crispy Spring Rolls');
    }
    
    return recommendations;
  }
}
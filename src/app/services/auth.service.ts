import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  currentUser$ = this.currentUserSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();

  constructor() {
    // Load user from localStorage if available
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  async register(email: string, password: string) {
    try {
      this.loadingSubject.next(true);
      // Simulate registration delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user: User = {
        id: crypto.randomUUID(),
        email,
        created_at: new Date()
      };
      
      localStorage.setItem('user', JSON.stringify(user));
      this.currentUserSubject.next(user);
      
      return { user };
    } catch (error) {
      throw error;
    } finally {
      this.loadingSubject.next(false);
    }
  }

  async login(email: string, password: string) {
    try {
      this.loadingSubject.next(true);
      // Simulate login delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user: User = {
        id: crypto.randomUUID(),
        email,
        created_at: new Date()
      };
      
      localStorage.setItem('user', JSON.stringify(user));
      this.currentUserSubject.next(user);
      
      return { user };
    } catch (error) {
      throw error;
    } finally {
      this.loadingSubject.next(false);
    }
  }

  async logout() {
    try {
      this.loadingSubject.next(true);
      localStorage.removeItem('user');
      this.currentUserSubject.next(null);
    } catch (error) {
      throw error;
    } finally {
      this.loadingSubject.next(false);
    }
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }
}
import { Injectable } from '@angular/core';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';


// Assume you have a User interface defined somewhere
export interface User {
  id: string;
  email: string;
  created_at: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  currentUser$ = this.currentUserSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();

  // Use your Replit domain as the base URL
  private baseUrl = 'https://11e04d8f-0268-4b26-ad71-b6ea8d29267d-00-3qd9682y3xgt1.janeway.replit.dev';

  constructor(private http: HttpClient) {
    // Load user from localStorage if available
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  async register(email: string, password: string) {
    try {
      this.loadingSubject.next(true);
      // Simulated registration delay; update if you add a backend registration endpoint.
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
      // Call the backend login endpoint with email and password
      const userResponse: any = await lastValueFrom(
        this.http.get(`${this.baseUrl}/get/user/${encodeURIComponent(email)}/${encodeURIComponent(password)}`)
      );

      if (userResponse && userResponse.length > 0) {
        const user: User = {
          id: userResponse[0].user, // Using the username as the unique identifier
          email: userResponse[0].user,
          created_at: new Date() // For demo purposes; ideally use a server timestamp.
        };

        localStorage.setItem('user', JSON.stringify(user));
        this.currentUserSubject.next(user);

        return { user };
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error: any) {
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

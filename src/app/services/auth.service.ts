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
User:any;
  async getUser()
{
 return this.User
}
async register(email: string, password: string) {
    try {
      this.loadingSubject.next(true);
      // Call the backend endpoint to insert a new user
      const response: any = await lastValueFrom(
        this.http.post(`${this.baseUrl}/insert/users`, {
          user: email,
          password,
          favoredtastes: 'default'  // Adjust this value if needed
        })
      );
      console.log('User inserted:', response);

      // Create a user object. In a real scenario, you might want to use returned data from the backend.
      const user: User = {
        id: email,  // You can replace this with a unique ID from the response if available
        email,
        created_at: new Date() // For demo purposes; ideally, use a server timestamp
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

  async login(email: string, password: string): Promise<{ user: User }> {
    this.loadingSubject.next(true);
    try {
      // For demonstration purposes, we're using GET.
      // NOTE: Sending credentials in the URL is insecure.
      // In production, use a POST endpoint with the credentials in the request body.
      const url = `${this.baseUrl}/get/user/${encodeURIComponent(email)}/${encodeURIComponent(password)}`;
      const userResponse: any = await lastValueFrom(this.http.get(url));
  
      if (Array.isArray(userResponse) && userResponse.length > 0) {
        const userData = userResponse[0];
        const user: User = {
          id: userData.user, // Assuming the username is the unique identifier
          email: userData.user,
          // Use the timestamp from the server if available; otherwise, fallback to the current time
          created_at: userData.created_at ? new Date(userData.created_at) : new Date()
        };
        this.User=user;
        localStorage.setItem('user', JSON.stringify(user));
        this.currentUserSubject.next(user);
        
        return { user };
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error: any) {
      console.error('Login error:', error);
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
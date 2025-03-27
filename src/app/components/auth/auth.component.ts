import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div class="text-center">
          <h2 class="text-3xl font-extrabold text-gray-900">
            {{ isLogin ? 'Welcome Back' : 'Create Your Account' }}
          </h2>
          <p class="mt-2 text-sm text-gray-600">
            {{ isLogin ? 'Sign in to your account' : 'Start your food journey' }}
          </p>
        </div>
        
        <form [formGroup]="authForm" (ngSubmit)="onSubmit()" class="mt-8 space-y-6">
          <div class="rounded-md shadow-sm space-y-4">
            <div>
              <label for="email" class="sr-only">Email address</label>
              <input
                id="email"
                type="email"
                formControlName="email"
                class="form-input"
                placeholder="Email address"
                required
                [class.border-red-500]="authForm.get('email')?.touched && authForm.get('email')?.invalid"
              />
              <div *ngIf="authForm.get('email')?.touched && authForm.get('email')?.invalid" class="text-red-500 text-sm mt-1">
                Please enter a valid email address
              </div>
            </div>
            
            <div>
              <label for="password" class="sr-only">Password</label>
              <input
                id="password"
                type="password"
                formControlName="password"
                class="form-input"
                placeholder="Password"
                required
                [class.border-red-500]="authForm.get('password')?.touched && authForm.get('password')?.invalid"
              />
              <div *ngIf="authForm.get('password')?.touched && authForm.get('password')?.invalid" class="text-red-500 text-sm mt-1">
                Password must be at least 6 characters
              </div>
            </div>
          </div>

          <div *ngIf="error" class="text-red-500 text-sm text-center">
            {{ error }}
          </div>

          <div>
            <button
              type="submit"
              [disabled]="!authForm.valid || loading"
              class="btn btn-primary w-full flex items-center justify-center"
              [class.opacity-50]="!authForm.valid || loading"
            >
              <span *ngIf="loading" class="mr-2">
                <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
              {{ isLogin ? 'Sign In' : 'Create Account' }}
            </button>
          </div>
          
          <div class="text-center">
            <button
              type="button"
              class="text-blue-600 hover:text-blue-800 text-sm"
              (click)="toggleMode()"
            >
              {{ isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class AuthComponent {
  authForm: FormGroup;
  isLogin = true;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.authService.loading$.subscribe(
      loading => this.loading = loading
    );
  }

  async onSubmit() {
    if (this.authForm.valid) {
      this.error = null;
      try {
        const { email, password } = this.authForm.value;
        if (this.isLogin) {
          await this.authService.login(email, password);
        } else {
          await this.authService.register(email, password);
        }
        this.router.navigate(['/questionnaire']);
      } catch (error: any) {
        this.error = error.message || 'An error occurred during authentication';
        console.error('Auth error:', error);
      }
    }
  }

  toggleMode() {
    this.isLogin = !this.isLogin;
    this.error = null;
    this.authForm.reset();
  }
}
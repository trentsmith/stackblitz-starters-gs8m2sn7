import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="bg-white shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <!-- Left side: Brand + Nav Links -->
          <div class="flex">
            <!-- Brand -->
            <div class="flex-shrink-0 flex items-center">
              <a routerLink="/" class="text-xl font-bold text-blue-600">
                FlavorMatch
              </a>
            </div>
            <!-- Desktop Nav Links -->
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <!-- Home Link -->
              <a
                routerLink="/"
                routerLinkActive="border-blue-500 text-gray-900"
                [routerLinkActiveOptions]="{ exact: true }"
                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Home
              </a>
              <!-- Search Link -->
              <a
                routerLink="/rec"
                routerLinkActive="border-blue-500 text-gray-900"
                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Recommendations
              </a>
              <!-- Preferences (Questionnaire) -->
              <a
                routerLink="/ans"
                routerLinkActive="border-blue-500 text-gray-900"
                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Preferences
              </a>
            </div>
          </div>

          <!-- Right side: Sign In / Sign Out (Optional) + Dark Mode Toggle-->
          <div class="hidden sm:ml-6 sm:flex sm:items-center">
            <!-- Auth Buttons -->
            <div class="ml-3 relative">
              <!-- Show email + Sign Out if authenticated -->
              <div *ngIf="isAuthenticated; else signInLink">
                <span class="mr-3 text-gray-700">
                  Welcome, {{ currentUser?.email }}
                </span>
                <button
                  (click)="logout()"
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 border-blue-600"
                >
                  Sign Out
                </button>
              </div>
              <!-- Show Sign In button if NOT authenticated -->
              <ng-template #signInLink>
                <a
                  routerLink="/auth"
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Sign In
                </a>
              </ng-template>
            </div>

            <!-- Dark Mode Toggle (no Tailwind dark classes) -->
            <button
              (click)="toggleDarkMode()"
              class="ml-4 inline-flex items-center px-3 py-1 rounded text-sm bg-gray-200 hover:bg-gray-300 text-gray-800"
            >
              {{ isDarkMode ? 'Dark Mode On' : 'Dark Mode Off' }}
            </button>
          </div>

          <!-- Mobile menu button -->
          <div class="flex items-center sm:hidden">
            <button
              type="button"
              (click)="toggleMobileMenu()"
              class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <span class="sr-only">Open main menu</span>
              <svg
                class="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <!-- Hamburger Icon -->
                <path
                  *ngIf="!isMobileMenuOpen"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
                <!-- X (Close) Icon -->
                <path
                  *ngIf="isMobileMenuOpen"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile menu -->
      <div class="sm:hidden" [class.hidden]="!isMobileMenuOpen">
        <div class="pt-2 pb-3 space-y-1">
          <a
            routerLink="/"
            routerLinkActive="bg-blue-50 border-blue-500 text-blue-700"
            [routerLinkActiveOptions]="{ exact: true }"
            class="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            (click)="isMobileMenuOpen = false"
          >
            Home
          </a>
          <a
            routerLink="/questionnaire"
            routerLinkActive="bg-blue-50 border-blue-500 text-blue-700"
            class="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            (click)="isMobileMenuOpen = false"
          >
            Preferences
          </a>
          <a
            routerLink="/recommendations"
            routerLinkActive="bg-blue-50 border-blue-500 text-blue-700"
            class="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            (click)="isMobileMenuOpen = false"
          >
            Recommendations
          </a>

          <!-- Auth in mobile menu (optional) -->
          <div class="pt-4 pb-3 border-t border-gray-200">
            <!-- If not authenticated, show Sign In -->
            <div *ngIf="!isAuthenticated" class="mt-3 space-y-1">
              <a
                routerLink="/auth"
                class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                (click)="isMobileMenuOpen = false"
              >
                Sign In
              </a>
            </div>

            <!-- If authenticated, show user + Sign Out -->
            <div *ngIf="isAuthenticated" class="mt-3 space-y-1">
              <span class="block px-4 py-2 text-base font-medium text-gray-500">
                Welcome, {{ currentUser?.email }}
              </span>
              <button
                (click)="logout(); isMobileMenuOpen = false"
                class="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              >
                Sign Out
              </button>
            </div>

            <!-- Dark Mode Toggle in Mobile Menu -->
            <button
              (click)="toggleDarkMode(); isMobileMenuOpen = false"
              class="mt-3 w-full inline-flex items-center px-3 py-1 rounded text-sm bg-gray-200 hover:bg-gray-300 text-gray-800"
            >
              {{ isDarkMode ? 'Dark Mode On' : 'Dark Mode Off' }}
            </button>
          </div>
        </div>
      </div>
    </nav>
  `,
})
export class NavbarComponent {
  isMobileMenuOpen = false;
  isAuthenticated = false;
  currentUser: User | null = null;

  // For our custom dark-mode toggling
  isDarkMode = false;

  constructor(private authService: AuthService) {
    this.authService.currentUser$.subscribe(user => {
      this.isAuthenticated = !!user;
      this.currentUser = user;
    });
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  logout() {
    console.log('Logging out...');
    this.authService.logout();
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;

    if (this.isDarkMode) {
      // Add a .dark-mode class to <body>
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }
}
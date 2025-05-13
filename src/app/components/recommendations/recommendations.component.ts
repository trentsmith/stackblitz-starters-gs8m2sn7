import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-recommendations',
  standalone: true, // Declares this as a standalone component
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-100 py-8">
      <div class="max-w-2xl mx-auto">
        <div class="card p-6 bg-white rounded shadow-md">
          <h2 class="text-2xl font-bold mb-6">Your Food Recommendations</h2>

          <div *ngIf="loading" class="text-center py-4">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p>Loading recommendations...</p>
          </div>

          <div *ngIf="errorMessage" class="text-center text-red-500">
            {{ errorMessage }}
          </div>

          <div *ngIf="!loading && recommendations.length > 0">
            <!-- Show each recommended foodlist -->
            <div *ngFor="let item of recommendations" class="bg-white rounded-lg shadow-md p-4 mb-4">
              <h3 class="text-lg font-semibold">{{ item.foodlist }}</h3>
            </div>
          </div>

          <div *ngIf="!loading && recommendations.length === 0 && !errorMessage" class="text-center text-gray-600">
            No recommendations found. Try adjusting your preferences.
          </div>

          <!-- Debug output (formatted as JSON) -->
          <ul class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <li *ngFor="let item of recommendations"
              class="flex items-center bg-gradient-to-r from-orange-100 via-red-100 to-yellow-100 rounded-lg shadow p-4 hover:shadow-lg transition duration-200">
            <span class="text-red-800 font-semibold text-base">🌶️ {{ item }}</span>
          </li>
        </ul>
        
        </div>
      </div>
    </div>
  `
})
export class RecommendationsComponent implements OnInit {
  recommendations: any[] = [];
  loading = true;
  errorMessage = '';

  // Update this URL to point to your actual Replit backend
  private backendUrl = 'https://flavor-match-backend-api-1-trentsmith1.replit.app';

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {


        // Optionally, get the authenticated user's email
        const userEmail = this.authService.User?.email || 'bob@b.com';
        const encodedEmail = encodeURIComponent(userEmail);
    
        // 4) Construct the endpoint URL.
        // Adjust the endpoint if you need to include the email or any other parameter.
        // For example, if your backend expects the taste parameter:
        const endpoint = `${this.backendUrl}/get/user/tastes/${userEmail}`;
        this.loading = true;
    
        interface Recommendation {
          tastes: string;
          foodlist: string[];
        }
    
        this.http.get<Recommendation[]>(endpoint)
          .pipe(
            // Ensure loading is turned off regardless of success or error
            finalize(() => {
              this.loading = false;
            })
          )
          .subscribe({
            next: (response) => {
              // Assign the response to the recommendations array
              this.recommendations = response;
              console.log(this.recommendations);
            },
            error: (error) => {
              console.error('Error fetching recommendations:', error);
              this.errorMessage = 'Failed to load recommendations. Try again later.';
            }
          });
  }

  ngOnInit(): void {
    this.loading = true;
  
    this.http.get<{ recommendations: string }>(`${this.backendUrl}/recommendations`)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (res) => {
          this.recommendations = res.recommendations
            .split(',')
            .map(item => item.trim()); // Remove any extra whitespace
        },
        error: () => {
          this.errorMessage = 'Failed to load recommendations. Please try again later.';
        }
      });
  }
  
}
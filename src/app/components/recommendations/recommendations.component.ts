import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recommendations',
  standalone: true, // Declares this as a standalone component
  imports: [CommonModule], // Import CommonModule to make directives like *ngIf and *ngFor available
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
            <div
              *ngFor="let item of recommendations"
              class="bg-white rounded-lg shadow-md p-4 mb-4"
            >
              <h3 class="text-lg font-semibold">{{ item.foodlist }}</h3>
            </div>
          </div>
  
          <div
            *ngIf="!loading && recommendations.length === 0 && !errorMessage"
            class="text-center text-gray-600"
          >
            No recommendations found. Try adjusting your preferences.
          </div>
        </div>
      </div>
    </div>
  `
})
export class RecommendationsComponent implements OnInit {
  recommendations: any[] = [];
  loading = true;
  errorMessage = '';

  // Point this to your actual Replit backend URL
  private backendUrl = 'https://11e04d8f-0268-4b26-ad71-b6ea8d29267d-00-3qd9682y3xgt1.janeway.replit.dev/';

  constructor(
    private http: HttpClient, 
    private router: Router,
    private authService: AuthService
  ) {
    try {
      console.log('Logged in as:', this.authService.User.email);
    } catch (error) {
      console.log('Error retrieving user information:', error);
    }
  }

  ngOnInit(): void {
    const userPreferences = localStorage.getItem('userPreferences');
    if (!userPreferences) {
      // Redirect if no preferences are found
      this.router.navigate(['/rec']);
      return;
    }

    const parsedPreferences = JSON.parse(userPreferences);

    // Calculate the dominant taste based on the highest slider value
    const tasteRatings: { [key: string]: number } = {
      Sweet: parsedPreferences.Sweet,
      Savory: parsedPreferences.Savory,
      Sour: parsedPreferences.Sour,
      Bitter: parsedPreferences.Bitter,
      Spicy: parsedPreferences.Spicy,
      Salty: parsedPreferences.Salty
    };

    const dominantTaste = Object.keys(tasteRatings).reduce((a, b) =>
      tasteRatings[a] > tasteRatings[b] ? a : b
    );

    console.log('Dominant taste is:', dominantTaste);

    // Convert the dominant taste to lowercase for the backend route
    const tasteParam = dominantTaste.toLowerCase();

    // Fetch recommendations from the backend
    this.http.get<any[]>(`${this.backendUrl}/get/foodlist/${tasteParam}`)
      .subscribe({
        next: (response) => {
          this.recommendations = response;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error fetching recommendations:', error);
          this.errorMessage = 'Failed to load recommendations. Try again later.';
          this.loading = false;
        }
      });
  }
}

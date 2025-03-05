import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recommendations',
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
  private backendUrl = 'https://b1273e89-5ba5-4dec-9e69-28e26158b377-00-2g3zx2wq7rg2w.kirk.replit.dev/';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    const userPreferences = localStorage.getItem('userPreferences');
    if (!userPreferences) {
      // If no preferences, redirect them to fill out the questionnaire
      this.router.navigate(['/questionnaire']);
      return;
    }

    const parsedPreferences = JSON.parse(userPreferences);

    // 1) Figure out the "dominant taste" based on the highest slider value
    const tasteRatings: { [key: string]: number } = {
      Sweet: parsedPreferences.Sweet,
      Savory: parsedPreferences.Savory,
      Sour: parsedPreferences.Sour,
      Bitter: parsedPreferences.Bitter,
      Spicy: parsedPreferences.Spicy,
      Salty: parsedPreferences.Salty
    };

    // 2) Determine which taste is highest
    const dominantTaste = Object.keys(tasteRatings).reduce((a, b) =>
      tasteRatings[a] > tasteRatings[b] ? a : b
    );

    console.log('Dominant taste is:', dominantTaste);

    // 3) Convert that taste to lowercase for the backend route
    const tasteParam = dominantTaste.toLowerCase(); // e.g. "sweet", "spicy"

    // 4) Call your Replit endpoint: GET /get/foodlist/:tastes
    //    e.g. /get/foodlist/sweet
    this.http.get<any[]>(`${this.backendUrl}/get/foodlist/${tasteParam}`)
      .subscribe({
        next: (response) => {
          // 'response' should be an array of objects with { tastes, foodlist }
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

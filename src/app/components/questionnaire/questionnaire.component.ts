import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-questionnaire',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-gray-100 py-8">
      <div class="max-w-2xl mx-auto">
        <div class="card p-6 bg-white rounded shadow-md">
          <h2 class="text-2xl font-bold mb-6">FlavorMatch Questionnaire</h2>

          <form [formGroup]="questionnaireForm" (ngSubmit)="onSubmit()">
            <!-- Favorite Ice Cream Flavor (Dropdown) -->
            <div class="mb-6">
              <label class="block text-sm font-medium mb-2">
                Favorite Ice Cream Flavor
              </label>
              <select formControlName="favoriteIceCream" class="form-input w-full">
                <option value="" disabled>Select a flavor</option>
                <option *ngFor="let flavor of iceCreamFlavors" [value]="flavor">
                  {{ flavor }}
                </option>
              </select>
            </div>

            <!-- Preferred Meat (Dropdown) -->
            <div class="mb-6">
              <label class="block text-sm font-medium mb-2">
                Preferred Meat
              </label>
              <select formControlName="preferredMeat" class="form-input w-full">
                <option value="" disabled>Select a meat</option>
                <option *ngFor="let meat of meats" [value]="meat">
                  {{ meat }}
                </option>
              </select>
            </div>

            <!-- Favorite Soda (Dropdown) -->
            <div class="mb-6">
              <label class="block text-sm font-medium mb-2">
                Favorite Soda
              </label>
              <select formControlName="favoriteSoda" class="form-input w-full">
                <option value="" disabled>Select a soda</option>
                <option *ngFor="let soda of sodas" [value]="soda">
                  {{ soda }}
                </option>
              </select>
            </div>
            
            <!-- Submit Button -->
            <button type="submit" class="btn btn-primary w-full">
              Get Recommendations
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
})
export class QuestionnaireComponent implements OnInit {
  questionnaireForm: FormGroup;

  // Example: You can call this if you want to do a POST later, but for now it's optional.
  backendUrl =
    'https://11e04d8f-0268-4b26-ad71-b6ea8d29267d-00-3qd9682y3xgt1.janeway.replit.dev/';

  iceCreamFlavors = [
    'Chocolate',
    'Vanilla',
    'Strawberry',
    'Mint',
    'Cookies & Cream',
  ];
  meats = ['Chicken', 'Beef', 'Pork', 'Fish', 'Vegetarian'];
  sodas = ['Coca-Cola', 'Sprite', 'Pepsi', 'Dr Pepper', 'Fanta'];
  tasteProfiles = ['Sweet', 'Savory', 'Sour', 'Bitter', 'Spicy', 'Salty'];
  textures = ['Crunchy', 'Creamy', 'Chewy', 'Tender'];
  dietaryRestrictions = [
    'Vegetarian',
    'Vegan',
    'Gluten-free',
    'Dairy-free',
    'Nut-free',
    'Halal',
    'Kosher',
  ];
  cuisines = [
    'Italian',
    'Japanese',
    'Mexican',
    'Indian',
    'Chinese',
    'Thai',
    'French',
    'Mediterranean',
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private authService: AuthService

  ) {
    this.questionnaireForm = this.fb.group({
      favoriteIceCream: ['', Validators.required],
      preferredMeat: ['', Validators.required],
      favoriteSoda: ['', Validators.required],
      // For each taste slider, default = 5
      ...this.tasteProfiles.reduce(
        (acc, taste) => ({
          ...acc,
          [taste]: [5, Validators.required],
        }),
        {}
      ),
      // For each texture checkbox, default = false
      ...this.textures.reduce(
        (acc, texture) => ({
          ...acc,
          [texture]: [false],
        }),
        {}
      ),
      dietaryRestrictions: [[]],
      preferredCuisines: [[], Validators.required],
    });
  }

  ngOnInit() {}

  onSubmit() {
    const user = this.authService.User;
    console.log("User:", user);
    if (this.questionnaireForm.valid) {
      const preferences = this.questionnaireForm.value;
      console.log("Form Data:", preferences);
  
      // Save user preferences to localStorage
      localStorage.setItem("userPreferences", JSON.stringify(preferences));
  
      // Define a string for the questions parameter (adjust as needed)
      const questionsString = "tastes";
  
      // Make the HTTP call to update the user's tastes
      this.http.put(`${this.backendUrl}update/user/tastes/${questionsString}/${user}`, {})
        .subscribe(
          (response: any) => {
            console.log("Update successful:", response);
            // Navigate to the recommendations route upon success
            this.router.navigate(['/recommendations']);
          },
          (error: any) => {
            console.error("Error updating user tastes:", error);
          }
        );
    }
  }
  
}

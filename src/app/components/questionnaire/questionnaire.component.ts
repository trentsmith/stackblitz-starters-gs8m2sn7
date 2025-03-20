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

            <!-- Taste Preferences (Sliders) -->
            <div class="mb-6">
              <h3 class="text-lg font-semibold mb-4">Taste Preferences</h3>
              <div class="space-y-4">
                <div *ngFor="let taste of tasteProfiles">
                  <label class="block text-sm font-medium mb-1">
                    How much do you enjoy {{ taste }} flavors? (1-10)
                  </label>
                  <input
                    type="range"
                    [formControlName]="taste"
                    min="1"
                    max="10"
                    class="w-full"
                  />
                  <div class="flex justify-between text-sm text-gray-600">
                    <span>Not at all</span>
                    <span>Very much</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Texture Preferences (Checkboxes) -->
            <div class="mb-6">
              <h3 class="text-lg font-semibold mb-4">Texture Preferences</h3>
              <div class="grid grid-cols-2 gap-4">
                <div *ngFor="let texture of textures">
                  <label class="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      [formControlName]="texture"
                      class="form-checkbox"
                    />
                    <span>{{ texture }}</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- Dietary Restrictions (Multi-Select) -->
            <div class="mb-6">
              <h3 class="text-lg font-semibold mb-4">Dietary Restrictions</h3>
              <select
                formControlName="dietaryRestrictions"
                multiple
                class="form-input w-full"
              >
                <option *ngFor="let restriction of dietaryRestrictions" [value]="restriction">
                  {{ restriction }}
                </option>
              </select>
            </div>

            <!-- Preferred Cuisines (Multi-Select) -->
            <div class="mb-6">
              <h3 class="text-lg font-semibold mb-4">Preferred Cuisines</h3>
              <select
                formControlName="preferredCuisines"
                multiple
                class="form-input w-full"
              >
                <option *ngFor="let cuisine of cuisines" [value]="cuisine">
                  {{ cuisine }}
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
    'https://b1273e89-5ba5-4dec-9e69-28e26158b377-00-2g3zx2wq7rg2w.kirk.replit.dev/';

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
    try
    {
    //this.user$ = this.authService.User.email;
    //const user1 = this.user$;

      console.log('Logged in as:',  this.authService.User.email);

  }catch
  {
    console.log('catch');

  }
    if (this.questionnaireForm.valid) {
      const preferences = this.questionnaireForm.value;
      console.log('Form Data:', preferences);

      // Save user preferences to localStorage
      localStorage.setItem('userPreferences', JSON.stringify(preferences));

      // Navigate to the /recommendations route
      this.router.navigate(['/recommendations']);
    }
  }
}

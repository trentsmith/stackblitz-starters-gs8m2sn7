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
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4744031721980736"
     crossorigin="anonymous"></script>
    <div class="min-h-screen bg-gray-100 py-8">
      <div class="max-w-2xl mx-auto">
        <div class="card p-6 bg-white rounded shadow-md">
          <h2 class="text-2xl font-bold mb-6">FlavorMatch Questionnaire</h2>

          <form [formGroup]="questionnaireForm" (ngSubmit)="onSubmit()">
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
  successMessage = '';
  backendUrl =
    'https://flavor-match-backend-api-1-trentsmith1.replit.app/';

    iceCreamFlavors = [
      // Base flavors:
      'Chocolate',
      'Vanilla',
      'Strawberry',
      'Mint',
      'Cookies & Cream',
      // Sweet & Fruity:
      'Peach',
      'Cotton Candy',
      'Bubblegum',
      'Mango',
      // Fresh & Tangy:
      'Lemon',
      'Orange Sherbet',
      'Pineapple',
      'Key Lime',
      'Tangerine',
      // Savory & Umami:
      'Salted Caramel',
      'Coffee',
      'Butter Pecan',
      'Vanilla Bean',
      'Dark Chocolate',
      // Herbal, Bitter & Earthy:
      'Matcha Green Tea',
      'Basil',
      'Lavender Honey',
      'Rosemary Swirl',
      // Spicy & Piquant:
      'Chili Chocolate',
      'Ginger',
      'Spicy Mango',
      'Cinnamon',
      // Nutty, Grain-Based & Extras:
      'Sea Salt Caramel',
      'Maple Bacon',
      'Rocky Road',
      'Coffee Cake',
      'Maple Walnut',
      'Hazelnut Crunch'
    ];
    
    meats = [
      // Base meats:
      'Chicken',
      'Beef',
      'Pork',
      'Fish',
      'Vegetarian',
      // Additional proteins:
      'Turkey',
      'Duck',
      'Lamb',
      'Buffalo Sausage',
      'Venison',
      'Bison',
      // Seafood & plant-based options:
      'Shrimp',
      'Crab',
      'Lobster',
      'Tofu',
      'Eggplant'
    ];
    
    sodas = [
      // Base sodas:
      'Coca-Cola',
      'Sprite',
      'Pepsi',
      'Dr Pepper',
      'Fanta',
      // Additional soda options:
      'Mountain Dew',
      '7 Up',
      'Crush Orange',
      'Sunkist',
      'Ginger Ale',
      'Root Beer'
    ];
    
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
      ...this.tasteProfiles.reduce(
        (acc, taste) => ({
          ...acc,
          [taste]: [5, Validators.required],
        }),
        {}
      ),
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
    console.log('User:', user);
    if (this.questionnaireForm.valid) {
      const preferences = this.questionnaireForm.value;
      console.log('Form Data:', preferences);

      localStorage.setItem('userPreferences', JSON.stringify(preferences));

      const questionsString = this.questionnaireForm.value.favoriteIceCream+' '+this.questionnaireForm.value.preferredMeat+' '+this.questionnaireForm.value.favoriteSoda; // Adjust as needed based on your backend logic

      this.http
        .get(
          `${this.backendUrl}update/user/tastes/${questionsString}/${user}`,
          {}
        )
        .subscribe(
          (response: any) => {
            console.log('Update successful:', response);
            this.router.navigate(['/recommendations']);
          },
          (error: any) => {
            console.error('Error updating user tastes:', error);
          }
        );
    }
    if (this.questionnaireForm.valid) {
      const prefs = this.questionnaireForm.value;
      localStorage.setItem('userPreferences', JSON.stringify(prefs));
      this.successMessage = 'Preferences saved!';
    }
  }
}
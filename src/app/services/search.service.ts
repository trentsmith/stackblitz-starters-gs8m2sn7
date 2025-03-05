import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface SearchResult {
  id: string;
  title: string;
  image: string;
  cuisineType: string[];
  dietLabels: string[];
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private readonly API_URL = 'https://api.edamam.com/api/recipes/v2';
  private readonly APP_ID = 'YOUR_EDAMAM_APP_ID'; // Replace with your Edamam App ID
  private readonly APP_KEY = 'YOUR_EDAMAM_APP_KEY'; // Replace with your Edamam App Key

  constructor(private http: HttpClient) {}

  searchRecipes(query: string): Observable<SearchResult[]> {
    // For demo purposes, return mock data
    return of([
      {
        id: '1',
        title: 'Spicy Thai Curry',
        image: 'https://via.placeholder.com/150',
        cuisineType: ['Thai'],
        dietLabels: ['Vegetarian']
      },
      {
        id: '2',
        title: 'Mediterranean Salad',
        image: 'https://via.placeholder.com/150',
        cuisineType: ['Mediterranean'],
        dietLabels: ['Vegan', 'Low-Carb']
      }
    ]);

    // Uncomment below to use actual API
    /*
    const params = {
      type: 'public',
      q: query,
      app_id: this.APP_ID,
      app_key: this.APP_KEY
    };

    return this.http.get(`${this.API_URL}`, { params }).pipe(
      map((response: any) => {
        return response.hits.map((hit: any) => ({
          id: hit.recipe.uri,
          title: hit.recipe.label,
          image: hit.recipe.image,
          cuisineType: hit.recipe.cuisineType,
          dietLabels: hit.recipe.dietLabels
        }));
      }),
      catchError(error => {
        console.error('Error fetching recipes:', error);
        return of([]);
      })
    );
    */
  }
}
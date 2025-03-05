import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchService, SearchResult } from '../../services/search.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-4xl mx-auto p-6">
      <div class="mb-8">
        <div class="relative">
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (keyup.enter)="search()"
            placeholder="Search for recipes..."
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-10"
          />
          <button
            (click)="search()"
            class="absolute right-2 top-2 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Search
          </button>
        </div>
      </div>

      <div *ngIf="loading" class="text-center py-4">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      </div>

      <div *ngIf="results.length > 0" class="grid md:grid-cols-2 gap-6">
        <div *ngFor="let result of results" class="bg-white rounded-lg shadow-md overflow-hidden">
          <img [src]="result.image" [alt]="result.title" class="w-full h-48 object-cover"/>
          <div class="p-4">
            <h3 class="text-lg font-semibold mb-2">{{ result.title }}</h3>
            <div class="flex flex-wrap gap-2">
              <span *ngFor="let cuisine of result.cuisineType" 
                class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {{ cuisine }}
              </span>
              <span *ngFor="let diet of result.dietLabels" 
                class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                {{ diet }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="!loading && results.length === 0 && searched" class="text-center py-4 text-gray-600">
        No results found. Try a different search term.
      </div>
    </div>
  `
})
export class SearchComponent {
  searchQuery = '';
  results: SearchResult[] = [];
  loading = false;
  searched = false;

  constructor(private searchService: SearchService) {}

  search() {
    if (!this.searchQuery.trim()) return;
    
    this.loading = true;
    this.searched = true;
    
    this.searchService.searchRecipes(this.searchQuery).subscribe(
      results => {
        this.results = results;
        this.loading = false;
      },
      error => {
        console.error('Search error:', error);
        this.loading = false;
      }
    );
  }
}

import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoogleMap, MapMarker } from '@angular/google-maps';

@Component({
  selector: 'app-restaurant-search',
  standalone: true,
  imports: [CommonModule, FormsModule, GoogleMap, MapMarker],
  template: `
    <div class="max-w-4xl mx-auto p-6">
      <!-- Search Bar -->
      <div class="mb-8">
        <div class="relative">
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (keyup.enter)="search()"
            placeholder="Search restaurants by name, address or cuisine..."
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
      
      <!-- Google Map -->
      <div class="mb-8">
        <google-map 
          height="400px" 
          width="100%" 
          [center]="center" 
          [zoom]="zoom">
          <map-marker 
            *ngFor="let marker of markers" 
            [position]="marker.position" 
            [title]="marker.title">
          </map-marker>
        </google-map>
      </div>
      
      <!-- Restaurant Results List -->
      <div *ngIf="results.length > 0" class="grid md:grid-cols-2 gap-6">
        <div 
          *ngFor="let result of results" 
          (click)="selectRestaurant(result)"
          class="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
          <img [src]="result.image" [alt]="result.name" class="w-full h-48 object-cover"/>
          <div class="p-4">
            <h3 class="text-lg font-semibold mb-2">{{ result.name }}</h3>
            <p class="text-sm text-gray-600">{{ result.address }}</p>
          </div>
        </div>
      </div>
      
      <!-- No Results Message -->
      <div *ngIf="!loading && results.length === 0 && searched" class="text-center py-4 text-gray-600">
        No restaurants found. Try a different search term.
      </div>
      
      <!-- Loading Spinner -->
      <div *ngIf="loading" class="text-center py-4">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    </div>
  `
})
export class SearchComponent implements OnInit, AfterViewInit {
  searchQuery = '';
  results: any[] = [];
  markers: Array<{ position: google.maps.LatLngLiteral; title: string }> = [];
  loading = false;
  searched = false;
  
  // Default center set to San Francisco
  center: google.maps.LatLngLiteral = { lat: 37.7749, lng: -122.4194 };
  zoom = 13;
  
  @ViewChild(GoogleMap, { static: false }) map!: GoogleMap;
  
  ngOnInit(): void { }
  ngAfterViewInit(): void { }
  
  search(): void {
    if (!this.searchQuery.trim()) return;
    this.loading = true;
    this.searched = true;
    
    if (this.map.googleMap) {
      const service = new google.maps.places.PlacesService(this.map.googleMap);
      const request: google.maps.places.TextSearchRequest = {
        query: this.searchQuery,
        type: 'restaurant',
        location: new google.maps.LatLng(this.center.lat, this.center.lng),
        radius: 5000
      };
      
      service.textSearch(request, (places, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && places) {
          this.results = places.map(place => ({
            name: place.name || 'No Name',
            address: place.formatted_address || '',
            location: {
              lat: place.geometry?.location?.lat() || 0,
              lng: place.geometry?.location?.lng() || 0
            },
            image: place.photos && place.photos.length > 0
              ? place.photos[0].getUrl({ maxWidth: 400, maxHeight: 300 })
              : 'https://via.placeholder.com/400x300?text=No+Image'
          }));
          this.setMarkers();
          // Re-center the map on the first result if available
          if (this.results.length > 0) {
            this.center = {
              lat: this.results[0].location.lat,
              lng: this.results[0].location.lng
            };
          }
        } else {
          this.results = [];
          // Optionally, clear markers if no results are found
          this.markers = [];
        }
        this.loading = false;
      });
    } else {
      console.error('Google Map not initialized yet.');
      this.loading = false;
    }
  }
  
  setMarkers(): void {
    this.markers = this.results.map(result => ({
      position: { lat: result.location.lat, lng: result.location.lng },
      title: result.name
    }));
  }
  
  // When a user clicks on a restaurant result, point the map to that place.
  selectRestaurant(restaurant: any): void {
    this.center = {
      lat: restaurant.location.lat,
      lng: restaurant.location.lng
    };
    // Optionally adjust the zoom level for a closer look
    this.zoom = 15;
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4744031721980736"
     crossorigin="anonymous"></script>
    <div class="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div class="container mx-auto px-4 py-16">
        <div class="text-center mb-16">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">
            Welcome to FlavorMatch
          </h1>
          <p class="text-xl text-gray-600 mb-8">
            Discover personalized food recommendations based on your taste preferences
          </p>
          <div class="space-x-4">
            <a 
              routerLink="/auth" 
              class="btn btn-primary"
            >
              Get Started
            </a>
            <a 
              routerLink="/search" 
              class="btn bg-white text-blue-600 border border-blue-600 hover:bg-blue-50"
            >
              Search Recipes
            </a>
            <a 
              routerLink="/questions" 
              class="btn bg-white text-blue-600 border border-blue-600 hover:bg-blue-50"
            >
              Ask Questions
            </a>
          </div>
        </div>

        <div class="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div class="card text-center">
            <div class="text-2xl mb-4">🍽️</div>
            <h3 class="text-xl font-semibold mb-2">Share Your Preferences</h3>
            <p class="text-gray-600">
              Tell us about your taste preferences, dietary restrictions, and favorite cuisines
            </p>
          </div>

          <div class="card text-center">
            <div class="text-2xl mb-4">🎯</div>
            <h3 class="text-xl font-semibold mb-2">Get Personalized</h3>
            <p class="text-gray-600">
              Receive customized food recommendations based on your unique profile
            </p>
          </div>

          <div class="card text-center">
            <div class="text-2xl mb-4">🌟</div>
            <h3 class="text-xl font-semibold mb-2">Discover New Flavors</h3>
            <p class="text-gray-600">
              Explore new dishes and cuisines that match your preferences
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class HomeComponent {}

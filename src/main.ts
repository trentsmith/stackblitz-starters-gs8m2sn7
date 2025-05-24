import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, RouterOutlet } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

// Import your page components
import { HomeComponent } from './app/components/home/home.component';
import { AuthComponent } from './app/components/auth/auth.component';
import { QuestionnaireComponent } from './app/components/questionnaire/questionnaire.component';
import { RecommendationsComponent } from './app/components/recommendations/recommendations.component';
import { SearchComponent } from './app/components/search/search.component';
import { QuestionsComponent } from './app/components/questions/questions.component';
// NOTE: Make sure the file name and export name match exactly

// Import your shared navbar
import { NavbarComponent } from './app/components/shared/navbar.component';
import { AdsComponent } from './app/components/ads/ads';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <router-outlet></router-outlet>
  `,
})
export class App {}

bootstrapApplication(App, {
  providers: [
    provideHttpClient(),
    provideRouter([
      { path: '', component: HomeComponent },
      { path: 'auth', component: AuthComponent },
      { path: 'search', component: SearchComponent },
      { path: 'rec', component: RecommendationsComponent },
      { path: 'questions', component: QuestionsComponent }, // "Ask a Question" page
      { path: 'ans', component: QuestionnaireComponent },
      { path: 'ads.txt', component: AdsComponent },
    ]),
  ],
});

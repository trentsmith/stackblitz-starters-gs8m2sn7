import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {
  constructor() {}

  askQuestion(question: string): Observable<string> {
    // For demo purposes, return mock responses
    const responses = [
      "Based on your preferences for spicy food, I'd recommend trying Thai or Indian cuisine.",
      "For a healthy Mediterranean diet, focus on olive oil, fresh vegetables, and lean proteins.",
      "To make food spicier, try adding chili flakes or fresh peppers during cooking.",
      "The best way to store fresh herbs is to wrap them in slightly damp paper towels."
    ];

    return of(responses[Math.floor(Math.random() * responses.length)]);

    // Uncomment below to use actual OpenAI API
    /*
    return this.http.post('YOUR_API_ENDPOINT', {
      question: question,
      context: 'food and cooking'
    }).pipe(
      map((response: any) => response.answer),
      catchError(error => {
        console.error('Error getting answer:', error);
        return of('Sorry, I could not process your question at this time.');
      })
    );
    */
  }
}
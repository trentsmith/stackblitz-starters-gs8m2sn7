import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-questions',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-100 py-8">
      <div class="max-w-2xl mx-auto">
        <div class="card p-6 bg-white rounded shadow-md">
          <h2 class="text-2xl font-bold mb-6">Ask a Question</h2>
          <p class="text-gray-600">Submit a food-related question here.</p>

          <input
            type="text"
            class="form-input w-full mt-4 p-2 border rounded"
            placeholder="Type your question..."
          />
          <button class="btn btn-primary w-full mt-4">Submit</button>

          <!-- For real logic, you'd inject a service and handle the form. -->
        </div>
      </div>
    </div>
  `
})
export class QuestionsComponent {}

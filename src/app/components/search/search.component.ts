import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-restaurant-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
 <div>hi</div>
  `
})
export class SearchComponent implements OnInit {
 ngOnInit(): void {
   console.log('hi');
 }
}
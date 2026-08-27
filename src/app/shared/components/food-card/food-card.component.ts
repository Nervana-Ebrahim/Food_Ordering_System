import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Food } from '../../../core/models/food.model';
import { Category } from '../../../core/models/category.model';

@Component({
  selector: 'app-food-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './food-card.component.html',
  styleUrl: './food-card.component.scss',
})
export class FoodCardComponent {
  @Input({ required: true }) food!: Food;
  @Output() addToCart = new EventEmitter<Food>();

  get categoryName(): string {
    const category = this.food.category as Category;
    return typeof this.food.category === 'string' ? '' : category?.name || '';
  }

  onAddToCart(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.addToCart.emit(this.food);
  }
}
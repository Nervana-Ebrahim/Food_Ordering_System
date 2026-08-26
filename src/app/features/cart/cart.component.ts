import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { ToastService } from '../../core/services/toast.service';
import { Food } from '../../core/models/food.model';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingComponent, EmptyStateComponent],
  templateUrl: './cart.component.html',
})
export class CartComponent implements OnInit {
  cartService = inject(CartService);
  private toast = inject(ToastService);

  loading = signal(true);
  updatingId = signal<string | null>(null);

  ngOnInit(): void {
    this.cartService.loadCart().subscribe({
      next: () => this.loading.set(false),
      error: () => this.loading.set(false),
    });
  }

  foodId(food: Food | string | Pick<Food, '_id' | 'name' | 'image' | 'available'>): string {
    return typeof food === 'string' ? food : food._id;
  }

  foodName(food: Food | string | Pick<Food, '_id' | 'name' | 'image' | 'available'>): string {
    return typeof food === 'string' ? 'Item' : food.name;
  }

  foodImage(food: Food | string | Pick<Food, '_id' | 'name' | 'image' | 'available'>): string {
    return typeof food === 'string' ? '' : food.image || 'https://placehold.co/120x120?text=Food';
  }

  increase(foodId: string, currentQty: number): void {
    this.updatingId.set(foodId);
    this.cartService.updateItemQuantity(foodId, { quantity: currentQty + 1 }).subscribe({
      next: () => this.updatingId.set(null),
      error: () => this.updatingId.set(null),
    });
  }

  decrease(foodId: string, currentQty: number): void {
    if (currentQty <= 1) return;
    this.updatingId.set(foodId);
    this.cartService.updateItemQuantity(foodId, { quantity: currentQty - 1 }).subscribe({
      next: () => this.updatingId.set(null),
      error: () => this.updatingId.set(null),
    });
  }

  remove(foodId: string): void {
    this.updatingId.set(foodId);
    this.cartService.removeItem(foodId).subscribe({
      next: () => {
        this.updatingId.set(null);
        this.toast.info('Item removed from cart');
      },
      error: () => this.updatingId.set(null),
    });
  }

  clearCart(): void {
    if (!confirm('Clear your entire cart?')) return;
    this.cartService.clearCart().subscribe({
      next: () => this.toast.info('Cart cleared'),
      error: () => {},
    });
  }
}

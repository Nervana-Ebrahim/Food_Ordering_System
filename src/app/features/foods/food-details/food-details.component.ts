import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FoodService } from '../../../core/services/food.service';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { Food } from '../../../core/models/food.model';
import { Category } from '../../../core/models/category.model';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-food-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LoadingComponent, EmptyStateComponent],
  templateUrl: './food-details.component.html',
})
export class FoodDetailsComponent implements OnInit {
  private foodService = inject(FoodService);
  private cartService = inject(CartService);
  private toast = inject(ToastService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  auth = inject(AuthService);

  loading = signal(true);
  notFound = signal(false);
  food = signal<Food | null>(null);
  quantity = 1;
  adding = signal(false);

  get categoryName(): string {
    const food = this.food();
    if (!food) return '';
    const category = food.category as Category;
    return typeof food.category === 'string' ? '' : category?.name  '';
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.notFound.set(true);
      this.loading.set(false);
      return;
    }

    this.foodService.getById(id).subscribe({
      next: (res) => {
        this.food.set(res.data?.food ?? null);
        this.loading.set(false);
      },
      error: () => {
        this.notFound.set(true);
        this.loading.set(false);
      },
    });
  }

  increment(): void {
    this.quantity++;
  }

  decrement(): void {
    if (this.quantity > 1) this.quantity--;
  }

  addToCart(): void {
    const food = this.food();
    if (!food  !food.available) return;

    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    this.adding.set(true);
    this.cartService.addItem({ food: food._id, quantity: this.quantity }).subscribe({
      next: () => {
        this.adding.set(false);
        this.toast.success(${food.name} added to cart);
      },
      error: () => this.adding.set(false),
    });
  }
}
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FoodService } from '../../../core/services/food.service';
import { CategoryService } from '../../../core/services/category.service';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { Food } from '../../../core/models/food.model';
import { Category } from '../../../core/models/category.model';
import { FoodCardComponent } from '../../../shared/components/food-card/food-card.component';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-food-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FoodCardComponent,
    LoadingComponent,
    EmptyStateComponent,
    PaginationComponent,
  ],
  templateUrl: './food-list.component.html',
})
export class FoodListComponent implements OnInit {
  private foodService = inject(FoodService);
  private categoryService = inject(CategoryService);
  private cartService = inject(CartService);
  private toast = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  auth = inject(AuthService);

  loading = signal(true);
  error = signal(false);
  foods = signal<Food[]>([]);
  categories = signal<Category[]>([]);

  page = 1;
  totalPages = 1;
  readonly limit = 8;

  filters = {
    search: '',
    category: '',
    minPrice: null as number | null,
    maxPrice: null as number | null,
    available: false,
  };

  ngOnInit(): void {
    this.categoryService.getAll().subscribe({
      next: (res) => this.categories.set(res.data?.categories ?? []),
      error: () => {},
    });

    this.route.queryParamMap.subscribe((params) => {
      this.filters.search = params.get('search') ?? '';
      this.filters.category = params.get('category') ?? '';
      this.page = 1;
      this.fetchFoods();
    });
  }

  fetchFoods(): void {
    this.loading.set(true);
    this.error.set(false);

    const request$ = this.filters.search
      ? this.foodService.search(this.filters.search, this.page, this.limit)
      : this.foodService.getAll({
          page: this.page,
          limit: this.limit,
          category: this.filters.category || undefined,
          available: this.filters.available || undefined,
          minPrice: this.filters.minPrice ?? undefined,
          maxPrice: this.filters.maxPrice ?? undefined,
        });

    request$.subscribe({
      next: (res) => {
        this.foods.set(res.data?.foods ?? []);
        this.totalPages = res.meta?.totalPages ?? 1;
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.error.set(true);
      },
    });
  }

  applyFilters(): void {
    this.page = 1;
    this.fetchFoods();
  }

  clearFilters(): void {
    this.filters = { search: '', category: '', minPrice: null, maxPrice: null, available: false };
    this.page = 1;
    this.router.navigate(['/foods']);
  }

  onPageChange(page: number): void {
    this.page = page;
    this.fetchFoods();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  addToCart(food: Food): void {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    this.cartService.addItem({ food: food._id, quantity: 1 }).subscribe({
      next: () => this.toast.success(`${food.name} added to cart`),
      error: () => {},
    });
  }
}

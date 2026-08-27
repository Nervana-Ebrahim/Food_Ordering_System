import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FoodService } from '../../../core/services/food.service';
import { CategoryService } from '../../../core/services/category.service';
import { ToastService } from '../../../core/services/toast.service';
import { Food } from '../../../core/models/food.model';
import { Category } from '../../../core/models/category.model';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-admin-foods',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LoadingComponent, EmptyStateComponent, PaginationComponent],
  templateUrl: './foods.component.html',
})
export class AdminFoodsComponent implements OnInit {
  private foodService = inject(FoodService);
  private categoryService = inject(CategoryService);
  private toast = inject(ToastService);

  loading = signal(true);
  foods = signal<Food[]>([]);
  categories = signal<Category[]>([]);
  page = 1;
  totalPages = 1;
  updatingId = signal<string | null>(null);

  searchTerm = '';
  categoryFilter = '';

  ngOnInit(): void {
    this.categoryService.getAll().subscribe({
      next: (res) => this.categories.set(res.data?.categories ?? []),
      error: () => {},
    });
    this.fetchFoods();
  }

  fetchFoods(): void {
    this.loading.set(true);
    const request$ = this.searchTerm.trim()
      ? this.foodService.search(this.searchTerm.trim(), this.page, 10)
      : this.foodService.getAll({ page: this.page, limit: 10, category: this.categoryFilter || undefined });

    request$.subscribe({
      next: (res) => {
        this.foods.set(res.data?.foods ?? []);
        this.totalPages = res.meta?.totalPages ?? 1;
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  applyFilters(): void {
    this.page = 1;
    this.fetchFoods();
  }

  onPageChange(page: number): void {
    this.page = page;
    this.fetchFoods();
  }

  categoryName(food: Food): string {
    const category = food.category as Category;
    return typeof food.category === 'string' ? '' : category?.name || '';
  }

  toggleAvailability(food: Food): void {
    this.updatingId.set(food._id);
    this.foodService.update(food._id, { available: !food.available }).subscribe({
      next: (res) => {
        this.updatingId.set(null);
        if (res.data?.food) {
          this.foods.update((list) => list.map((f) => (f._id === food._id ? res.data!.food : f)));
        }
        this.toast.success(`${food.name} is now ${!food.available ? 'available' : 'unavailable'}`);
      },
      error: () => this.updatingId.set(null),
    });
  }

  deleteFood(food: Food): void {
    if (!confirm(`Delete food "${food.name}"?`)) return;
    this.foodService.delete(food._id).subscribe({
      next: () => {
        this.toast.success('Food deleted');
        this.fetchFoods();
      },
      error: () => {},
    });
  }
}

import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CategoryService } from '../../../core/services/category.service';
import { ToastService } from '../../../core/services/toast.service';
import { Category } from '../../../core/models/category.model';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingComponent, EmptyStateComponent],
  templateUrl: './categories.component.html',
})
export class AdminCategoriesComponent implements OnInit {
  private categoryService = inject(CategoryService);
  private toast = inject(ToastService);

  loading = signal(true);
  categories = signal<Category[]>([]);

  ngOnInit(): void {
    this.fetchCategories();
  }

  fetchCategories(): void {
    this.loading.set(true);
    this.categoryService.getAll().subscribe({
      next: (res) => {
        this.categories.set(res.data?.categories ?? []);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  deleteCategory(category: Category): void {
    if (!confirm(Delete category "${category.name}"? Foods using it must be removed first.)) return;
    this.categoryService.delete(category._id).subscribe({
      next: () => {
        this.toast.success('Category deleted');
        this.fetchCategories();
      },
      error: () => {},
    });
  }
}
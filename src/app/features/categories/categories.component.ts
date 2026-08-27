import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CategoryService } from '../../core/services/category.service';
import { Category } from '../../core/models/category.model';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingComponent, EmptyStateComponent],
  templateUrl: './categories.component.html',
})
export class CategoriesComponent implements OnInit {
  private categoryService = inject(CategoryService);

  loading = signal(true);
  categories = signal<Category[]>([]);

  ngOnInit(): void {
    this.categoryService.getAll().subscribe({
      next: (res) => {
        this.categories.set(res.data?.categories ?? []);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}

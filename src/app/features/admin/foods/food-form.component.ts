import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FoodService } from '../../../core/services/food.service';
import { CategoryService } from '../../../core/services/category.service';
import { ToastService } from '../../../core/services/toast.service';
import { Category } from '../../../core/models/category.model';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';

@Component({
  selector: 'app-food-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LoadingComponent],
  templateUrl: './food-form.component.html',
})
export class FoodFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private foodService = inject(FoodService);
  private categoryService = inject(CategoryService);
  private toast = inject(ToastService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  foodId: string | null = null;
  loading = signal(false);
  saving = signal(false);
  categories = signal<Category[]>([]);

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]],
    description: ['', [Validators.maxLength(1000)]],
    price: [0, [Validators.required, Validators.min(0)]],
    image: [''],
    category: ['', [Validators.required]],
    available: [true],
  });

  get f() {
    return this.form.controls;
  }

  get isEditMode(): boolean {
    return !!this.foodId;
  }

  ngOnInit(): void {
    this.categoryService.getAll().subscribe({
      next: (res) => this.categories.set(res.data?.categories ?? []),
      error: () => {},
    });

    this.foodId = this.route.snapshot.paramMap.get('id');
    if (this.foodId) {
      this.loading.set(true);
      this.foodService.getById(this.foodId).subscribe({
        next: (res) => {
          const food = res.data?.food;
          if (food) {
            const categoryId = typeof food.category === 'string' ? food.category : food.category._id;
            this.form.patchValue({
              name: food.name,
              description: food.description || '',
              price: food.price,
              image: food.image || '',
              category: categoryId,
              available: food.available,
            });
          }
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.router.navigate(['/admin/foods']);
        },
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    const payload = this.form.getRawValue();
    const request$ = this.isEditMode
      ? this.foodService.update(this.foodId!, payload)
      : this.foodService.create(payload);

    request$.subscribe({
      next: () => {
        this.saving.set(false);
        this.toast.success(`Food ${this.isEditMode ? 'updated' : 'created'} successfully`);
        this.router.navigate(['/admin/foods']);
      },
      error: () => this.saving.set(false),
    });
  }
}

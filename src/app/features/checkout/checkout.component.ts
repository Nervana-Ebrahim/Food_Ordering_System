import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, EmptyStateComponent],
  templateUrl: './checkout.component.html',
})
export class CheckoutComponent implements OnInit {
  private fb = inject(FormBuilder);
  cartService = inject(CartService);
  private orderService = inject(OrderService);
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  private router = inject(Router);

  loadingCart = signal(true);
  submitting = signal(false);

  form = this.fb.nonNullable.group({
    address: [this.auth.currentUser()?.address || '', [Validators.required, Validators.maxLength(300)]],
    paymentMethod: ['Cash' as 'Cash' | 'Card', [Validators.required]],
  });

  get f() {
    return this.form.controls;
  }

  ngOnInit(): void {
    this.cartService.loadCart().subscribe({
      next: () => this.loadingCart.set(false),
      error: () => this.loadingCart.set(false),
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    // The backend recalculates the total from the current cart — the
    // frontend never sends prices, only address + payment method.
    this.orderService.createOrder(this.form.getRawValue()).subscribe({
      next: () => {
        this.submitting.set(false);
        this.cartService.resetLocalState();
        this.toast.success('Order placed successfully!');
        this.router.navigate(['/orders']);
      },
      error: () => this.submitting.set(false),
    });
  }
}

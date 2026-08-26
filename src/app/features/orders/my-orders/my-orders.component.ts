import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { ToastService } from '../../../core/services/toast.service';
import { Order, OrderStatus } from '../../../core/models/order.model';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { StatusBadgeClassPipe } from '../../../shared/pipes/status-badge-class.pipe';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    LoadingComponent,
    EmptyStateComponent,
    PaginationComponent,
    StatusBadgeClassPipe,
  ],
  templateUrl: './my-orders.component.html',
})
export class MyOrdersComponent implements OnInit {
  private orderService = inject(OrderService);
  private toast = inject(ToastService);

  loading = signal(true);
  orders = signal<Order[]>([]);
  page = 1;
  totalPages = 1;
  statusFilter: OrderStatus | '' = '';
  readonly statuses: OrderStatus[] = [
    'Pending',
    'Confirmed',
    'Preparing',
    'OutForDelivery',
    'Delivered',
    'Cancelled',
  ];

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders(): void {
    this.loading.set(true);
    this.orderService
      .getMyOrders({ page: this.page, limit: 10, status: this.statusFilter || undefined })
      .subscribe({
        next: (res) => {
          this.orders.set(res.data?.orders ?? []);
          this.totalPages = res.meta?.totalPages ?? 1;
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }

  onFilterChange(): void {
    this.page = 1;
    this.fetchOrders();
  }

  onPageChange(page: number): void {
    this.page = page;
    this.fetchOrders();
  }

  cancelOrder(order: Order, event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    if (!confirm('Cancel this order?')) return;

    this.orderService.cancelOrder(order._id).subscribe({
      next: () => {
        this.toast.success('Order cancelled');
        this.fetchOrders();
      },
      error: () => {},
    });
  }

  canCancel(order: Order): boolean {
    return order.status === 'Pending' || order.status === 'Confirmed';
  }
}

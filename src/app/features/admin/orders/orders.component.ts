import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { ToastService } from '../../../core/services/toast.service';
import { Order, OrderStatus } from '../../../core/models/order.model';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { StatusBadgeClassPipe } from '../../../shared/pipes/status-badge-class.pipe';

@Component({
  selector: 'app-admin-orders',
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
  templateUrl: './orders.component.html',
})
export class AdminOrdersComponent implements OnInit {
  private orderService = inject(OrderService);
  private toast = inject(ToastService);
  private route = inject(ActivatedRoute);

  loading = signal(true);
  orders = signal<Order[]>([]);
  page = 1;
  totalPages = 1;
  statusFilter: OrderStatus | '' = '';
  updatingId = signal<string | null>(null);

  readonly statuses: OrderStatus[] = [
    'Pending',
    'Confirmed',
    'Preparing',
    'OutForDelivery',
    'Delivered',
    'Cancelled',
  ];

  ngOnInit(): void {
    const initialStatus = this.route.snapshot.queryParamMap.get('status') as OrderStatus | null;
    if (initialStatus) this.statusFilter = initialStatus;
    this.fetchOrders();
  }

  fetchOrders(): void {
    this.loading.set(true);
    this.orderService
      .getAllOrders({ page: this.page, limit: 10, status: this.statusFilter || undefined })
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

  customerName(order: Order): string {
    return typeof order.user === 'string' ? order.user : order.user?.name || 'Unknown';
  }

  updateStatus(order: Order, status: OrderStatus): void {
    if (order.status === status) return;
    this.updatingId.set(order._id);
    this.orderService.updateStatus(order._id, status).subscribe({
      next: (res) => {
        this.updatingId.set(null);
        if (res.data?.order) {
          this.orders.update((list) => list.map((o) => (o._id === order._id ? res.data!.order : o)));
        }
        this.toast.success(`Order status updated to ${status}`);
      },
      error: () => this.updatingId.set(null),
    });
  }

  isFinal(order: Order): boolean {
    return order.status === 'Delivered' || order.status === 'Cancelled';
  }
}

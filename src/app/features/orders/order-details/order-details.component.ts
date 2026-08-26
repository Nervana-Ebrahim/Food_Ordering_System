import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { ToastService } from '../../../core/services/toast.service';
import { Order } from '../../../core/models/order.model';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { StatusTimelineComponent } from '../../../shared/components/status-timeline/status-timeline.component';
import { StatusBadgeClassPipe } from '../../../shared/pipes/status-badge-class.pipe';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    LoadingComponent,
    EmptyStateComponent,
    StatusTimelineComponent,
    StatusBadgeClassPipe,
  ],
  templateUrl: './order-details.component.html',
})
export class OrderDetailsComponent implements OnInit {
  private orderService = inject(OrderService);
  private toast = inject(ToastService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  loading = signal(true);
  notFound = signal(false);
  order = signal<Order | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.notFound.set(true);
      this.loading.set(false);
      return;
    }
    this.fetchOrder(id);
  }

  fetchOrder(id: string): void {
    this.loading.set(true);
    this.orderService.getById(id).subscribe({
      next: (res) => {
        this.order.set(res.data?.order ?? null);
        this.loading.set(false);
      },
      error: () => {
        this.notFound.set(true);
        this.loading.set(false);
      },
    });
  }

  canCancel(order: Order): boolean {
    return order.status === 'Pending' || order.status === 'Confirmed';
  }

  cancelOrder(): void {
    const order = this.order();
    if (!order) return;
    if (!confirm('Cancel this order?')) return;

    this.orderService.cancelOrder(order._id).subscribe({
      next: (res) => {
        this.order.set(res.data?.order ?? order);
        this.toast.success('Order cancelled');
      },
      error: () => {},
    });
  }
}

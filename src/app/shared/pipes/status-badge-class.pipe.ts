import { Pipe, PipeTransform } from '@angular/core';
import { OrderStatus } from '../../core/models/order.model';

// Maps an order status to a Bootstrap badge color class for consistent
// visual treatment across My Orders / Order Details / Admin Orders.
@Pipe({ name: 'statusBadgeClass', standalone: true })
export class StatusBadgeClassPipe implements PipeTransform {
  transform(status: OrderStatus): string {
    switch (status) {
      case 'Pending':
        return 'text-bg-warning';
      case 'Confirmed':
        return 'text-bg-info';
      case 'Preparing':
        return 'text-bg-primary';
      case 'OutForDelivery':
        return 'text-bg-secondary';
      case 'Delivered':
        return 'text-bg-success';
      case 'Cancelled':
        return 'text-bg-danger';
      default:
        return 'text-bg-light';
    }
  }
}

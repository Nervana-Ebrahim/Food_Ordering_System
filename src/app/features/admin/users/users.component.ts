import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { User, UserRole } from '../../../core/models/user.model';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingComponent, EmptyStateComponent, PaginationComponent],
  templateUrl: './users.component.html',
})
export class UsersComponent implements OnInit {
  private userService = inject(UserService);
  private toast = inject(ToastService);
  auth = inject(AuthService);

  loading = signal(true);
  users = signal<User[]>([]);
  page = 1;
  totalPages = 1;
  updatingId = signal<string | null>(null);

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.loading.set(true);
    this.userService.getAllUsers(this.page, 10).subscribe({
      next: (res) => {
        this.users.set(res.data?.users ?? []);
        this.totalPages = res.meta?.totalPages ?? 1;
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  onPageChange(page: number): void {
    this.page = page;
    this.fetchUsers();
  }

  changeRole(user: User, role: UserRole): void {
    if (user.role === role) return;
    this.updatingId.set(user._id);
    this.userService.updateUserRole(user._id, role).subscribe({
      next: (res) => {
        this.updatingId.set(null);
        if (res.data?.user) {
          this.users.update((list) => list.map((u) => (u._id === user._id ? res.data!.user : u)));
        }
        this.toast.success(`${user.name}'s role updated to ${role}`);
      },
      error: () => this.updatingId.set(null),
    });
  }

  deleteUser(user: User): void {
    if (!confirm(`Delete user "${user.name}"? This cannot be undone.`)) return;
    this.userService.deleteUser(user._id).subscribe({
      next: () => {
        this.toast.success('User deleted');
        this.fetchUsers();
      },
      error: () => {},
    });
  }
}

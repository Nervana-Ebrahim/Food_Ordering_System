import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { ToastService } from '../../core/services/toast.service';
import { LoadingComponent } from '../../shared/components/loading/loading.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoadingComponent],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private toast = inject(ToastService);

  loading = signal(true);
  saving = signal(false);

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    phone: [''],
    address: [''],
    password: ['', [Validators.minLength(6)]],
  });

  get f() {
    return this.form.controls;
  }

  ngOnInit(): void {
    this.userService.getProfile().subscribe({
      next: (res) => {
        const user = res.data?.user;
        if (user) {
          this.form.patchValue({
            name: user.name,
            phone: user.phone || '',
            address: user.address || '',
          });
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    const payload = {
      name: raw.name,
      phone: raw.phone || undefined,
      address: raw.address || undefined,
      password: raw.password || undefined,
    };

    this.saving.set(true);
    this.userService.updateProfile(payload).subscribe({
      next: (res) => {
        this.saving.set(false);
        if (res.data?.user) this.authService.updateLocalUser(res.data.user);
        this.form.patchValue({ password: '' });
        this.toast.success('Profile updated successfully');
      },
      error: () => this.saving.set(false),
    });
  }
}

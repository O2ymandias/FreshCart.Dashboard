import { Component, DestroyRef, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ToasterService } from '../../../core/services/toaster-service';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth-service';
import { tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-logout',
  imports: [ButtonModule],
  templateUrl: './logout.html',
  styleUrl: './logout.scss',
})
export class Logout {
  private readonly _authService = inject(AuthService);
  private readonly _router = inject(Router);
  private readonly _toasterService = inject(ToasterService);
  private readonly _destroyRef = inject(DestroyRef);

  logout() {
    this._authService
      .revokeToken$()
      .pipe(
        tap((res) => {
          if (res) {
            this._router.navigate(['/login']);
            this._toasterService.success(
              "You've been logged out successfully. Please login again.",
            );
          }
        }),

        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }
}

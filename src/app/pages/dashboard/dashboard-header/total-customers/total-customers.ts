import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Card } from 'primeng/card';
import { tap } from 'rxjs';
import { UsersService } from '../../../../core/services/users-service';
import { ButtonModule } from "primeng/button";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-total-customers',
  imports: [Card, ButtonModule, RouterLink],
  templateUrl: './total-customers.html',
  styleUrl: './total-customers.scss',
})
export class TotalCustomers {
  private readonly _usersService = inject(UsersService);
  private readonly _destroyRef = inject(DestroyRef);

  totalCustomers = signal(0);

  ngOnInit(): void {
    this._initialize();
  }

  private _initialize() {
    this._usersService
      .getUsersCount$()
      .pipe(
        tap((res) => this.totalCustomers.set(res)),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }
}

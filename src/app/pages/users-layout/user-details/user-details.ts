import {
  Component,
  DestroyRef,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { UserService } from '../../../core/services/user-service';
import { UserInfo } from '../../../shared/models/users-model';
import { tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { MessageModule } from 'primeng/message';
import { BadgeModule } from 'primeng/badge';
import { OrderService } from '../../../core/services/order-service';
import { OrderResult } from '../../../shared/models/orders-model';

@Component({
  selector: 'app-user-details',
  imports: [BreadcrumbModule, MessageModule, BadgeModule],
  templateUrl: './user-details.html',
  styleUrl: './user-details.scss',
})
export class UserDetails implements OnInit {
  private readonly _userService = inject(UserService);
  private readonly _orderService = inject(OrderService);
  private readonly _destroyRef = inject(DestroyRef);

  id = input.required<string>();
  user = signal<UserInfo | null>(null);

  orders = signal<OrderResult[]>([]);

  navigationItems: MenuItem[] = [
    {
      label: 'Home',
      routerLink: '/dashboard',
      icon: 'pi pi-home',
    },
    {
      label: 'Users',
      routerLink: '/users',
    },
    {
      label: 'User Details',
      disabled: true,
    },
  ];

  ngOnInit(): void {
    this._getUserDetails();
    this._getOrders();
  }

  private _getUserDetails(): void {
    this._userService
      .getUser$(this.id())
      .pipe(
        tap((res) => this.user.set(res)),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }

  private _getOrders() {
    this._orderService
      .getOrders$({
        pageNumber: 1,
        pageSize: 10,
        userId: this.id(),
      })
      .pipe(
        tap((res) => {
          this.orders.set(res.results);
          console.log(res);
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }
}

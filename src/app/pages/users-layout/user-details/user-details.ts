import { Component, input } from '@angular/core';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { MessageModule } from 'primeng/message';
import { BadgeModule } from 'primeng/badge';
import { UserOrders } from './user-orders/user-orders';
import { TagModule } from 'primeng/tag';
import { UserInfo } from './user-info/user-info';

@Component({
  selector: 'app-user-details',
  imports: [
    BreadcrumbModule,
    MessageModule,
    BadgeModule,
    UserOrders,
    TagModule,
    UserInfo,
  ],
  templateUrl: './user-details.html',
  styleUrl: './user-details.scss',
})
export class UserDetails {
  id = input.required<string>();

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
}

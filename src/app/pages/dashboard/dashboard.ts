import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { RecentOrders } from './recent-orders/recent-orders';

@Component({
  selector: 'app-dashboard',
  imports: [CardModule, RecentOrders],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {}

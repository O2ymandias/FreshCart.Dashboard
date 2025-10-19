import { Component } from '@angular/core';
import { RecentOrders } from './recent-orders/recent-orders';
import { DashboardHeader } from "./dashboard-header/dashboard-header";

@Component({
  selector: 'app-dashboard',
  imports: [RecentOrders, DashboardHeader],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {}

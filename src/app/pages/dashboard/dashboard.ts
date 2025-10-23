import { Component } from '@angular/core';
import { RecentOrders } from './recent-orders/recent-orders';
import { DashboardHeader } from './dashboard-header/dashboard-header';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { SalesChart } from "./sales-chart/sales-chart";

@Component({
  selector: 'app-dashboard',
  imports: [RecentOrders, DashboardHeader, CardModule, ChartModule, SalesChart],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {}

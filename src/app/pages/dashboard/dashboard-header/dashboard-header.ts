import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TotalSales } from './total-sales/total-sales';
import { TotalOrders } from './total-orders/total-orders';
import { TotalCustomers } from './total-customers/total-customers';
import { PendingOrders } from './pending-orders/pending-orders';

@Component({
  selector: 'app-dashboard-header',
  imports: [
    CardModule,
    TotalSales,
    TotalOrders,
    TotalCustomers,
    PendingOrders,
    CardModule,
  ],
  templateUrl: './dashboard-header.html',
  styleUrl: './dashboard-header.scss',
})
export class DashboardHeader {}

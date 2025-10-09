import { Component, signal } from '@angular/core';
import { DrawerModule } from 'primeng/drawer';
import { SelectModule } from 'primeng/select';
import { OrderStatus } from '../../../shared/models/orders-model';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-filtration-drawer',
  imports: [DrawerModule, SelectModule, FormsModule, ButtonModule],
  templateUrl: './filtration-drawer.html',
  styleUrl: './filtration-drawer.scss',
})
export class FiltrationDrawer {
  visible = signal(false);

  selectedOrderStatus = signal<
    { label: string; value: OrderStatus } | undefined
  >(undefined);

  OrderStatusOptions: { label: string; value: OrderStatus }[] = [
    {
      label: 'Pending',
      value: 'Pending',
    },
    {
      label: 'Processing',
      value: 'Processing',
    },
    {
      label: 'Shipped',
      value: 'Shipped',
    },
    {
      label: 'Delivered',
      value: 'Delivered',
    },
    {
      label: 'Cancelled',
      value: 'Cancelled',
    },
  ];

  filterByOrderStatus(): void {
    // this._loadOrders({
    //   pageNumber: this.DEFAULT_PAGE_NUMBER,
    //   pageSize: this.pageSize(),
    //   orderId: this.searchByOrderId(),
    //   orderStatus: this.selectedOrderStatus()?.value,
    // });
  }
}

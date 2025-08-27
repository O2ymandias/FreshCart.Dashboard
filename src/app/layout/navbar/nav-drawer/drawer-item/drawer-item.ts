import { Component, input } from '@angular/core';
import { Ripple } from 'primeng/ripple';

@Component({
  selector: 'app-drawer-item',
  imports: [Ripple],
  templateUrl: './drawer-item.html',
  styleUrl: './drawer-item.scss',
})
export class DrawerItem {
  icon = input.required<string>();
  label = input.required<string>();
}

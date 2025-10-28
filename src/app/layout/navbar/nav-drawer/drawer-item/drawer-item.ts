import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-drawer-item',
  imports: [RouterLink],
  templateUrl: './drawer-item.html',
  styleUrl: './drawer-item.scss',
})
export class DrawerItem {
  icon = input.required<string>();
  label = input.required<string>();
  routerLink = input.required<string>();
}

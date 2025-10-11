import { Component, inject, signal, viewChild } from '@angular/core';
import { Button, ButtonModule } from 'primeng/button';
import { Avatar, AvatarModule } from 'primeng/avatar';
import { Drawer, DrawerModule } from 'primeng/drawer';
import { StyleClass } from 'primeng/styleclass';
import { Ripple } from 'primeng/ripple';

import { Logo } from '../logo/logo';
import { DrawerItem } from './drawer-item/drawer-item';
import { AuthService } from '../../../core/services/auth/auth-service';

@Component({
  selector: 'app-nav-drawer',
  imports: [
    Button,
    Avatar,
    Logo,
    DrawerModule,
    ButtonModule,
    Ripple,
    AvatarModule,
    StyleClass,
    DrawerItem,
  ],
  templateUrl: './nav-drawer.html',
  styleUrl: './nav-drawer.scss',
})
export class NavDrawer {
  private readonly _authService = inject(AuthService);

  drawerRef = viewChild.required<Drawer>('drawerRef');
  visible = signal(false);

  jwtPayload = this._authService.jwtPayload;

  closeCallback(e: MouseEvent): void {
    this.drawerRef().close(e);
  }
  showDrawer() {
    this.visible.set(true);
  }
  hideDrawer() {
    this.visible.set(false);
  }
}

import { Component, signal } from '@angular/core';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { Menubar } from 'primeng/menubar';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { ThemeController } from './theme-controller/theme-controller';
import { NavDrawer } from './nav-drawer/nav-drawer';
import { Logo } from './logo/logo';
@Component({
  selector: 'app-navbar',
  imports: [
    Menubar,
    BadgeModule,
    AvatarModule,
    InputTextModule,
    DrawerModule,
    ButtonModule,
    FormsModule,
    ThemeController,
    NavDrawer,
    Logo,
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  checked = signal(false);
}

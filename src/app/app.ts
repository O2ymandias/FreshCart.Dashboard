import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './layout/navbar/navbar';
import { Toast } from 'primeng/toast';
import { ScrollTopModule } from 'primeng/scrolltop';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Toast, ScrollTopModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('FreshCart.Dashboard');
}

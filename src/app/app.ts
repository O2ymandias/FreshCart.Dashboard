import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './layout/navbar/navbar';
import { Toast } from 'primeng/toast';
import { ScrollTopModule } from 'primeng/scrolltop';
import { ToasterService } from './core/services/toaster-service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Toast, ScrollTopModule, ConfirmDialogModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly _toasterService = inject(ToasterService);
  protected readonly title = signal('FreshCart.Dashboard');

  toasterKey = this._toasterService.TOASTER_KEY;
}

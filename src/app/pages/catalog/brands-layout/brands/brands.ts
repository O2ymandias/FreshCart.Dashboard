import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { Table, TableModule } from 'primeng/table';
import { BrandsService } from '../../../../core/services/brands-service';
import { BrandResult } from '../../../../shared/brands-model';
import { catchError, switchMap, tap, throwError } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IconFieldModule } from 'primeng/iconfield';
import { DialogModule } from 'primeng/dialog';
import { Router, RouterLink } from '@angular/router';
import { ToasterService } from '../../../../core/services/toaster-service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-brands',
  imports: [
    Breadcrumb,
    TableModule,
    ButtonModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    DialogModule,
    RouterLink,
  ],
  templateUrl: './brands.html',
  styleUrl: './brands.scss',
})
export class Brands implements OnInit {
  // Dependencies
  private readonly _brandsService = inject(BrandsService);
  private readonly _confirmationService = inject(ConfirmationService);
  private readonly _router = inject(Router);
  private readonly _toasterService = inject(ToasterService);
  private readonly _destroyRef = inject(DestroyRef);

  // Properties
  table = viewChild.required<Table<BrandResult>>('dt');
  brands = signal<BrandResult[]>([]);
  navigationItems: MenuItem[] = [
    {
      label: 'Home',
      routerLink: '/dashboard',
      icon: 'pi pi-home',
    },
    {
      label: 'Brands',
      disabled: true,
    },
  ];

  // Lifecycle hooks
  ngOnInit(): void {
    this._getBrands();
  }

  // Methods
  onSearch(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.table().filterGlobal(val, 'contains');
  }

  OnDeleteBrand(event: Event, brandId: number) {
    this._confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this brand?',
      header: 'Delete Brand',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancel',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Delete',
        severity: 'danger',
      },

      accept: () => this._deleteBrand(brandId),
    });
  }

  private _getBrands(): void {
    this._brandsService
      .getBrands$()
      .pipe(
        tap((res) => this.brands.set(res)),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }

  private _deleteBrand(brandId: number): void {
    this._brandsService
      .deleteBrand(brandId)
      .pipe(
        tap((res) => this._toasterService.success(res.message)),
        switchMap(() =>
          this._brandsService
            .getBrands$()
            .pipe(tap((res) => this.brands.set(res))),
        ),
        catchError((err: HttpErrorResponse) => {
          this._toasterService.error(err.error.message);
          return throwError(() => err);
        }),

        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }
}

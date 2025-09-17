import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { BrandsService } from '../../../../core/services/brands-service';
import { IBrandResult } from '../../../../shared/brands-model';
import { tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IconFieldModule } from 'primeng/iconfield';
import { EditBrands } from './edit-brands/edit-brands';

@Component({
  selector: 'app-brands',
  imports: [
    Breadcrumb,
    TableModule,
    ButtonModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    EditBrands,
  ],
  templateUrl: './brands.html',
  styleUrl: './brands.scss',
})
export class Brands implements OnInit {
  // Dependencies
  private readonly _brandsService = inject(BrandsService);
  private readonly _destroyRef = inject(DestroyRef);

  // Properties
  brands = signal<IBrandResult[]>([]);
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

  selectedBrand = signal<IBrandResult | null>(null);
  editBrandDialogVisible = signal(false);

  // Lifecycle hooks
  ngOnInit(): void {
    this._getBrands();
  }

  // Methods

  showEditBrandDialog() {}

  private _getBrands(): void {
    this._brandsService
      .getBrands$()
      .pipe(
        tap((res) => this.brands.set(res)),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }
}

import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import {
  Component,
  DestroyRef,
  ElementRef,
  inject,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { Table, TableModule } from 'primeng/table';
import { BrandsService } from '../../../../core/services/brands-service';
import { BrandResult } from '../../../../shared/brands-model';
import { tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IconFieldModule } from 'primeng/iconfield';
import { DialogModule } from 'primeng/dialog';
import { RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';

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
    NgOptimizedImage,
  ],
  templateUrl: './brands.html',
  styleUrl: './brands.scss',
})
export class Brands implements OnInit {
  // Dependencies
  private readonly _brandsService = inject(BrandsService);
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

  onSearch(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.table().filterGlobal(val, 'contains');
  }

  // Methods
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

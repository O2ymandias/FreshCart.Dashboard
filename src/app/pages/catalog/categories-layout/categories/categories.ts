import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import {
  Component,
  DestroyRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { Table, TableModule } from 'primeng/table';
import { catchError, switchMap, tap, throwError } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IconFieldModule } from 'primeng/iconfield';
import { DialogModule } from 'primeng/dialog';
import { RouterLink } from '@angular/router';
import { ToasterService } from '../../../../core/services/toaster-service';
import { HttpErrorResponse } from '@angular/common/http';
import { CategoriesService } from '../../../../core/services/categories-service';
import { CategoryResult } from '../../../../shared/models/categories.model';

@Component({
  selector: 'app-categories',
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
  templateUrl: './categories.html',
  styleUrl: './categories.scss',
})
export class Categories {
  // Dependencies
  private readonly _categoriesService = inject(CategoriesService);
  private readonly _confirmationService = inject(ConfirmationService);
  private readonly _toasterService = inject(ToasterService);
  private readonly _destroyRef = inject(DestroyRef);

  // Properties
  table = viewChild.required<Table<CategoryResult>>('dt');
  categories = signal<CategoryResult[]>([]);
  navigationItems: MenuItem[] = [
    {
      label: 'Home',
      routerLink: '/dashboard',
      icon: 'pi pi-home',
    },
    {
      label: 'Categories',
      disabled: true,
    },
  ];

  // Lifecycle hooks
  ngOnInit(): void {
    this._getCategories();
  }

  // Methods
  onSearch(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.table().filterGlobal(val, 'contains');
  }

  OnDeleteCategory(event: Event, categoryId: number) {
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

      accept: () => this._deleteCategory(categoryId),
    });
  }

  private _getCategories(): void {
    this._categoriesService
      .getCategories$()
      .pipe(
        tap((res) => this.categories.set(res)),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }

  private _deleteCategory(categoryId: number): void {
    this._categoriesService
      .deleteCategory$(categoryId)
      .pipe(
        tap((res) => this._toasterService.success(res.message)),
        switchMap(() =>
          this._categoriesService
            .getCategories$()
            .pipe(tap((res) => this.categories.set(res))),
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

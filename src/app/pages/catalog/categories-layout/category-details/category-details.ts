import {
  Component,
  DestroyRef,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { Breadcrumb } from 'primeng/breadcrumb';
import { FloatLabel } from 'primeng/floatlabel';
import { InputText } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { catchError, switchMap, tap, throwError } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FieldsetModule } from 'primeng/fieldset';
import { ButtonModule } from 'primeng/button';
import { Router, RouterLink } from '@angular/router';
import { ToasterService } from '../../../../core/services/toaster-service';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageModule } from 'primeng/message';
import { CategoriesService } from '../../../../core/services/categories-service';
import { CategoryResult } from '../../../../shared/models/categories.model';
import { BrandOrCategoryTranslation } from '../../../../shared/models/shared.model';

@Component({
  selector: 'app-category-details',
  imports: [
    Breadcrumb,
    FloatLabel,
    InputText,
    FormsModule,
    FieldsetModule,
    ButtonModule,
    RouterLink,
    MessageModule,
  ],
  templateUrl: './category-details.html',
  styleUrl: './category-details.scss',
})
export class CategoryDetails implements OnInit {
  private readonly _categoriesService = inject(CategoriesService);
  private readonly _toasterService = inject(ToasterService);
  private readonly _confirmationService = inject(ConfirmationService);
  private readonly _router = inject(Router);
  private readonly _destroyRef = inject(DestroyRef);

  id = input.required<number>();
  category = signal<CategoryResult | null>(null);
  categoryTranslations = signal<BrandOrCategoryTranslation[]>([]);

  navigationItems: MenuItem[] = [
    {
      label: 'Home',
      routerLink: '/dashboard',
      icon: 'pi pi-home',
    },
    {
      label: 'Categories',
      routerLink: '/categories',
    },
    {
      label: 'Category Details',
      disabled: true,
    },
  ];

  ngOnInit(): void {
    this._initialize();
  }

  onDeleteCategory(event: Event): void {
    this._confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this category?',
      header: 'Delete Category',
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

      accept: () => this._deleteCategory(),
    });
  }

  private _initialize(): void {
    this._categoriesService
      .getCategory$(this.id())
      .pipe(
        tap((res) => this.category.set(res)),
        switchMap(() => this._getCategoryTranslation$()),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }

  private _getCategoryTranslation$() {
    return this._categoriesService
      .getCategoryTranslations$(this.id())
      .pipe(tap((res) => this.categoryTranslations.set(res)));
  }

  private _deleteCategory(): void {
    this._categoriesService
      .deleteCategory$(this.id())
      .pipe(
        tap((res) => {
          this._toasterService.success(res.message);
          this._router.navigate(['/categories']);
        }),

        catchError((err: HttpErrorResponse) => {
          this._toasterService.error(err.error.message);
          return throwError(() => err);
        }),

        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }
}

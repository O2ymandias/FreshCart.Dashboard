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
import { BrandsService } from '../../../../core/services/brands-service';
import { BrandResult } from '../../../../shared/models/brands-model';
import { catchError, switchMap, tap, throwError } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FieldsetModule } from 'primeng/fieldset';
import { ButtonModule } from 'primeng/button';
import { Router, RouterLink } from '@angular/router';
import { ToasterService } from '../../../../core/services/toaster-service';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageModule } from 'primeng/message';
import { BrandOrCategoryTranslation } from '../../../../shared/models/shared.model';

@Component({
  selector: 'app-brand-details',
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
  templateUrl: './brand-details.html',
  styleUrl: './brand-details.scss',
})
export class BrandDetails implements OnInit {
  private readonly _brandService = inject(BrandsService);
  private readonly _toasterService = inject(ToasterService);
  private readonly _confirmationService = inject(ConfirmationService);
  private readonly _router = inject(Router);
  private readonly _destroyRef = inject(DestroyRef);

  id = input.required<number>();
  brand = signal<BrandResult | null>(null);
  brandTranslations = signal<BrandOrCategoryTranslation[]>([]);

  navigationItems: MenuItem[] = [
    {
      label: 'Home',
      routerLink: '/dashboard',
      icon: 'pi pi-home',
    },
    {
      label: 'Brands',
      routerLink: '/brands',
    },
    {
      label: 'Brand Details',
      disabled: true,
    },
  ];

  ngOnInit(): void {
    this._initialize();
  }

  onDeleteBrand(event: Event): void {
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

      accept: () => this._deleteBrand(),
    });
  }

  private _initialize(): void {
    this._brandService
      .getBrand$(this.id())
      .pipe(
        tap((res) => this.brand.set(res)),
        switchMap(() => this._getBrandTranslation$()),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }

  private _getBrandTranslation$() {
    return this._brandService
      .getBrandTranslations$(this.id())
      .pipe(tap((res) => this.brandTranslations.set(res)));
  }

  private _deleteBrand(): void {
    this._brandService
      .deleteBrand(this.id())
      .pipe(
        tap((res) => {
          this._toasterService.success(res.message);
          this._router.navigate(['/brands']);
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

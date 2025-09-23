import { Component, DestroyRef, inject, signal } from '@angular/core';
import { BrandsService } from '../../../../core/services/brands-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, tap, throwError } from 'rxjs';

import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FormErrors } from '../../../../shared/components/form-errors/form-errors';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { CommonService } from '../../../../core/services/common-service';
import { LanguageCode } from '../../../../shared/models/shared.model';
import { FieldsetModule } from 'primeng/fieldset';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ToasterService } from '../../../../core/services/toaster-service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { BrandTranslation } from '../../../../shared/models/brands-model';
import { FormImage } from '../../../../shared/components/form-image/form-image';

@Component({
  selector: 'app-create-brand',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    FormErrors,
    BreadcrumbModule,
    InputTextModule,
    FieldsetModule,
    FloatLabelModule,
    FormImage,
  ],
  templateUrl: './create-brand.html',
  styleUrl: './create-brand.scss',
})
export class CreateBrand {
  private readonly _brandsService = inject(BrandsService);
  private readonly _commonService = inject(CommonService);
  private readonly _toasterService = inject(ToasterService);
  private readonly _router = inject(Router);
  private readonly _destroyRef = inject(DestroyRef);

  translationsKeys = signal<LanguageCode[]>([]);
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
      label: 'Create Brand',
      disabled: true,
    },
  ];
  uploadedImage = signal<File | null>(null);
  isValidUploadedImage = signal(true);
  createBrandForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50),
    ]),
    image: new FormControl('', [Validators.required]),
    translations: new FormArray<FormGroup>([]),
  });

  get canSubmit() {
    return this.createBrandForm.valid && this.isValidUploadedImage();
  }

  ngOnInit(): void {
    this._getTranslationsKeys();
  }

  getControl(group: FormGroup, controlName: string) {
    return group.controls[controlName] as FormControl;
  }

  onUploadImage(image: File) {
    this.uploadedImage.set(image);
    this.createBrandForm.patchValue({ image: image.name });
  }

  onValidateImage(isValid: boolean) {
    this.isValidUploadedImage.set(isValid);
  }

  createBrand() {
    if (!this.canSubmit) {
      this.createBrandForm.markAllAsDirty();
      return;
    }
    const formData = new FormData();

    const image = this.uploadedImage();
    if (image) formData.append('image', image);

    const { name, translations } = this.createBrandForm.value;

    if (name) formData.append('name', name);

    if (translations) {
      translations.forEach((t: BrandTranslation, i: number) => {
        formData.append(`translations[${i}].languageCode`, t.languageCode);
        formData.append(`translations[${i}].name`, t.name);
      });
    }

    this._brandsService
      .createBrand(formData)
      .pipe(
        tap((res) => {
          if (res) {
            this._router.navigate(['/brands']);
            this._toasterService.success(res.message);
          }
        }),

        catchError((err: HttpErrorResponse) => {
          this._toasterService.error(err.error.message);
          return throwError(() => err);
        }),

        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }

  private _initTranslationsGroup(keys: LanguageCode[]) {
    const translationsGroup = this.createBrandForm.controls.translations;
    for (const key of keys) {
      translationsGroup.push(
        new FormGroup({
          languageCode: new FormControl<LanguageCode>(key, [
            Validators.required,
          ]),

          name: new FormControl('', [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(50),
          ]),
        }),
      );
    }
  }

  private _getTranslationsKeys() {
    this._commonService
      .getTranslationsKeys$()
      .pipe(
        tap((res) => {
          this.translationsKeys.set(res);
          this._initTranslationsGroup(res);
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }
}

import { Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonService } from '../../../../core/services/common-service';
import { ToasterService } from '../../../../core/services/toaster-service';
import { Router } from '@angular/router';
import { LanguageCode } from '../../../../shared/models/shared.model';
import { MenuItem } from 'primeng/api';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BrandTranslation } from '../../../../shared/models/brands-model';
import { catchError, tap, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ButtonModule } from 'primeng/button';
import { FormErrors } from '../../../../shared/components/form-errors/form-errors';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { InputTextModule } from 'primeng/inputtext';
import { FieldsetModule } from 'primeng/fieldset';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormImage } from '../../../../shared/components/form-image/form-image';
import { CategoriesService } from '../../../../core/services/categories-service';

@Component({
  selector: 'app-create-category',
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
  templateUrl: './create-category.html',
  styleUrl: './create-category.scss',
})
export class CreateCategory {
  private readonly _categoriesService = inject(CategoriesService);
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
      label: 'Categories',
      routerLink: '/categories',
    },
    {
      label: 'Create Category',
      disabled: true,
    },
  ];
  uploadedImage = signal<File | null>(null);
  isValidUploadedImage = signal(true);
  createCategoryForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50),
    ]),
    image: new FormControl('', [Validators.required]),
    translations: new FormArray<FormGroup>([]),
  });

  get canSubmit() {
    return this.createCategoryForm.valid && this.isValidUploadedImage();
  }

  ngOnInit(): void {
    this._getTranslationsKeys();
  }

  getControl(group: FormGroup, controlName: string) {
    return group.controls[controlName] as FormControl;
  }

  onUploadImage(image: File) {
    this.uploadedImage.set(image);
    this.createCategoryForm.patchValue({ image: image.name });
  }

  onValidateImage(isValid: boolean) {
    this.isValidUploadedImage.set(isValid);
  }

  createCategory() {
    if (!this.canSubmit) {
      this.createCategoryForm.markAllAsDirty();
      return;
    }
    const formData = new FormData();

    const image = this.uploadedImage();
    if (image) formData.append('image', image);

    const { name, translations } = this.createCategoryForm.value;

    if (name) formData.append('name', name);

    if (translations) {
      translations.forEach((t: BrandTranslation, i: number) => {
        formData.append(`translations[${i}].languageCode`, t.languageCode);
        formData.append(`translations[${i}].name`, t.name);
      });
    }

    this._categoriesService
      .createCategory$(formData)
      .pipe(
        tap((res) => {
          if (res) {
            this._router.navigate(['/categories']);
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
    const translationsGroup = this.createCategoryForm.controls.translations;
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

import {
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, map, tap, throwError } from 'rxjs';

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
import {
  BrandOrCategoryTranslation,
  LanguageCode,
} from '../../../../shared/models/shared.model';
import { FieldsetModule } from 'primeng/fieldset';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ToasterService } from '../../../../core/services/toaster-service';
import { Router } from '@angular/router';
import { MessageModule } from 'primeng/message';
import { FormImage } from '../../../../shared/components/form-image/form-image';
import { CategoriesService } from '../../../../core/services/categories-service';
import { CategoryResult } from '../../../../shared/models/categories.model';

@Component({
  selector: 'app-edit-category',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    FormErrors,
    BreadcrumbModule,
    InputTextModule,
    FieldsetModule,
    FloatLabelModule,
    MessageModule,
    FormImage,
  ],
  templateUrl: './edit-category.html',
  styleUrl: './edit-category.scss',
})
export class EditCategory implements OnInit {
  private readonly _categoriesService = inject(CategoriesService);
  private readonly _commonService = inject(CommonService);
  private readonly _toasterService = inject(ToasterService);
  private readonly _router = inject(Router);
  private readonly _destroyRef = inject(DestroyRef);

  constructor() {
    effect(() => {
      const category = this.category();
      const categoryTranslations = this.categoryTranslations();

      if (category) {
        this.editCategoryForm.patchValue({
          id: category.id,
          name: category.name,
          translations: categoryTranslations.map((ct) => ({
            languageCode: ct.languageCode,
            name: ct.name,
          })),
        });
      }
    });
  }

  id = input.required<number>();
  category = signal<CategoryResult | null>(null);
  categoryTranslations = signal<BrandOrCategoryTranslation[]>([]);
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
      label: 'Edit Category',
      disabled: true,
    },
  ];
  uploadedImage = signal<File | null>(null);
  isValidUploadedImage = signal(true);
  editCategoryForm = new FormGroup({
    id: new FormControl<number>(0, [Validators.required]),
    name: new FormControl('', [Validators.required]),
    translations: new FormArray<FormGroup>([]),
  });

  get canSubmit() {
    return this.editCategoryForm.valid && this.isValidUploadedImage();
  }

  ngOnInit(): void {
    this._getCategory();
    this._getCategoryTranslations();
    this._getTranslationsKeys();
  }

  getControl(group: FormGroup, controlName: string) {
    return group.controls[controlName] as FormControl;
  }

  onUploadImage(image: File) {
    this.uploadedImage.set(image);
  }

  onValidateImage(isValid: boolean) {
    this.isValidUploadedImage.set(isValid);
  }

  updateCategory() {
    if (!this.canSubmit) {
      this.editCategoryForm.markAllAsDirty();
      return;
    }

    const { id, name, translations } = this.editCategoryForm.value;

    const formData = new FormData();

    const uploadedImage = this.uploadedImage();
    if (uploadedImage) formData.append('image', uploadedImage);

    if (id) formData.append('id', id.toString());
    if (name) formData.append('name', name);
    if (translations) {
      translations.forEach((t: BrandOrCategoryTranslation, i: number) => {
        formData.append(`translations[${i}].languageCode`, t.languageCode);
        formData.append(`translations[${i}].name`, t.name);
      });
    }

    this._categoriesService
      .updateCategory$(formData)
      .pipe(
        tap((res) => {
          this._router.navigate(['/categories']);
          this._toasterService.success(res.message);
        }),

        catchError((err) => {
          this._toasterService.error(err.error.message);
          return throwError(() => err);
        }),

        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }

  private _initTranslationsGroup(keys: LanguageCode[]) {
    const translationsGroup = this.editCategoryForm.controls.translations;
    for (const key of keys) {
      translationsGroup.push(
        new FormGroup({
          languageCode: new FormControl<LanguageCode>(key, [
            Validators.required,
          ]),

          name: new FormControl('', [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ]),
        }),
      );
    }
  }

  private _getCategory() {
    this._categoriesService
      .getCategories$()
      .pipe(
        map(
          (res) =>
            res.find((b) => b.id.toString() === this.id().toString()) ?? null,
        ),
        tap((res) => {
          this.category.set(res);
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }

  private _getCategoryTranslations() {
    this._categoriesService
      .getCategoryTranslations$(this.id())
      .pipe(
        tap((res) => this.categoryTranslations.set(res)),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
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

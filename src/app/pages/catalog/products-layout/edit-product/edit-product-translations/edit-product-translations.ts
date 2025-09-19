import {
  Component,
  DestroyRef,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { ProductsService } from '../../../../../core/services/products-service';
import { IProductTranslation } from '../../../../../shared/product-details.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, finalize, switchMap, tap, throwError } from 'rxjs';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { FormErrors } from '../../../../../shared/components/form-errors/form-errors';
import { MessageModule } from 'primeng/message';
import { UpdateProductTranslationRequest } from '../../../../../shared/products.model';
import { LanguageCode } from '../../../../../shared/shared.model';
import { ToasterService } from '../../../../../core/services/toaster-service';
import { CommonService } from '../../../../../core/services/common-service';

@Component({
  selector: 'app-edit-product-translations',
  imports: [
    DialogModule,
    ButtonModule,
    TextareaModule,
    InputTextModule,
    FormsModule,
    SelectModule,
    ReactiveFormsModule,
    FormErrors,
    MessageModule,
  ],
  templateUrl: './edit-product-translations.html',
  styleUrl: './edit-product-translations.scss',
})
export class EditProductTranslations implements OnInit {
  private readonly _productsService = inject(ProductsService);
  private readonly _commonService = inject(CommonService);
  private readonly _toasterService = inject(ToasterService);
  private readonly _destroyRef = inject(DestroyRef);

  productId = input.required<number>();
  visible = signal(false);
  translations = signal<IProductTranslation[]>([]);
  translationsKeys = signal<LanguageCode[]>([]);
  selectedKey = signal<LanguageCode | null>(null);

  loading = signal(false);

  updateTranslationForm = new FormGroup({
    languageCode: new FormControl<LanguageCode>('EN', [Validators.required]),

    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100),
    ]),

    description: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
  });

  ngOnInit(): void {
    this._getTranslations$().subscribe();
    this._getTranslationsKeys$().subscribe();
  }

  onSelectTranslation() {
    this.updateTranslationForm.reset();

    const selectedKey = this.selectedKey();
    if (!selectedKey) return;

    this.updateTranslationForm.patchValue({
      languageCode: selectedKey,
    });

    const selectedTranslation = this.translations().find(
      (t) => t.languageCode === selectedKey,
    );
    if (!selectedTranslation) return;

    const { languageCode, name, description } = selectedTranslation;

    this.updateTranslationForm.patchValue({
      languageCode,
      name,
      description,
    });
  }

  updateTranslations() {
    if (this.updateTranslationForm.invalid) return;

    this.loading.set(true);

    const { languageCode, name, description } =
      this.updateTranslationForm.value;

    const requestData: UpdateProductTranslationRequest = {
      productId: this.productId(),
      languageCode: languageCode ?? 'EN',
      name: name ?? '',
      description: description ?? '',
    };

    this._productsService
      .updateProductTranslation$(requestData)
      .pipe(
        tap((res) => {
          if (res.success) {
            this._toasterService.success(res.message);
            this.closeTranslationsDialog();
          }
        }),

        switchMap(() => this._getTranslations$()),

        catchError((err) => {
          this._toasterService.error(err.error.message);
          return throwError(() => err);
        }),

        finalize(() => this.loading.set(false)),

        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }

  private _getTranslations$() {
    return this._productsService.getProductTranslations$(this.productId()).pipe(
      tap((res) => this.translations.set(res)),
      takeUntilDestroyed(this._destroyRef),
    );
  }

  private _getTranslationsKeys$() {
    return this._commonService.getTranslationsKeys$().pipe(
      tap((res) => this.translationsKeys.set(res)),
      takeUntilDestroyed(this._destroyRef),
    );
  }

  closeTranslationsDialog() {
    this.visible.set(false);
  }

  openTranslationsDialog() {
    this.visible.set(true);
  }
}

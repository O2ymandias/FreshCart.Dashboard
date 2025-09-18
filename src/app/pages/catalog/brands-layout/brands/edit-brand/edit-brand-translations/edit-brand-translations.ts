import {
  Component,
  DestroyRef,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { FormErrors } from '../../../../../../shared/components/form-errors/form-errors';
import { BrandTranslation } from '../../../../../../shared/brands-model';
import { LanguageCode } from '../../../../../../shared/shared.model';
import { BrandsService } from '../../../../../../core/services/brands-service';
import { ProductsService } from '../../../../../../core/services/products-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';

@Component({
  selector: 'app-edit-brand-translations',
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
  templateUrl: './edit-brand-translations.html',
  styleUrl: './edit-brand-translations.scss',
})
export class EditBrandTranslations implements OnInit {
  private readonly _brandsService = inject(BrandsService);
  private readonly _productsService = inject(ProductsService);
  private readonly _destroyRef = inject(DestroyRef);

  brandId = input.required<number>();
  visible = signal(false);
  translations = signal<BrandTranslation[]>([]);
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
    this._getTranslationKeys();
  }

  openTranslationsDialog() {
    this.visible.set(true);
  }

  onSelectTranslation() {}

  updateTranslations() {}

  private _getTranslationKeys() {
    this._productsService
      .getTranslationsKeys$()
      .pipe(
        tap((res) => this.translationsKeys.set(res)),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }
}

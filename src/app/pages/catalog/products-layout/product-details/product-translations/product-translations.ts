import { MessageModule } from 'primeng/message';
import { TextareaModule } from 'primeng/textarea';
import {
  Component,
  DestroyRef,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ProductsService } from '../../../../../core/services/products-service';
import { tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { FieldsetModule } from 'primeng/fieldset';
import { LanguageCode } from '../../../../../shared/models/shared.model';
import { CommonService } from '../../../../../core/services/common-service';
import { ProductTranslationResult } from '../../../../../shared/models/product-details.model';

@Component({
  selector: 'app-product-translations',
  imports: [
    FormsModule,
    DialogModule,
    ButtonModule,
    SelectModule,
    TextareaModule,
    InputTextModule,
    FieldsetModule,
    MessageModule,
  ],
  templateUrl: './product-translations.html',
  styleUrl: './product-translations.scss',
})
export class ProductTranslations implements OnInit {
  private readonly _productsService = inject(ProductsService);
  private readonly _commonService = inject(CommonService);
  private readonly _destroyRef = inject(DestroyRef);

  productId = input.required<number>();
  translations = signal<ProductTranslationResult[]>([]);
  translationsKeys = signal<LanguageCode[]>([]);
  selectedOption = signal<LanguageCode | null>(null);
  selectedTranslation = signal<ProductTranslationResult | null>(null);
  visible = signal(false);

  ngOnInit(): void {
    this._getTranslations();
    this._getTranslationsKeys();
  }

  showTranslations() {
    this.visible.set(true);
  }

  onSelectTranslation() {
    this.selectedTranslation.set(null);

    const selectedKey = this.selectedOption();
    if (!selectedKey) return;

    const selectedTranslation = this.translations().find(
      (t) => t.languageCode === selectedKey,
    );
    if (!selectedTranslation) return;

    this.selectedTranslation.set(selectedTranslation);
  }

  private _getTranslations(): void {
    this._productsService
      .getProductTranslations$(this.productId())
      .pipe(
        tap((res) => this.translations.set(res)),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }

  private _getTranslationsKeys() {
    this._commonService
      .getTranslationsKeys$()
      .pipe(
        tap((res) => this.translationsKeys.set(res)),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }
}

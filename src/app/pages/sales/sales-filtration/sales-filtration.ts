import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { SelectModule } from 'primeng/select';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { FieldsetModule } from 'primeng/fieldset';
import { DatePickerModule } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';
import { SalesService } from '../../../core/services/sales-service';
import { finalize, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-sales-filtration',
  imports: [
    SelectModule,
    DrawerModule,
    ButtonModule,
    FieldsetModule,
    DatePickerModule,
    FormsModule,
  ],
  templateUrl: './sales-filtration.html',
  styleUrl: './sales-filtration.scss',
})
export class SalesFiltration {
  private readonly _salesService = inject(SalesService);
  private readonly _destroyRef = inject(DestroyRef);

  visible = signal(false);

  pageSize = this._salesService.pageSize;
  startDate = this._salesService.startDate;
  endDate = this._salesService.endDate;

  loading = signal(false);

  noFilters = computed(() => !this.startDate() && !this.endDate());

  applyFilters() {
    this._loadData();
  }

  clearFilters() {
    this.startDate.set(undefined);
    this.endDate.set(undefined);
  }

  private _loadData() {
    this.loading.set(true);
    this._salesService
      .getSales$({
        pageNumber: this._salesService.DEFAULT_PAGE_NUMBER,
        pageSize: this.pageSize(),
        startDate: this.startDate()?.toISOString(),
        endDate: this.endDate()?.toISOString(),
      })
      .pipe(
        tap(() => this.visible.set(false)),
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }
}

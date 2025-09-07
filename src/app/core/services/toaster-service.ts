import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ToasterService {
  private readonly _messageService = inject(MessageService);
  readonly TOASTER_KEY = 'toaster_br';

  success(message: string, title: string = 'Success') {
    this._messageService.add({
      severity: 'success',
      key: this.TOASTER_KEY,
      summary: title,
      detail: message,
    });
  }

  error(message: string, title: string = 'Error') {
    this._messageService.add({
      severity: 'error',
      key: this.TOASTER_KEY,
      summary: title,
      detail: message,
    });
  }

  warn(message: string, title: string = 'Warn') {
    this._messageService.add({
      severity: 'warn',
      key: this.TOASTER_KEY,
      summary: title,
      detail: message,
    });
  }
}

import { Component, output, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { RequestEmailChange } from './request-email-change/request-email-change';
import { ConfirmEmailChange } from './confirm-email-change/confirm-email-change';

@Component({
  selector: 'app-change-email',
  imports: [
    CardModule,
    ReactiveFormsModule,
    PasswordModule,
    MessageModule,
    InputTextModule,
    ButtonModule,
    RequestEmailChange,
    ConfirmEmailChange,
  ],
  templateUrl: './change-email.html',
  styleUrl: './change-email.scss',
})
export class ChangeEmail {
  step = signal<1 | 2>(1);
  emailChanged = output();

  onEmailChangeRequested() {
    this.step.set(2);
  }

  onEmailChangeConfirmed() {
    this.step.set(1);
    this.emailChanged.emit();
  }
}

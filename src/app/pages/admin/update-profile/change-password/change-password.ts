import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CardModule } from 'primeng/card';
import { PasswordModule } from 'primeng/password';
import { passwordPattern } from '../../../../shared/models/account.model';
import { FormErrors } from '../../../../shared/components/form-errors/form-errors';
import { MessageModule } from 'primeng/message';
import { ButtonModule } from 'primeng/button';
import { equalValuesValidator } from './change-password.validators';

@Component({
  selector: 'app-change-password',
  imports: [
    CardModule,
    PasswordModule,
    ReactiveFormsModule,
    FormErrors,
    MessageModule,
    ButtonModule,
  ],
  templateUrl: './change-password.html',
  styleUrl: './change-password.scss',
})
export class ChangePassword {
  changePasswordForm = new FormGroup(
    {
      currentPassword: new FormControl('', [Validators.required]),

      newPassword: new FormControl('', [
        Validators.required,
        Validators.pattern(passwordPattern),
      ]),

      confirmNewPassword: new FormControl('', [Validators.required]),
    },
    {
      validators: equalValuesValidator('newPassword', 'confirmNewPassword'),
    },
  );

  submit() {
    console.log(this.changePasswordForm);
  }
}

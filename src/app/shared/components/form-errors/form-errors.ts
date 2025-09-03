import { Component, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-form-errors',
  imports: [MessageModule],
  templateUrl: './form-errors.html',
  styleUrl: './form-errors.scss',
})
export class FormErrors {
  control = input.required<AbstractControl | null>();
  label = input.required<string>();
}

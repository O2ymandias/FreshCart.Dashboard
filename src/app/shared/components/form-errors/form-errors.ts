import { Component, input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-form-errors',
  imports: [MessageModule],
  templateUrl: './form-errors.html',
  styleUrl: './form-errors.scss',
})
export class FormErrors {
  control = input.required<FormControl | null>();
  label = input.required<string>();
}

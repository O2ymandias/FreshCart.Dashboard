import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-email-link',
  imports: [],
  templateUrl: './email-link.html',
  styleUrl: './email-link.scss',
})
export class EmailLink {
  email = input.required<string>();
  mailTo = computed(() => `mailto:${this.email()}`);
}

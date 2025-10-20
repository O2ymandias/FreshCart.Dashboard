import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-phone-link',
  imports: [],
  templateUrl: './phone-link.html',
  styleUrl: './phone-link.scss',
})
export class PhoneLink {
  phoneNumber = input.required<string>();
  telLink = computed(() => `tel:${this.phoneNumber()}`);
}

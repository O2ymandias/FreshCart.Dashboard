import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ThemeService } from '../../core/services/theme-service';

@Component({
  selector: 'app-not-found',
  imports: [ButtonModule, RouterLink],
  templateUrl: './not-found.html',
  styleUrl: './not-found.scss',
})
export class NotFound {
  private readonly _themeService = inject(ThemeService);
  currentTheme = this._themeService.currentTheme;
  notFoundImage = computed(() =>
    this.currentTheme() === 'dark'
      ? '/notfound-dark.svg'
      : '/notfound-light.svg',
  );
}

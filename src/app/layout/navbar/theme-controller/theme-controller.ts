import { Component, computed, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ThemeService } from '../../../core/services/theme-service';
@Component({
  selector: 'app-theme-controller',
  imports: [ButtonModule],
  templateUrl: './theme-controller.html',
  styleUrl: './theme-controller.scss',
})
export class ThemeController {
  private readonly _themeService = inject(ThemeService);

  currentTheme = this._themeService.currentTheme;
  currentIcon = computed(() =>
    this.currentTheme() === 'dark' ? 'pi pi-sun' : 'pi pi-moon',
  );

  toggleTheme() {
    this._themeService.toggleTheme();
  }
}

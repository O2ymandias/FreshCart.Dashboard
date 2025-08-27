import {
  Component,
  computed,
  inject,
  PLATFORM_ID,
  Renderer2,
  signal,
} from '@angular/core';
import { Button } from 'primeng/button';
import { DARK_THEME_CLASS, Theme, THEME_KEY } from './theme.controller.model';
import { isPlatformBrowser } from '@angular/common';
@Component({
  selector: 'app-theme-controller',
  imports: [Button],
  templateUrl: './theme-controller.html',
  styleUrl: './theme-controller.scss',
})
export class ThemeController {
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _renderer2 = inject(Renderer2);

  constructor() {
    if (isPlatformBrowser(this._platformId)) {
      this._initializeTheme();
    }
  }

  currentTheme = signal<Theme>('light');
  currentIcon = computed(() =>
    this.currentTheme() === 'dark' ? 'pi pi-sun' : 'pi pi-moon'
  );

  toggleTheme() {
    const newTheme: Theme = this.currentTheme() === 'dark' ? 'light' : 'dark';
    this._setTheme(newTheme);
  }

  private _initializeTheme(): void {
    const storedTheme = this._getStoredTheme();
    const systemPreference = this._getSystemThemePreference();
    const initialTheme = storedTheme ?? systemPreference;

    this._setTheme(initialTheme);
  }

  private _setTheme(theme: Theme): void {
    this.currentTheme.set(theme);
    this._updateDocumentClass(theme);
    this._persistTheme(theme);
  }

  private _updateDocumentClass(theme: Theme): void {
    if (theme === 'dark') {
      this._renderer2.addClass(document.documentElement, DARK_THEME_CLASS);
    } else {
      this._renderer2.removeClass(document.documentElement, DARK_THEME_CLASS);
    }
  }

  private _persistTheme(theme: Theme): void {
    localStorage.setItem(THEME_KEY, theme);
  }

  private _getStoredTheme(): Theme | null {
    return localStorage.getItem(THEME_KEY) as Theme | null;
  }

  private _getSystemThemePreference(): Theme {
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    return prefersDark ? 'dark' : 'light';
  }
}

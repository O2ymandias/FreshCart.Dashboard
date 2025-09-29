import { isPlatformBrowser } from '@angular/common';
import {
  inject,
  Injectable,
  PLATFORM_ID,
  Renderer2,
  RendererFactory2,
  signal,
} from '@angular/core';
import {
  DARK_THEME_CLASS,
  Theme,
  THEME_KEY,
} from '../../layout/navbar/theme-controller/theme.controller.model';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _rendererFactory = inject(RendererFactory2);
  private readonly _renderer2: Renderer2;

  constructor() {
    this._renderer2 = this._rendererFactory.createRenderer(null, null);

    if (isPlatformBrowser(this._platformId)) {
      this._initializeTheme();
    }
  }

  currentTheme = signal<Theme>('light');

  toggleTheme(): void {
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
      '(prefers-color-scheme: dark)',
    ).matches;
    return prefersDark ? 'dark' : 'light';
  }
}

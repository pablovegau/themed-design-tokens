import { DEFAULT_THEMES } from "./constants";

export class ThemeLocalHost {
  constructor(key = "theme", darkTheme = DEFAULT_THEMES.DARK, lightTheme = DEFAULT_THEMES.LIGHT) {
    this.key = key;
    this.darkTheme = darkTheme;
    this.lightTheme = lightTheme;
  }

  // Theme priority:
  // 1. theme saved in local storage
  // 2. prefers-color-scheme
  // 3. default to light
  initialize() {
    const localStorageTheme = this.getLocalStorageTheme()

    if (localStorageTheme) {
      this.updateDataTheme(localStorageTheme);
      return localStorageTheme;
    }

    const isPreferColorSchemeDark = getIfPreferColorSchemeIsDefinedAsDark();

    if (isPreferColorSchemeDark) {
      this.updateDataTheme(this.darkTheme);
      return this.darkTheme;
    }

    this.updateDataTheme(this.lightTheme);
    return this.lightTheme;
  }

  getLocalStorageTheme() {
    return window.localStorage.getItem(this.key) || undefined;
  }

  getIfPreferColorSchemeIsDefinedAsDark() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
  }

  // Update the data-theme attribute in the html tag
  updateDataTheme(value) {
    document.documentElement.dataset.theme = value;
  }

  update(value) {
    window.localStorage.setItem(this.key, value);
  }
}

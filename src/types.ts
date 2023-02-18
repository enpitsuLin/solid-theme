import { Accessor, Setter } from 'solid-js'

export interface UseThemeContext {
  /** List of all available theme names */
  themes: string[]
  /** Update the theme */
  setTheme: (setTheme: string | ((prev: string) => string)) => void
  /** Active theme name */
  theme: Accessor<string | undefined>
  /** If `enableSystem` is true and the active theme is "system", this returns whether the system preference resolved to "dark" or "light". Otherwise, identical to `theme` */
  resolvedTheme: Accessor<string | undefined>
}

export interface ThemeProviderProps {
  /** List of all available theme names */
  themes?: string[]
  /** Whether to switch between dark and light themes based on prefers-color-scheme */
  enableSystem?: boolean
  /** Key used to store theme setting in localStorage */
  storageKey?: string
  /** Default theme name. If `enableSystem` is false, the default theme is light */
  defaultTheme?: string
  /** HTML attribute modified based on the active theme. Accepts `class` and `data-*` (meaning any data attribute, `data-mode`, `data-color`, etc.) */
  attribute?: `data-${string}` | 'class'
}

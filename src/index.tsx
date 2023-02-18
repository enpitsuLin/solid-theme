import {
  Accessor,
  createContext,
  createEffect,
  createMemo,
  createSignal,
  mergeProps,
  onCleanup,
  ParentComponent,
  ParentProps,
  Setter,
  useContext,
} from 'solid-js'
import { getSystemTheme, getTheme, MEDIA } from './helpers'
import type { ThemeProviderProps, UseThemeContext } from './types'

const defaultContext: UseThemeContext = {
  setTheme: (_ => {}) as Setter<string>,
  themes: [],
  theme: () => undefined,
  resolvedTheme: () => undefined,
}

const ThemeContext = createContext<UseThemeContext | undefined>(undefined)

export const useTheme = () => useContext(ThemeContext) ?? defaultContext

export const ThemeProvider: ParentComponent<ThemeProviderProps> = props => {
  const context = useContext(ThemeContext)
  if (context) return <>{props.children}</>
  return <Theme {...props} />
}

const defaultThemes = ['light', 'dark']

const Theme: ParentComponent<ThemeProviderProps> = props => {
  const _props = mergeProps<[ParentProps<ThemeProviderProps>, Required<ThemeProviderProps>]>(
    props,
    {
      themes: defaultThemes,
      enableSystem: true,
      storageKey: 'theme',
      defaultTheme: props.enableSystem ?? true ? 'system' : 'light',
      attribute: 'data-theme',
    },
  )

  const [theme, setThemeSignal] = createSignal(getTheme(_props.storageKey, _props.defaultTheme)!)
  const [resolvedTheme, setResolvedTheme] = createSignal(
    getTheme(_props.storageKey, getSystemTheme()),
  )

  const applyTheme = (theme?: string) => {
    let resolved = theme

    if (theme === 'system' && _props.enableSystem) {
      resolved = getSystemTheme()
    }

    const root = document.documentElement
    if (props.attribute === 'class') {
      root.classList.remove(..._props.themes)
      if (resolved) root.classList.add(resolved)
    } else {
      if (resolved) root.setAttribute(_props.attribute, resolved)
      else root.removeAttribute(_props.attribute)
    }
  }

  const setTheme = (theme: string | ((prev: string) => string)) => {
    const newTheme = setThemeSignal(theme)
    try {
      localStorage.setItem(_props.storageKey, newTheme)
    } catch (error) {}
  }

  const themeContext = createMemo(() => {
    return {
      themes: _props.themes,
      theme: theme,
      resolvedTheme: theme() === 'system' ? resolvedTheme : theme,
      setTheme,
    } as UseThemeContext
  })

  createEffect(() => {
    const handleMediaQuery = (e: MediaQueryListEvent | MediaQueryList) => {
      const resolved = getSystemTheme(e)
      setResolvedTheme(resolved)

      if (theme() === 'system' && _props.enableSystem) {
        applyTheme('system')
      }
    }
    const media = window.matchMedia(MEDIA)

    // Intentionally use deprecated listener methods to support iOS & old browsers
    media.addListener(handleMediaQuery)
    handleMediaQuery(media)

    onCleanup(() => media.removeListener(handleMediaQuery))
  })

  createEffect(() => {
    applyTheme(theme())
  })

  return <ThemeContext.Provider value={themeContext()}>{_props.children}</ThemeContext.Provider>
}

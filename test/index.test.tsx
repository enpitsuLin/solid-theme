import { renderHook } from '@solidjs/testing-library'
import { isServer } from 'solid-js/web'
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { ThemeProvider, useTheme } from '../src'

describe('environment', () => {
  it('runs on server', () => {
    expect(typeof window).toBe('object')
    expect(isServer).toBe(false)
  })
})

let localStorageMock: Record<string, string> = {}

function mockDeviceTheme(theme: 'dark' | 'light') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: theme === 'dark' ? true : false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
}

beforeAll(() => {
  global.Storage.prototype.getItem = vi.fn((key: string) => localStorageMock[key] ?? null)
  global.Storage.prototype.setItem = vi.fn((key: string, value: string) => {
    localStorageMock[key] = value
  })
})

beforeEach(() => {
  // Reset global side-effects
  mockDeviceTheme('light')
  document.documentElement.removeAttribute('data-theme')
  document.documentElement.removeAttribute('class')

  // Clear the localStorage-mock
  localStorageMock = {}
})

describe('defaultTheme', () => {
  it('useTheme should return `system` when no defaultTheme', () => {
    const { result } = renderHook(useTheme, {
      wrapper: props => <ThemeProvider children={props.children} />,
    })

    expect(result.theme()).toBe('system')
  })

  it('useTheme should return `light` when no defaultTheme and enableSystem=false', () => {
    const { result } = renderHook(useTheme, {
      wrapper: props => <ThemeProvider enableSystem={false} children={props.children} />,
    })

    expect(result.theme()).toBe('light')
  })

  it('useTheme should return `light` when defaultTheme set to `light`', () => {
    const { result } = renderHook(useTheme, {
      wrapper: props => <ThemeProvider defaultTheme="light" children={props.children} />,
    })

    expect(result.theme()).toBe('light')
  })

  it('useTheme should return `dark` when defaultTheme set to `dark`', () => {
    const { result } = renderHook(useTheme, {
      wrapper: props => <ThemeProvider defaultTheme="dark" children={props.children} />,
    })

    expect(result.theme()).toBe('dark')
  })
})

describe('storage', () => {
  it('should not set localStorage with default value', () => {
    renderHook(useTheme, {
      wrapper: props => <ThemeProvider defaultTheme="dark" children={props.children} />,
    })

    expect(global.Storage.prototype.setItem).toBeCalledTimes(0)
    expect(global.Storage.prototype.getItem('theme')).toBeNull()
  })

  it('should set localStorage when switching themes', () => {
    const { result } = renderHook(useTheme, {
      wrapper: props => <ThemeProvider children={props.children} />,
    })

    result.setTheme('dark')
    expect(global.Storage.prototype.setItem).toBeCalledTimes(1)
    expect(global.Storage.prototype.getItem('theme')).toBe('dark')
  })

  it('should set localStorage  with custom key when switching themes with storageKey be set', () => {
    const { result } = renderHook(useTheme, {
      wrapper: props => (
        <ThemeProvider storageKey="custom-storage" defaultTheme="dark" children={props.children} />
      ),
    })

    result.setTheme('dark')
    expect(global.Storage.prototype.getItem).toHaveBeenCalledWith('custom-storage')
    expect(global.Storage.prototype.setItem).toHaveBeenCalledWith('custom-storage', 'dark')
  })
})

describe('attribute', () => {
  it('should set data-theme attribute with no attribute prop', () => {
    renderHook(useTheme, {
      wrapper: props => <ThemeProvider children={props.children} />,
    })

    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
  })

  it('should use class attribute (CSS-class) when attribute="class"', () => {
    renderHook(useTheme, {
      wrapper: props => <ThemeProvider attribute="class" children={props.children} />,
    })

    expect(document.documentElement.classList.contains('light'))
  })

  it('should use "data-example"-attribute when attribute="data-example"', () => {
    renderHook(useTheme, {
      wrapper: props => <ThemeProvider attribute="class" children={props.children} />,
    })

    expect(document.documentElement.classList.contains('light'))
  })
})

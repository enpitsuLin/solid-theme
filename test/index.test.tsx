import { renderHook } from '@solidjs/testing-library'
import { isServer } from 'solid-js/web'
import { describe, expect, it, vi } from 'vitest'
import { ThemeProvider, useTheme } from '../src'

describe('environment', () => {
  it('runs on server', () => {
    expect(typeof window).toBe('object')
    expect(isServer).toBe(false)
  })
})

describe('test', () => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
  it('useTheme can access ThemeProvider context', () => {
    const { result } = renderHook(useTheme, { wrapper: ThemeProvider })

    const domAttrAccessor = () => document.documentElement.getAttribute('data-theme')
    expect(result.themes).toEqual(['light', 'dark'])

    expect(result.theme()).toBe('system')
    expect(result.resolvedTheme()).toBe('light')
    result.setTheme('dark')
    expect(result.theme()).toBe('dark')
    expect(domAttrAccessor()).toBe('dark')

    result.setTheme('light')
    expect(result.theme()).toBe('light')
    expect(domAttrAccessor()).toBe('light')
  })
})

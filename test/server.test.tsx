import { isServer, renderToString } from 'solid-js/web'
import { describe, expect, it } from 'vitest'
import { ThemeProvider } from '../src'

describe('environment', () => {
  it('runs on server', () => {
    expect(typeof window).toBe('undefined')
    expect(isServer).toBe(true)
  })
})

describe('ssr', () => {
  it('should render children properly', () => {
    const string = renderToString(() => (
      <ThemeProvider>
        <div>Hello world!</div>
      </ThemeProvider>
    ))
    expect(string).toBe('<div>Hello world!</div>')
  })
})

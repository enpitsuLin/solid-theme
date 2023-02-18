import { Component } from 'solid-js'
import { useTheme } from '../src'
import styles from './App.module.css'
import logo from './logo.svg'

const App: Component = () => {
  const { theme, resolvedTheme, setTheme } = useTheme()

  return (
    <div class={styles.App}>
      <header class={styles.header}>
        <img src={logo} class={styles.logo} alt="logo" />
        <h1>{theme()}</h1>
        <h2>{resolvedTheme()}</h2>
        <button
          type="button"
          onClick={() => {
            setTheme(prev => {
              if (prev === 'dark') return 'light'
              return 'dark'
            })
          }}
        >
          toggle theme
        </button>
      </header>
    </div>
  )
}

export default App

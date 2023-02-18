import { render } from 'solid-js/web'
import { ThemeProvider } from '../src'
import './styles.css'
import App from './App'

render(
  () => (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  ),
  document.getElementById('root')!,
)

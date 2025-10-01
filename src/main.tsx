import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

// Check if GitHub Pages redirect param exists
const urlParams = new URLSearchParams(window.location.search)
const redirectPath = urlParams.get("redirect")

if (redirectPath) {
  // Rewrite the URL back to the intended route without the ?redirect
  window.history.replaceState(null, "", redirectPath)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

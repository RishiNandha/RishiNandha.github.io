import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
import {hydrateRoot} from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router'

// Check if GitHub Pages redirect param exists
const urlParams = new URLSearchParams(window.location.search)
const redirectPath = urlParams.get("redirect")

if (redirectPath) {
  // Rewrite the URL back to the intended route without the ?redirect
  window.history.replaceState(null, "", redirectPath)
}

hydrateRoot(document.getElementById('root')!,
  <StrictMode>
    <BrowserRouter basename="/">
      <App />
    </BrowserRouter>
  </StrictMode>,
)

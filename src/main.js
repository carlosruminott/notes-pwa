import App from './App.js'

// PWA registration
async function registerPWA() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', { type: 'module' })
      console.log('[PWA] Service Worker registrado:', registration.scope)
      window.addEventListener('load', () => {
        registration.active?.postMessage({ type: 'SKIP_WAITING' })
      })
    } catch (err) {
      console.error('[PWA] Error al registrar SW:', err)
    }
  }
}

registerPWA()

// Mount app
const root = document.getElementById('app')
if (root) {
  const app = new App()
  app.mount(root)
}

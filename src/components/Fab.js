/**
 * FAB (Floating Action Button) — create new note
 */

export function Fab({ onClick }) {
  const button = document.createElement('button')
  button.className = 'fab'
  button.setAttribute('aria-label', 'Crear nueva nota')
  button.textContent = '+'

  button.addEventListener('click', onClick)

  return button
}

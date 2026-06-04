/**
 * NoteCard component — individual note card
 */

function formatDate(timestamp) {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Ahora mismo'
  if (diffMins < 60) return `Hace ${diffMins} min`
  if (diffHours < 24) return `Hace ${diffHours}h`
  if (diffDays < 7) return `Hace ${diffDays}d`

  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  })
}

function truncate(text, maxLength = 120) {
  if (!text) return ''
  return text.length > maxLength ? text.slice(0, maxLength) + '…' : text
}

export function NoteCard({ note, onClick, onTogglePin, onToggleArchive }) {
  const card = document.createElement('div')
  card.className = 'note-card'
  card.dataset.noteId = note.id

  // Preview content
  const preview = note.content
    ? truncate(note.content)
    : note.title
      ? `<em style="opacity:0.5">Sin contenido</em>`
      : `<em style="opacity:0.4">Nota vacía</em>`

  // Tags
  const tagsHtml = (note.tags && note.tags.length > 0)
    ? note.tags
        .slice(0, 5)
        .map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`)
        .join('')
    : ''

  card.innerHTML = `
    <div class="note-card-header">
      <h2 class="note-card-title">${escapeHtml(note.title || 'Sin título')}</h2>
      <div class="note-card-actions">
        <button class="action-btn pin-btn" data-action="pin" title="${note.isPinned ? 'Desanclar' : 'Anclar'}">
          ${note.isPinned ? '📌' : '📍'}
        </button>
        <button class="action-btn archive-btn" data-action="archive" title="${note.isArchived ? 'Desarchivar' : 'Archivar'}">
          ${note.isArchived ? '📂' : '🗂️'}
        </button>
      </div>
    </div>
    <div class="note-card-preview">${preview}</div>
    ${tagsHtml ? `<div class="note-card-tags">${tagsHtml}</div>` : ''}
    <div class="note-card-footer">
      <span class="note-card-date">${formatDate(note.updatedAt)}</span>
    </div>
  `

  // Event listeners
  card.addEventListener('click', (e) => {
    const actionBtn = e.target.closest('[data-action]')
    if (actionBtn) {
      e.stopPropagation()
      const action = actionBtn.dataset.action
      if (action === 'pin') onTogglePin(note.id)
      if (action === 'archive') onToggleArchive(note.id)
      return
    }
    onClick(note.id)
  })

  return card
}

function escapeHtml(str) {
  const div = document.createElement('div')
  div.textContent = str
  return div.innerHTML
}

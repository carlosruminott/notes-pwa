/**
 * SearchBar component — search input for notes
 */

export function SearchBar({ placeholder = 'Buscar notas...', onSearch }) {
  const container = document.createElement('div')
  container.className = 'search-bar'

  const searchIcon = document.createElement('span')
  searchIcon.className = 'search-icon'
  searchIcon.textContent = '🔍'

  const input = document.createElement('input')
  input.type = 'search'
  input.className = 'search-input'
  input.placeholder = placeholder
  input.autocomplete = 'off'

  let debounceTimer = null
  input.addEventListener('input', (e) => {
    const query = e.target.value
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      onSearch(query)
    }, 250)
  })

  container.appendChild(searchIcon)
  container.appendChild(input)

  return {
    element: container,
    setInput(value) {
      input.value = value
    },
    clear() {
      input.value = ''
      onSearch('')
    }
  }
}

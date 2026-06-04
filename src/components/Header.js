/**
 * Header component — title + date filter
 */

export function Header({ selectedDate, onDateChange, onSearch }) {
  const container = document.createElement('header')
  container.className = 'app-header'

  const title = document.createElement('h1')
  title.textContent = 'Notas'

  const dateWrapper = document.createElement('div')
  dateWrapper.className = 'date-wrapper'

  const dateIcon = document.createElement('span')
  dateIcon.className = 'date-icon'
  dateIcon.textContent = '📅'

  const dateInput = document.createElement('input')
  dateInput.type = 'date'
  dateInput.id = 'date-filter'
  dateInput.className = 'date-input'
  dateInput.value = selectedDate || ''

  dateInput.addEventListener('change', (e) => {
    const val = e.target.value
    if (val) {
      onDateChange(val)
    } else {
      onDateChange(null)
    }
  })

  dateWrapper.appendChild(dateIcon)
  dateWrapper.appendChild(dateInput)

  container.appendChild(title)
  container.appendChild(dateWrapper)

  return {
    element: container,
    setDate(date) {
      dateInput.value = date || ''
    },
    onSearch
  }
}

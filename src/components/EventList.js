/**
 * EventList — container for event cards
 */

import { EventCard } from "./EventCard.js";

export function EventList({ events = [], onEventClick, onEventEdit, onEventDelete }) {
  const container = document.createElement("div");
  container.className = "event-list";

  let currentEvents = [...events];

  function setEvents(newEvents) {
    currentEvents = newEvents;
  }

  function renderCards(eventsToRender) {
    eventsToRender.forEach((event) => {
      const card = EventCard({
        event,
        onClick: onEventClick,
        onEdit: onEventEdit,
        onDelete: onEventDelete,
      });
      card.style.opacity = "0";
      card.style.transform = "translateY(10px)";
      container.appendChild(card);
      requestAnimationFrame(() => {
        card.style.transition = "opacity 0.25s ease, transform 0.25s ease";
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";
      });
    });
  }

  function render() {
    container.innerHTML = "";

    if (currentEvents.length === 0) {
      const empty = document.createElement("div");
      empty.className = "event-list-empty";
      empty.innerHTML = `
        <div class="empty-icon">📅</div>
        <p class="empty-text">No hay eventos</p>
        <p class="empty-hint">Pulsa el botón + para crear uno</p>
      `;
      container.appendChild(empty);
      return;
    }

    renderCards(currentEvents);
  }

  return {
    element: container,
    render,
    setEvents,
  };
}

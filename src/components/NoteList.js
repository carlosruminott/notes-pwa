/**
 * NoteList component — container for note cards with pagination + animations
 */

import { NoteCard } from "./NoteCard.js";
import { getNotesCount } from "../db.js";

export function NoteList({
  notes = [],
  onNoteClick,
  onTogglePin,
  onToggleArchive,
}) {
  const container = document.createElement("div");
  container.className = "note-list";

  let currentNotes = [...notes];

  function setNotes(newNotes) {
    currentNotes = newNotes;
  }

  let isLoading = false;
  let hasMore = true;
  let lastUpdatedAt = null;

  async function checkMore() {
    if (isLoading || !hasMore) return;
    const total = await getNotesCount();
    const loaded = container.querySelectorAll(".note-card").length;
    hasMore = loaded < total;
  }

  function renderCards(notesToRender) {
    notesToRender.forEach((note) => {
      const card = NoteCard({
        note,
        onClick: onNoteClick,
        onTogglePin,
        onToggleArchive,
      });
      // Fade-in animation
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
    console.log(
      "[NoteList] render called, currentNotes.length:",
      currentNotes.length,
    );
    container.innerHTML = "";

    if (currentNotes.length === 0) {
      const empty = document.createElement("div");
      empty.className = "note-list-empty";
      empty.innerHTML = `
        <div class="empty-icon">📝</div>
        <p class="empty-text">No hay notas</p>
        <p class="empty-hint">Pulsa el botón + para crear una</p>
      `;
      container.appendChild(empty);
      return;
    }

    renderCards(currentNotes);
  }

  function removeCard(noteId) {
    const card = container.querySelector(`[data-note-id="${noteId}"]`);
    if (!card) return;
    card.style.transition = "opacity 0.2s ease, transform 0.2s ease";
    card.style.opacity = "0";
    card.style.transform = "translateX(-20px)";
    setTimeout(() => card.remove(), 200);
  }

  function addCard(note) {
    const card = NoteCard({
      note,
      onClick: onNoteClick,
      onTogglePin,
      onToggleArchive,
    });
    card.style.opacity = "0";
    card.style.transform = "translateY(-10px)";
    container.insertBefore(card, container.firstChild);
    requestAnimationFrame(() => {
      card.style.transition = "opacity 0.25s ease, transform 0.25s ease";
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
    });
  }

  function updateCard(note) {
    const card = container.querySelector(`[data-note-id="${note.id}"]`);
    if (!card) return;
    // Re-render this single card
    const newCard = NoteCard({
      note,
      onClick: onNoteClick,
      onTogglePin,
      onToggleArchive,
    });
    card.replaceWith(newCard);
  }

  // Infinite scroll
  container.addEventListener("scroll", () => {
    const { scrollTop, scrollHeight, clientHeight } = container;
    if (scrollHeight - scrollTop - clientHeight < 100) {
      checkMore();
    }
  });

  // Public API
  return {
    element: container,
    render,
    setNotes,
    removeCard,
    addCard,
    updateCard,
    checkMore,
    resetState() {
      hasMore = true;
      lastUpdatedAt = null;
      isLoading = false;
    },
  };
}

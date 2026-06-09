/**
 * EventEditor — modal for creating/editing events
 */

const CATEGORIES = ["TRABAJO", "PERSONAL", "SALUD", "ESTUDIO", "OTRO"];

export function EventEditor({ onSave, onClose, onDelete }) {
  const overlay = document.createElement("div");
  overlay.className = "event-editor-overlay";
  overlay.hidden = true;

  const editor = document.createElement("div");
  editor.className = "event-editor";

  // Toolbar
  const toolbar = document.createElement("div");
  toolbar.className = "event-editor-toolbar";

  const saveBtn = document.createElement("button");
  saveBtn.className = "btn-save";
  saveBtn.textContent = "Guardar";

  const closeBtn = document.createElement("button");
  closeBtn.className = "btn-close";
  closeBtn.textContent = "✕";

  toolbar.appendChild(saveBtn);
  toolbar.appendChild(closeBtn);

  // Title
  const titleInput = document.createElement("input");
  titleInput.className = "event-editor-title";
  titleInput.type = "text";
  titleInput.placeholder = "Título del evento";

  // Category selector
  const categoryWrapper = document.createElement("div");
  categoryWrapper.className = "category-selector";

  const categoryLabel = document.createElement("span");
  categoryLabel.className = "category-label";
  categoryLabel.textContent = "Categoría:";

  const categoryButtons = [];
  CATEGORIES.forEach((cat) => {
    const btn = document.createElement("button");
    btn.className = "category-btn";
    btn.textContent = cat;
    btn.dataset.category = cat;
    categoryButtons.push(btn);
    categoryWrapper.appendChild(btn);
  });

  categoryWrapper.appendChild(categoryLabel);

  // Date input
  const dateInput = document.createElement("input");
  dateInput.className = "event-editor-date";
  dateInput.type = "date";

  // Time input
  const timeInput = document.createElement("input");
  timeInput.className = "event-editor-time";
  timeInput.type = "time";

  // Content
  const contentArea = document.createElement("textarea");
  contentArea.className = "event-editor-content";
  contentArea.placeholder = "Descripción...";

  // Footer
  const footer = document.createElement("div");
  footer.className = "event-editor-footer";

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "btn-delete";
  deleteBtn.textContent = "🗑️ Eliminar";
  footer.appendChild(deleteBtn);

  editor.appendChild(toolbar);
  editor.appendChild(titleInput);
  editor.appendChild(categoryWrapper);
  editor.appendChild(dateInput);
  editor.appendChild(timeInput);
  editor.appendChild(contentArea);
  editor.appendChild(footer);
  overlay.appendChild(editor);

  let currentEvent = null;
  let selectedCategory = "TRABAJO";

  function populate(e) {
    currentEvent = e;
    titleInput.value = e?.title ?? "";
    dateInput.value = e?.date ?? new Date().toISOString().split("T")[0];
    timeInput.value = e?.time ?? "09:00";
    contentArea.value = e?.content ?? "";
    selectedCategory = e?.category ?? "TRABAJO";
    updateCategoryUI();
  }

  function updateCategoryUI() {
    categoryButtons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.category === selectedCategory);
    });
  }

  categoryButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedCategory = btn.dataset.category;
      updateCategoryUI();
    });
  });

  function getFormData() {
    return {
      title: titleInput.value.trim(),
      content: contentArea.value.trim(),
      category: selectedCategory,
      date: dateInput.value,
      time: timeInput.value,
    };
  }

  saveBtn.addEventListener("click", () => {
    const data = getFormData();
    onSave(data, currentEvent?.id);
  });

  closeBtn.addEventListener("click", onClose);

  deleteBtn.addEventListener("click", () => {
    if (confirm("¿Eliminar este evento?") && currentEvent?.id) {
      onDelete(currentEvent.id);
    }
  });

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) onClose();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") onClose();
  });

  return {
    element: overlay,
    show(e) {
      populate(e);
      overlay.hidden = false;
      editor.style.display = "flex";
      titleInput.focus();
    },
    hide() {
      overlay.hidden = true;
      editor.style.display = "none";
    },
  };
}

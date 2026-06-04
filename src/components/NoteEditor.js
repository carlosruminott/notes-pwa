/**
 * NoteEditor component — overlay/modal for creating/editing notes
 */

export function NoteEditor({ note, onSave, onClose, onDelete }) {
  const overlay = document.createElement("div");
  overlay.className = "note-editor-overlay";
  overlay.hidden = true;

  const editor = document.createElement("div");
  editor.className = "note-editor";

  const toolbar = document.createElement("div");
  toolbar.className = "note-editor-toolbar";

  const saveBtn = document.createElement("button");
  saveBtn.className = "btn-save";
  saveBtn.textContent = "Guardar";

  const saveStatus = document.createElement("span");
  saveStatus.className = "save-status";
  saveStatus.textContent = "";

  const closeBtn = document.createElement("button");
  closeBtn.className = "btn-close";
  closeBtn.textContent = "✕";

  toolbar.appendChild(saveBtn);
  toolbar.appendChild(saveStatus);
  toolbar.appendChild(closeBtn);

  const titleInput = document.createElement("input");
  titleInput.className = "note-editor-title";
  titleInput.type = "text";
  titleInput.placeholder = "Título";

  const tagsInput = document.createElement("input");
  tagsInput.className = "note-editor-tags";
  tagsInput.type = "text";
  tagsInput.placeholder = "Tags (separados por comas)";

  const contentArea = document.createElement("textarea");
  contentArea.className = "note-editor-content";
  contentArea.placeholder = "Escribe tu nota aquí...";

  const footer = document.createElement("div");
  footer.className = "note-editor-footer";

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "btn-delete";
  deleteBtn.textContent = "🗑️ Eliminar";

  footer.appendChild(deleteBtn);

  editor.appendChild(toolbar);
  editor.appendChild(titleInput);
  editor.appendChild(tagsInput);
  editor.appendChild(contentArea);
  editor.appendChild(footer);
  overlay.appendChild(editor);

  // Current note reference
  let currentNote = null;

  // Auto-save state
  let autoSaveTimer = null;
  let lastSavedData = "";
  let isSaving = false;
  const SAVE_DELAY = 1000; // 1 segundo

  function getFormData() {
    return {
      title: titleInput.value.trim(),
      content: contentArea.value.trim(),
      tags: tagsInput.value
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };
  }

  function serializeData(data) {
    return JSON.stringify({
      title: data.title,
      content: data.content,
      tags: data.tags,
    });
  }

  function showSaveStatus(msg) {
    saveStatus.textContent = msg;
    saveStatus.classList.add("visible");
    setTimeout(() => {
      saveStatus.textContent = "";
      saveStatus.classList.remove("visible");
    }, 1500);
  }

  function scheduleAutoSave() {
    if (isSaving) return; // evitar acumulación de saves
    clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(() => {
      const data = getFormData();
      const serialized = serializeData(data);
      if (serialized !== lastSavedData && currentNote) {
        onSave(data, true);
        lastSavedData = serialized;
        showSaveStatus("✓");
      }
    }, SAVE_DELAY);
  }

  // Populate from note
  function populate(n) {
    currentNote = n;
    lastSavedData = "";
    titleInput.value = n?.title ?? "";
    contentArea.value = n?.content ?? "";
    tagsInput.value = (n?.tags ?? []).join(", ");
    contentArea.style.height = "auto";
    contentArea.style.height = contentArea.scrollHeight + "px";
  }

  // Auto-resize textarea
  contentArea.addEventListener("input", () => {
    contentArea.style.height = "auto";
    contentArea.style.height = contentArea.scrollHeight + "px";
  });

  // Auto-save on any input change (title, tags, content)
  [titleInput, tagsInput, contentArea].forEach((el) => {
    el.addEventListener("input", () => {
      scheduleAutoSave();
    });
  });

  // Event listeners
  saveBtn.addEventListener("click", () => {
    const data = getFormData();
    onSave(data, false);
    lastSavedData = serializeData(data);
    showSaveStatus("Guardado");
  });

  closeBtn.addEventListener("click", onClose);

  deleteBtn.addEventListener("click", () => {
    if (confirm("¿Eliminar esta nota?")) {
      onDelete(currentNote?.id);
    }
  });

  // Close on overlay click (not on editor content)
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      onClose();
    }
  });

  // Keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      onClose();
    }
    // Ctrl/Cmd + S to save
    if ((e.ctrlKey || e.metaKey) && e.key === "s") {
      e.preventDefault();
      if (isSaving) return;
      const data = getFormData();
      onSave(data);
      lastSavedData = serializeData(data);
      showSaveStatus("Guardado");
    }
  });

  return {
    element: overlay,
    show(n) {
      populate(n);
      overlay.hidden = false;
      editor.style.display = "flex";
      titleInput.focus();
    },
    hide() {
      clearTimeout(autoSaveTimer);
      // Immediate save before closing
      if (!isSaving && currentNote) {
        const data = getFormData();
        const serialized = serializeData(data);
        if (serialized !== lastSavedData) {
          onSave(data);
          lastSavedData = serialized;
        }
      }
      overlay.hidden = true;
      editor.style.display = "none";
    },
    getFormData,
    populate,
  };
}

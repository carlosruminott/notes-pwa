/**
 * App — orchestrates all components
 */

import { Header } from "./components/Header.js";
import { SearchBar } from "./components/SearchBar.js";
import { NoteList } from "./components/NoteList.js";
import { Fab } from "./components/Fab.js";
import { NoteEditor } from "./components/NoteEditor.js";
import {
  createNote,
  getAllNotes,
  getNote,
  updateNote,
  deleteNote,
  searchNotes,
  getNotesPaginated,
} from "./db.js";
import "./components/style.css";

const today = new Date();
const dateStr = today.toISOString().split("T")[0];

export default class App {
  constructor() {
    this.notes = [];
    this.selectedDate = null;
    this.searchQuery = "";
    this.currentNote = null;
    this.saveTimer = null;

    this.header = Header({
      selectedDate: this.selectedDate,
      onDateChange: (date) => this.onDateChange(date),
    });

    this.searchBar = SearchBar({
      placeholder: "Buscar notas...",
      onSearch: (query) => this.onSearch(query),
    });

    this.noteList = NoteList({
      notes: this.notes,
      onNoteClick: (id) => this.onNoteClick(id),
      onTogglePin: (id) => this.onTogglePin(id),
      onToggleArchive: (id) => this.onToggleArchive(id),
    });

    this.fab = Fab({
      onClick: () => this.onFabClick(),
    });

    this.editor = NoteEditor({
      onSave: (data) => this.onSave(data, false),
      onClose: () => this.onCloseEditor(),
      onDelete: (id) => this.onDelete(id),
    });
  }

  async mount(root) {
    // Build layout
    root.appendChild(this.header.element);
    root.appendChild(this.searchBar.element);
    root.appendChild(this.noteList.element);
    root.appendChild(this.editor.element);
    root.appendChild(this.fab);

    // Load initial data
    await this.loadNotes();
  }

  async loadNotes() {
    this.notes = await getAllNotes();
    console.log("[App] loadNotes:", this.notes.length, "notas cargadas");
    this.noteList.setNotes(this.notes);
    this.noteList.render();
  }

  onDateChange(date) {
    this.selectedDate = date;
    this.header.setDate(date);
    this.applyFilters();
  }

  onSearch(query) {
    this.searchQuery = query;
    this.searchBar.setInput(query);
    this.applyFilters();
  }

  async applyFilters() {
    let notes;

    if (this.searchQuery) {
      notes = await searchNotes(this.searchQuery);
    } else {
      notes = await getAllNotes();
    }

    // Filter by date if selected
    if (this.selectedDate) {
      const start = new Date(this.selectedDate);
      const end = new Date(this.selectedDate);
      end.setHours(23, 59, 59, 999);

      notes = notes.filter((note) => {
        const d = new Date(note.updatedAt);
        return d >= start && d <= end;
      });
    }

    this.notes = notes;
    this.noteList.render();
  }

  async onFabClick() {
    this.currentNote = await createNote();
    this.editor.show(this.currentNote);
  }

  async onNoteClick(id) {
    const note = await getNote(id);
    this.currentNote = note;
    this.editor.show(note);
  }

  async onTogglePin(id) {
    const note = await getNote(id);
    const newPinned = !note.isPinned;
    await updateNote(id, { isPinned: newPinned });
    await this.loadNotes();
  }

  async onToggleArchive(id) {
    const note = await getNote(id);
    const newArchived = !note.isArchived;
    await updateNote(id, { isArchived: newArchived });
    await this.loadNotes();
  }

  async onSave(data, isAutoSave = false) {
    if (!this.currentNote) return;

    await updateNote(this.currentNote.id, {
      title: data.title,
      content: data.content,
      tags: data.tags,
    });

    if (!isAutoSave) {
      this.editor.hide();
      await this.loadNotes();
    }
  }

  async onCloseEditor() {
    this.editor.hide();
    this.currentNote = null;
  }

  async onDelete(id) {
    await deleteNote(id);
    this.editor.hide();
    this.currentNote = null;
    await this.loadNotes();
  }
}

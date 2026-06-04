import { Dexie } from "dexie";

const db = new Dexie("NotasIA");

// Schema
db.version(1).stores({
  notes: "id, title, content, tags, createdAt, updatedAt, isPinned, isArchived",
});

/**
 * Create a new note
 */
export async function createNote() {
  const now = Date.now();
  const note = {
    id: crypto.randomUUID(),
    title: "",
    content: "",
    tags: [],
    createdAt: now,
    updatedAt: now,
    isPinned: false,
    isArchived: false,
  };
  await db.notes.add(note);
  return note;
}

/**
 * Get all notes, ordered by updatedAt desc
 */
export async function getAllNotes() {
  try {
    return await db.notes.orderBy("updatedAt").reverse().toArray();
  } catch {
    // Fallback: índice no existe (DB antigua sin updatedAt indexado)
    return (await db.notes.toArray()).sort((a, b) => b.updatedAt - a.updatedAt);
  }
}

/**
 * Get a single note by id
 */
export async function getNote(id) {
  return db.notes.get(id);
}

/**
 * Update a note
 */
export async function updateNote(id, updates) {
  await db.notes.update(id, {
    ...updates,
    updatedAt: Date.now(),
  });
}

/**
 * Delete a note
 */
export async function deleteNote(id) {
  await db.notes.delete(id);
}

/**
 * Search notes by query (title + content)
 */
export async function searchNotes(query) {
  if (!query || query.trim() === "") {
    try {
      return await db.notes.orderBy("updatedAt").reverse().toArray();
    } catch {
      return (await db.notes.toArray()).sort(
        (a, b) => b.updatedAt - a.updatedAt,
      );
    }
  }
  const lowerQuery = query.toLowerCase();
  const results = await db.notes.toArray();
  return results
    .filter((note) => {
      return (
        note.title.toLowerCase().includes(lowerQuery) ||
        note.content.toLowerCase().includes(lowerQuery) ||
        (note.tags &&
          note.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)))
      );
    })
    .sort((a, b) => b.updatedAt - a.updatedAt);
}

/**
 * Toggle pin status
 */
export async function togglePin(id) {
  const note = await db.notes.get(id);
  if (note) {
    await updateNote(id, { isPinned: !note.isPinned });
  }
}

/**
 * Toggle archive status
 */
export async function toggleArchive(id) {
  const note = await db.notes.get(id);
  if (note) {
    await updateNote(id, { isArchived: !note.isArchived });
  }
}

/**
 * Get pinned notes
 */
export async function getPinnedNotes() {
  try {
    return await db.notes
      .where("isPinned")
      .equals(true)
      .sortBy("updatedAt")
      .then((notes) => notes.reverse());
  } catch {
    const notes = await db.notes.toArray();
    return notes
      .filter((n) => n.isPinned)
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }
}

/**
 * Get archived notes
 */
export async function getArchivedNotes() {
  return db.notes
    .where("isArchived")
    .equals(true)
    .sortBy("updatedAt")
    .then((notes) => notes.reverse());
}

/**
 * Clear all data (for development/testing)
 */
export async function clearAllData() {
  await db.notes.clear();
}

/**
 * Get notes with pagination (cursor-based)
 */
export async function getNotesPaginated(limit = 20, lastUpdatedAt) {
  if (lastUpdatedAt) {
    return db.notes
      .where("updatedAt")
      .above(lastUpdatedAt)
      .reverse()
      .limit(limit)
      .toArray();
  }
  return db.notes.orderBy("updatedAt").reverse().limit(limit).toArray();
}

/**
 * Get the total count of notes
 */
export async function getNotesCount() {
  return db.notes.count();
}

export default db;

import { Note, NoteCreateInput, NoteUpdateInput } from "../types/note";
import { api } from "./api";

export async function fetchNotes(q?: string): Promise<Note[]> {
  const res = await api.get<Note[]>("/notes/", { params: q ? { q } : {} });
  return res.data;
}

export async function createNote(data: NoteCreateInput): Promise<Note> {
  const res = await api.post<Note>("/notes/", data);
  return res.data;
}

export async function updateNote(id: number, data: NoteUpdateInput): Promise<Note> {
  const res = await api.patch<Note>(`/notes/${id}`, data);
  return res.data;
}

export async function deleteNote(id: number): Promise<void> {
  await api.delete(`/notes/${id}`);
}
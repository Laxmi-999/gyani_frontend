export interface Note {
  id: number;
  title: string;
  content: string;
  tags: string | null;
  created_at: string;
  updated_at: string;
}

export interface NoteCreateInput {
  title: string;
  content: string;
  tags?: string;
}

export interface NoteUpdateInput {
  title?: string;
  content?: string;
  tags?: string;
}
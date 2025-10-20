import axios from "axios";
import type { Note, NoteTag } from "../types/note";

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface FetchNotesProps {
  search: string;
  tag?: NoteTag;
  page?: number;
  perPage?: number;
  sortBy?: "created" | "updated";
}

interface CreateNoteProps {
  title: string;
  content: string;
  tag: NoteTag;
}

export const fetchNotes = async (noteQueryParams: FetchNotesProps) => {
  const token = import.meta.env.VITE_NOTEHUB_TOKEN;

  const response = await axios.get<FetchNotesResponse>(
    "https://notehub-public.goit.study/api/notes",
    {
      params: {
        search: noteQueryParams.search,
        tag: noteQueryParams.tag,
        page: noteQueryParams.page,
        perPage: noteQueryParams.perPage,
        sortBy: noteQueryParams.sortBy,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const createNote = async (noteData: CreateNoteProps): Promise<Note> => {
  const token = import.meta.env.VITE_NOTEHUB_TOKEN;

  const response = await axios.post<Note>(
    "https://notehub-public.goit.study/api/notes",
    noteData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

export const deleteNote = async (noteId: string): Promise<Note> => {
  const token = import.meta.env.VITE_NOTEHUB_TOKEN;

  const response = await axios.delete<Note>(
    `https://notehub-public.goit.study/api/notes/${noteId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

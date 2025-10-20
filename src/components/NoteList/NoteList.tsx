import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import css from "./NoteList.module.css";
import {
  fetchNotes,
  deleteNote,
  type FetchNotesResponse,
  type FetchNotesProps,
} from "../../services/noteService";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

export default function NoteList({
  noteQueryParams,
  onTotalPagesChange,
}: {
  noteQueryParams: FetchNotesProps;
  onTotalPagesChange?: (totalPages: number) => void;
}) {
  const { data, isLoading, isError } = useQuery<FetchNotesResponse>({
    queryKey: ["notes", noteQueryParams],
    queryFn: () => fetchNotes(noteQueryParams),
  });

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (noteId: string) => deleteNote(noteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", noteQueryParams] });
    },
  });

  const notes = data?.notes ?? [];

  const totalPages = data?.totalPages || 1;

  useEffect(() => {
    if (onTotalPagesChange) {
      onTotalPagesChange(totalPages);
    }
  }, [totalPages, onTotalPagesChange]);
  return (
    <>
      {notes.length > 0 && (
        <ul className={css.list}>
          {notes.map((note) => (
            <li key={note.id} className={css.listItem}>
              <h2 className={css.title}>{note.title}</h2>
              <p className={css.content}>{note.content}</p>
              <div className={css.footer}>
                <span className={css.tag}>{note.tag}</span>
                <button
                  className={css.button}
                  onClick={() => deleteMutation.mutate(note.id)}
                  disabled={deleteMutation.isPending}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
    </>
  );
}

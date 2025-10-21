import { useState, useEffect } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import css from "./App.module.css";
import NoteList from "../NoteList/NoteList";
import { Pagination } from "../Pagination/Pagination";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import SearchBox from "../SearchBox/SearchBox";
import type { FetchNotesResponse } from "../../services/noteService";
import { fetchNotes } from "../../services/noteService";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

export default function App() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const perPage = 12;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [debouncedSearch] = useDebounce(search, 700);

  const { data, isLoading, isError } = useQuery<FetchNotesResponse>({
    queryKey: [
      "notes",
      { search: debouncedSearch, page: currentPage, perPage },
    ],
    queryFn: () =>
      fetchNotes({ search: debouncedSearch, page: currentPage, perPage }),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (data?.totalPages) {
      setTotalPages(data.totalPages);
    }
  }, [data?.totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onSearch={(value) => setSearch(value)} />

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
          />
        )}

        <button className={css.button} onClick={openModal}>
          Create note +
        </button>

        {isModalOpen && (
          <Modal onClose={closeModal}>
            <NoteForm onClose={closeModal} />
          </Modal>
        )}
      </header>
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {data?.notes && data.notes.length > 0 && (
        <NoteList notes={data.notes} onTotalPagesChange={setTotalPages} />
      )}
    </div>
  );
}

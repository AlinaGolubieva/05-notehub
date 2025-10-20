import { useState, useEffect } from "react";
import css from "./App.module.css";
import NoteList from "../NoteList/NoteList";
import { Pagination } from "../Pagination/Pagination";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import SearchBox from "../SearchBox/SearchBox";
import { useQueryClient } from "@tanstack/react-query";
import { createNote } from "../../services/noteService";
import { useDebounce } from "use-debounce";

export default function App() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const perPage = 12;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const queryClient = useQueryClient();

  const [debouncedSearch] = useDebounce(search, 700);
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

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
            <NoteForm
              onSubmit={async (values) => {
                await createNote(values);
                closeModal();
                queryClient.invalidateQueries({
                  queryKey: ["notes", { search, page: currentPage, perPage }],
                });
              }}
            />
          </Modal>
        )}
      </header>
      <NoteList
        noteQueryParams={{
          search: debouncedSearch,
          page: currentPage,
          perPage,
        }}
        onTotalPagesChange={setTotalPages}
      />
    </div>
  );
}

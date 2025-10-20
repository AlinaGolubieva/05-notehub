import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import css from "./SearchBox.module.css";

type Props = {
  onSearch: (value: string) => void;
};

export default function SearchBox({ onSearch }: Props) {
  const [value, setValue] = useState("");
  const [debouncedValue] = useDebounce(value, 700);

  useEffect(() => {
    onSearch(debouncedValue);
  }, [debouncedValue, onSearch]);

  return (
    <input
      className={css.input}
      type="text"
      placeholder="Search notes"
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

// Search.tsx
import React from "react";
import styles from "./Search.module.css";
import { SearchBarProps } from "../../types";
import { FaSearch } from "react-icons/fa";

const Search: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder,
  onSearchSubmit,
  className,
}) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearchSubmit(value);
  };

  return (
    <form className={styles.searchContainer} onSubmit={handleSubmit}>
      <FaSearch className={styles.searchIcon} />
      <input
        type="text"
        className={styles.searchInput}
        placeholder={placeholder || "Search..."}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </form>
  );
};

export default Search;

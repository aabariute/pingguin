import { IoSearchOutline } from "react-icons/io5";

export default function SearchInput({
  query,
  setQuery,
}: {
  query: string;
  setQuery: (v: string) => void;
}) {
  return (
    <label className="input lg:w-full">
      <input
        type="search"
        placeholder="Search contacts"
        maxLength={12} // Nickname cannot exceed 12 characters
        value={query}
        onChange={(e) => setQuery(e.target.value.trim().toLowerCase())}
      />
      <IoSearchOutline className="w-5 h-5 text-primary/80" />
    </label>
  );
}

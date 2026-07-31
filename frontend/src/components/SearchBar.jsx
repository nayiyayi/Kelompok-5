export default function SearchBar({ value, onChange }) {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <form className="search-wrapper" onSubmit={handleSubmit}>
      <i className="fas fa-search" />
      <input
        type="search"
        placeholder="Cari menu kopi atau non-kopi favoritmu..."
        className="search-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </form>
  );
}

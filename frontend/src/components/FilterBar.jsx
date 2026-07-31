export default function FilterBar({ sortValue, onSortChange }) {
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <select
        className="filter-select"
        value={sortValue}
        onChange={(e) => onSortChange(e.target.value)}
      >
        <option value="">Urutkan Berdasarkan</option>
        <option value="price_asc">Harga Termurah</option>
        <option value="price_desc">Harga Termahal</option>
        <option value="name_asc">Nama A-Z</option>
        <option value="name_desc">Nama Z-A</option>
        <option value="newest">Terbaru</option>
        <option value="popular">Terlaris</option>
      </select>
    </form>
  );
}

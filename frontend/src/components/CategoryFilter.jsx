export default function CategoryFilter({ categories, activeCategory, onSelect }) {
  return (
    <div className="category-pills">
      <button 
        className={`category-pill${activeCategory === '' ? ' active' : ''}`}
        onClick={() => onSelect('')}
      >
        Semua Menu
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          className={`category-pill${activeCategory === String(category.id) ? ' active' : ''}`}
          onClick={() => onSelect(String(category.id))}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}

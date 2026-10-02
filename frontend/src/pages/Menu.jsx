import { useState } from 'react';
import { useApp } from '../context/AppContext';
import FoodCard from '../components/FoodCard';

const categories = ['All', 'Burger', 'Pizza', 'Biryani', 'Chinese', 'South Indian', 'Dessert', 'Ice Cream', 'Drinks', 'Sandwich', 'Pasta', 'Rolls'];

export default function Menu() {
  const { foods, fetchFoods } = useApp();
  const [active, setActive] = useState('All');
  const [search, setSearch] = useState('');

  const handleCat = (cat) => { setActive(cat); fetchFoods(cat === 'All' ? '' : cat); setSearch(''); };

  const handleSearch = (val) => {
    setSearch(val);
    if (val.trim()) { setActive('All'); fetchFoods(''); }
  };

  const filtered = foods.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={styles.container}>
      <div className="menu-header" style={styles.header}>
        <h1 style={styles.title}>Our Menu</h1>
        <input className="menu-search" value={search} onChange={e => handleSearch(e.target.value)} placeholder="🔍 Search dishes..." style={styles.search} />
      </div>
      <div style={styles.cats}>
        {categories.map(cat => (
          <button key={cat} onClick={() => handleCat(cat)} style={{ ...styles.catBtn, ...(active === cat ? styles.active : {}) }}>{cat}</button>
        ))}
      </div>
      <p style={styles.count}>{filtered.length} items found</p>
      {filtered.length === 0 ? (
        <div style={styles.empty}>No items found in this category. Add from admin panel!</div>
      ) : (
        <div style={styles.grid}>
          {filtered.map(food => <FoodCard key={food._id} food={food} />)}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: '40px 5%' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' },
  title: { fontSize: '28px', fontWeight: '800', color: '#222', margin: 0 },
  search: { padding: '10px 20px', border: '2px solid #f0f0f0', borderRadius: '25px', fontSize: '15px', outline: 'none', width: '280px' },
  cats: { display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '25px' },
  catBtn: { padding: '8px 18px', border: '2px solid #f0f0f0', borderRadius: '25px', background: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: '600', color: '#555', transition: 'all 0.2s' },
  active: { background: '#ff6b35', color: '#fff', border: '2px solid #ff6b35' },
  count: { color: '#888', fontSize: '14px', marginBottom: '20px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' },
  empty: { textAlign: 'center', padding: '60px', color: '#888', fontSize: '16px' }
};

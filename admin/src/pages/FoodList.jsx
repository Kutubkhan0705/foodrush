import { useEffect, useState } from 'react';
import API from '../utils/api';
import toast from 'react-hot-toast';
import { FaTrash, FaEdit } from 'react-icons/fa';

export default function FoodList() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFoods = async () => {
    const { data } = await API.get('/food');
    setFoods(data);
    setLoading(false);
  };

  useEffect(() => { fetchFoods(); }, []);

  const deleteFood = async (id) => {
    if (!window.confirm('Delete this food item?')) return;
    await API.delete(`/food/${id}`);
    toast.success('Food deleted');
    setFoods(foods.filter(f => f._id !== id));
  };

  const toggleAvailable = async (food) => {
    const { data } = await API.put(`/food/${food._id}`, { available: !food.available });
    setFoods(foods.map(f => f._id === food._id ? data : f));
    toast.success(`${food.name} ${data.available ? 'enabled' : 'disabled'}`);
  };

  if (loading) return <div style={styles.center}><div style={styles.spinner} /></div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Food List</h1>
        <span style={styles.count}>{foods.length} items</span>
      </div>
      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.thead}>
              <th style={styles.th}>Image</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Category</th>
              <th style={styles.th}>Price</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {foods.map(food => (
              <tr key={food._id} style={styles.tr}>
                <td style={styles.td}>
                  <img src={food.image?.startsWith('http') ? food.image : `http://localhost:5000/uploads/${food.image}`} alt={food.name} style={styles.img} onError={e => e.target.src = 'https://via.placeholder.com/50?text=F'} />
                </td>
                <td style={styles.td}>
                  <p style={styles.foodName}>{food.name}</p>
                  <p style={styles.foodDesc}>{food.description?.slice(0, 40)}...</p>
                </td>
                <td style={styles.td}><span style={styles.catBadge}>{food.category}</span></td>
                <td style={styles.td}><strong style={{ color: '#ff6b35' }}>₹{food.price}</strong></td>
                <td style={styles.td}>
                  <button onClick={() => toggleAvailable(food)} style={{ ...styles.statusBtn, background: food.available ? '#f0fdf4' : '#fef2f2', color: food.available ? '#22c55e' : '#ef4444', border: food.available ? '1px solid #22c55e' : '1px solid #ef4444' }}>
                    {food.available ? '✓ Available' : '✗ Unavailable'}
                  </button>
                </td>
                <td style={styles.td}>
                  <button onClick={() => deleteFood(food._id)} style={styles.deleteBtn}><FaTrash size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {foods.length === 0 && <div style={styles.empty}>No food items yet. <a href="/add-food" style={{ color: '#ff6b35' }}>Add one!</a></div>}
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '35px' },
  header: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' },
  title: { fontSize: '26px', fontWeight: '800', color: '#222', margin: 0 },
  count: { background: '#ff6b35', color: '#fff', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' },
  tableWrap: { background: '#fff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 2px 15px rgba(0,0,0,0.06)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: '#f9f9f9' },
  th: { padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '700', color: '#555', borderBottom: '2px solid #f0f0f0' },
  tr: { borderBottom: '1px solid #f5f5f5', transition: 'background 0.15s' },
  td: { padding: '14px 16px', verticalAlign: 'middle' },
  img: { width: '55px', height: '55px', borderRadius: '10px', objectFit: 'cover' },
  foodName: { fontWeight: '700', fontSize: '14px', color: '#222', margin: '0 0 3px' },
  foodDesc: { fontSize: '12px', color: '#aaa', margin: 0 },
  catBadge: { background: '#fff5f0', color: '#ff6b35', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' },
  statusBtn: { padding: '5px 12px', borderRadius: '20px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' },
  deleteBtn: { background: '#fef2f2', color: '#ef4444', border: '1px solid #ef4444', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer' },
  empty: { padding: '40px', textAlign: 'center', color: '#888' },
  center: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' },
  spinner: { width: '40px', height: '40px', border: '4px solid #f0f0f0', borderTop: '4px solid #ff6b35', borderRadius: '50%', animation: 'spin 1s linear infinite' }
};

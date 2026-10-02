import { useApp } from '../context/AppContext';
import { FaStar, FaClock, FaPlus, FaMinus } from 'react-icons/fa';

export default function FoodCard({ food }) {
  const { addToCart, removeFromCart, cartItems } = useApp();
  const qty = cartItems[food._id] || 0;
  const imgSrc = food.image?.startsWith('http') ? food.image : `http://localhost:5000/uploads/${food.image}`;

  return (
    <div style={styles.card}>
      <div style={styles.imgWrap}>
        <img src={imgSrc} alt={food.name} style={styles.img} onError={e => e.target.src = 'https://via.placeholder.com/300x200?text=Food'} />
        <span style={styles.category}>{food.category}</span>
      </div>
      <div style={styles.body}>
        <h3 style={styles.name}>{food.name}</h3>
        <p style={styles.desc}>{food.description}</p>
        <div style={styles.meta}>
          <span style={styles.rating}><FaStar color="#ffc107" size={12} /> {food.rating}</span>
          <span style={styles.time}><FaClock size={12} color="#888" /> {food.prepTime}</span>
        </div>
        <div style={styles.footer}>
          <span style={styles.price}>₹{food.price}</span>
          {qty === 0 ? (
            <button onClick={() => addToCart(food._id)} style={styles.addBtn}>Add +</button>
          ) : (
            <div style={styles.qtyControl}>
              <button onClick={() => removeFromCart(food._id)} style={styles.qtyBtn}><FaMinus size={10} /></button>
              <span style={styles.qty}>{qty}</span>
              <button onClick={() => addToCart(food._id)} style={styles.qtyBtn}><FaPlus size={10} /></button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: { background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer' },
  imgWrap: { position: 'relative', height: '180px', overflow: 'hidden' },
  img: { width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' },
  category: { position: 'absolute', top: '10px', left: '10px', background: '#ff6b35', color: '#fff', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' },
  body: { padding: '15px' },
  name: { margin: '0 0 5px', fontSize: '16px', fontWeight: '700', color: '#222' },
  desc: { margin: '0 0 10px', fontSize: '12px', color: '#888', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' },
  meta: { display: 'flex', gap: '15px', marginBottom: '12px' },
  rating: { display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#555' },
  time: { display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#888' },
  footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  price: { fontSize: '18px', fontWeight: '800', color: '#ff6b35' },
  addBtn: { background: '#ff6b35', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '25px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' },
  qtyControl: { display: 'flex', alignItems: 'center', gap: '10px', background: '#fff3ee', borderRadius: '25px', padding: '5px 12px' },
  qtyBtn: { background: '#ff6b35', color: '#fff', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  qty: { fontWeight: '700', fontSize: '14px', color: '#ff6b35', minWidth: '20px', textAlign: 'center' }
};

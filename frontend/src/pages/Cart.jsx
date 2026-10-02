import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaPlus, FaMinus, FaShoppingCart } from 'react-icons/fa';

export default function Cart() {
  const { cartItems, foods, addToCart, removeFromCart, getCartTotal } = useApp();
  const navigate = useNavigate();

  const cartFoods = Object.entries(cartItems)
    .filter(([, qty]) => qty > 0)
    .map(([id, qty]) => ({ ...foods.find(f => f._id === id), qty }))
    .filter(f => f._id);

  const subtotal = getCartTotal();
  const delivery = subtotal > 0 ? 40 : 0;
  const total = subtotal + delivery;

  if (cartFoods.length === 0) return (
    <div style={styles.empty}>
      <FaShoppingCart size={80} color="#ddd" />
      <h2 style={{ color: '#888', marginTop: '20px' }}>Your cart is empty</h2>
      <p style={{ color: '#aaa' }}>Add some delicious food to get started!</p>
      <button onClick={() => navigate('/')} style={styles.shopBtn}>Browse Menu</button>
    </div>
  );

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🛒 Your Cart</h1>
      <div className="cart-layout" style={styles.layout}>
        <div style={styles.items}>
          {cartFoods.map(food => (
            <div key={food._id} style={styles.item}>
              <img src={food.image?.startsWith('http') ? food.image : `http://localhost:5000/uploads/${food.image}`} alt={food.name} style={styles.img} onError={e => e.target.src = 'https://via.placeholder.com/80?text=Food'} />
              <div style={styles.info}>
                <h3 style={styles.name}>{food.name}</h3>
                <p style={styles.price}>₹{food.price} each</p>
              </div>
              <div style={styles.controls}>
                <button onClick={() => removeFromCart(food._id)} style={styles.ctrlBtn}><FaMinus size={10} /></button>
                <span style={styles.qty}>{food.qty}</span>
                <button onClick={() => addToCart(food._id)} style={styles.ctrlBtn}><FaPlus size={10} /></button>
              </div>
              <span style={styles.itemTotal}>₹{food.price * food.qty}</span>
            </div>
          ))}
        </div>

        <div className="cart-summary" style={styles.summary}>
          <h2 style={styles.summaryTitle}>Order Summary</h2>
          <div style={styles.summaryRow}><span>Subtotal</span><span>₹{subtotal}</span></div>
          <div style={styles.summaryRow}><span>Delivery Fee</span><span>₹{delivery}</span></div>
          <div style={styles.summaryRow}><span style={{ color: '#22c55e', fontSize: '13px' }}>🎉 Free delivery on orders above ₹500</span></div>
          <div style={{ ...styles.summaryRow, ...styles.totalRow }}><span>Total</span><span style={{ color: '#ff6b35' }}>₹{total}</span></div>
          <button onClick={() => navigate('/checkout')} style={styles.checkoutBtn}>Proceed to Checkout →</button>
          <button onClick={() => navigate('/')} style={styles.continueBtn}>+ Add More Items</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '40px 5%', maxWidth: '1100px', margin: '0 auto' },
  title: { fontSize: '28px', fontWeight: '800', marginBottom: '30px', color: '#222' },
  layout: { display: 'grid', gridTemplateColumns: '1fr 350px', gap: '30px' },
  items: { display: 'flex', flexDirection: 'column', gap: '15px' },
  item: { display: 'flex', alignItems: 'center', gap: '15px', background: '#fff', padding: '15px', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' },
  img: { width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover' },
  info: { flex: 1 },
  name: { margin: '0 0 5px', fontSize: '16px', fontWeight: '700', color: '#222' },
  price: { margin: 0, fontSize: '13px', color: '#888' },
  controls: { display: 'flex', alignItems: 'center', gap: '10px', background: '#f9f9f9', borderRadius: '25px', padding: '6px 12px' },
  ctrlBtn: { background: '#ff6b35', color: '#fff', border: 'none', borderRadius: '50%', width: '26px', height: '26px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  qty: { fontWeight: '700', fontSize: '15px', minWidth: '20px', textAlign: 'center' },
  itemTotal: { fontWeight: '800', fontSize: '16px', color: '#ff6b35', minWidth: '60px', textAlign: 'right' },
  summary: { background: '#fff', borderRadius: '20px', padding: '25px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', height: 'fit-content', position: 'sticky', top: '90px' },
  summaryTitle: { fontSize: '20px', fontWeight: '800', marginBottom: '20px', color: '#222' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '15px', color: '#555' },
  totalRow: { borderTop: '2px solid #f0f0f0', paddingTop: '12px', marginTop: '5px', fontWeight: '800', fontSize: '18px', color: '#222' },
  checkoutBtn: { width: '100%', background: 'linear-gradient(135deg, #ff6b35, #f7931e)', color: '#fff', border: 'none', padding: '14px', borderRadius: '12px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', marginTop: '15px' },
  continueBtn: { width: '100%', background: 'transparent', color: '#ff6b35', border: '2px solid #ff6b35', padding: '12px', borderRadius: '12px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', marginTop: '10px' },
  empty: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '10px' },
  shopBtn: { background: '#ff6b35', color: '#fff', border: 'none', padding: '12px 30px', borderRadius: '25px', cursor: 'pointer', fontSize: '15px', fontWeight: '600', marginTop: '15px' }
};

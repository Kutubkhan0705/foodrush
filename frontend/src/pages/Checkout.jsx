import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import API from '../utils/api';
import toast from 'react-hot-toast';

export default function Checkout() {
  const { cartItems, foods, getCartTotal, setCartItems } = useApp();
  const navigate = useNavigate();
  const [address, setAddress] = useState({ firstName: '', lastName: '', street: '', city: '', state: '', zip: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');

  const subtotal = getCartTotal();
  const total = subtotal + 40;

  const cartFoods = Object.entries(cartItems)
    .filter(([, qty]) => qty > 0)
    .map(([id, qty]) => {
      const food = foods.find(f => f._id === id);
      return food ? { foodId: id, name: food.name, price: food.price, quantity: qty, image: food.image } : null;
    }).filter(Boolean);

  const handleCOD = async () => {
    setLoading(true);
    try {
      await API.post('/order/place', { items: cartFoods, amount: total, address, paymentMethod: 'cod', payment: false });
      await API.post('/cart/clear');
      setCartItems({});
      toast.success('Order placed! Pay on delivery 🛵');
      navigate('/orders');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Order failed. Try again.');
    } finally { setLoading(false); }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (cartFoods.length === 0) { toast.error('Cart is empty'); return; }
    if (paymentMethod === 'cod') { handleCOD(); return; }
    setLoading(true);
    try {
      const orderData = { items: cartFoods, amount: total, address, paymentMethod: 'razorpay' };
      const order = await API.post('/order/place', orderData);
      const { data: payData } = await API.post('/payment/create-order', { amount: total });

      const options = {
        key: payData.key,
        amount: payData.amount,
        currency: payData.currency,
        name: 'FoodRush',
        description: 'Food Order Payment',
        order_id: payData.orderId,
        handler: async (response) => {
          try {
            await API.post('/payment/verify', { ...response, orderId: order.data._id });
            await API.post('/cart/clear');
            setCartItems({});
            toast.success('Order placed successfully! 🎉');
            navigate('/orders');
          } catch {
            toast.error('Payment done but verification failed. Contact support.');
          }
        },
        prefill: { name: `${address.firstName} ${address.lastName}`, contact: address.phone },
        theme: { color: '#ff6b35' }
      };
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', () => toast.error('Payment failed. Please try again.'));
      rzp.open();
    } catch (err) {
      console.error('Payment error:', err);
      toast.error(err?.response?.data?.message || 'Payment failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Checkout</h1>
      <div className="checkout-layout" style={styles.layout}>
        <form onSubmit={handlePayment} style={styles.form}>
          <h2 style={styles.sectionTitle}>📍 Delivery Address</h2>
          <div style={styles.row}>
            {[['firstName', 'First Name'], ['lastName', 'Last Name']].map(([k, l]) => (
              <div key={k} style={styles.field}>
                <label style={styles.label}>{l}</label>
                <input value={address[k]} onChange={e => setAddress({ ...address, [k]: e.target.value })} style={styles.input} required placeholder={l} />
              </div>
            ))}
          </div>
          {[['street', 'Street Address', 'Enter your street address'], ['city', 'City', 'Your city'], ['state', 'State', 'Your state'], ['zip', 'PIN Code', '6-digit PIN'], ['phone', 'Phone Number', '+91 XXXXX XXXXX']].map(([k, l, p]) => (
            <div key={k} style={styles.field}>
              <label style={styles.label}>{l}</label>
              <input value={address[k]} onChange={e => setAddress({ ...address, [k]: e.target.value })} style={styles.input} required placeholder={p} />
            </div>
          ))}

          <h2 style={styles.sectionTitle}>💳 Payment Method</h2>
          <div style={styles.paymentOptions}>
            <div onClick={() => setPaymentMethod('razorpay')} style={{ ...styles.payOption, ...(paymentMethod === 'razorpay' ? styles.payOptionActive : {}) }}>
              <span style={styles.radio}>{paymentMethod === 'razorpay' ? '🔵' : '⚪'}</span>
              <span>💳 Pay Online (Razorpay)</span>
            </div>
            <div onClick={() => setPaymentMethod('cod')} style={{ ...styles.payOption, ...(paymentMethod === 'cod' ? styles.payOptionActive : {}) }}>
              <span style={styles.radio}>{paymentMethod === 'cod' ? '🔵' : '⚪'}</span>
              <span>💵 Cash on Delivery</span>
            </div>
          </div>

          <button type="submit" disabled={loading} style={styles.payBtn}>
            {loading ? 'Processing...' : paymentMethod === 'cod' ? `Place Order ₹${total} (Pay on Delivery)` : `Pay ₹${total} via Razorpay 🔒`}
          </button>
        </form>

        <div className="checkout-summary" style={styles.summary}>
          <h2 style={styles.sectionTitle}>🛒 Order Summary</h2>
          {cartFoods.map(item => (
            <div key={item.foodId} style={styles.orderItem}>
              <span>{item.name} × {item.quantity}</span>
              <span style={{ fontWeight: '700' }}>₹{item.price * item.quantity}</span>
            </div>
          ))}
          <div style={styles.divider} />
          <div style={styles.orderItem}><span>Subtotal</span><span>₹{subtotal}</span></div>
          <div style={styles.orderItem}><span>Delivery</span><span>₹40</span></div>
          <div style={{ ...styles.orderItem, fontWeight: '800', fontSize: '18px', color: '#ff6b35' }}>
            <span>Total</span><span>₹{total}</span>
          </div>
          <div style={styles.secure}>
            {paymentMethod === 'cod' ? '🛵 Cash on Delivery' : '🔒 Secured by Razorpay'}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '40px 5%', maxWidth: '1100px', margin: '0 auto' },
  title: { fontSize: '28px', fontWeight: '800', marginBottom: '30px', color: '#222' },
  layout: { display: 'grid', gridTemplateColumns: '1fr 380px', gap: '30px' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  sectionTitle: { fontSize: '20px', fontWeight: '800', color: '#222', marginBottom: '5px' },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', fontWeight: '600', color: '#555' },
  input: { padding: '12px 16px', border: '2px solid #f0f0f0', borderRadius: '12px', fontSize: '15px', outline: 'none', boxSizing: 'border-box' },
  paymentOptions: { display: 'flex', flexDirection: 'column', gap: '10px' },
  payOption: { display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', border: '2px solid #f0f0f0', borderRadius: '12px', cursor: 'pointer', fontSize: '15px', fontWeight: '600', color: '#444' },
  payOptionActive: { border: '2px solid #ff6b35', background: '#fff5f0', color: '#ff6b35' },
  radio: { fontSize: '16px' },
  payBtn: { background: 'linear-gradient(135deg, #ff6b35, #f7931e)', color: '#fff', border: 'none', padding: '16px', borderRadius: '12px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', marginTop: '10px' },
  summary: { background: '#fff', borderRadius: '20px', padding: '25px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', height: 'fit-content', position: 'sticky', top: '90px' },
  orderItem: { display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '15px', color: '#555' },
  divider: { borderTop: '2px solid #f0f0f0', margin: '15px 0' },
  secure: { textAlign: 'center', marginTop: '15px', fontSize: '13px', color: '#888', background: '#f9f9f9', padding: '10px', borderRadius: '8px' }
};

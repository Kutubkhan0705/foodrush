import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import API from '../utils/api';
import { io } from 'socket.io-client';
import { FaBox, FaMotorcycle, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const statusConfig = {
  'Food Processing': { icon: <FaBox />, color: '#f59e0b', bg: '#fffbeb' },
  'Out for Delivery': { icon: <FaMotorcycle />, color: '#3b82f6', bg: '#eff6ff' },
  'Delivered': { icon: <FaCheckCircle />, color: '#22c55e', bg: '#f0fdf4' },
  'Cancelled': { icon: <FaTimesCircle />, color: '#ef4444', bg: '#fef2f2' }
};

export default function Orders() {
  const { user } = useApp();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    API.get('/order/myorders').then(({ data }) => { setOrders(data); setLoading(false); });

    const socket = io(SOCKET_URL);
    socket.on('order-updated', ({ orderId, status, payment }) => {
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status, payment } : o));
    });
    return () => socket.disconnect();
  }, [user]);

  if (!user) return <div style={styles.center}><h2>Please <a href="/login" style={{ color: '#ff6b35' }}>login</a> to view orders</h2></div>;
  if (loading) return <div style={styles.center}><div style={styles.spinner} /></div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📦 My Orders</h1>
      {orders.length === 0 ? (
        <div style={styles.empty}>
          <FaBox size={60} color="#ddd" />
          <h3 style={{ color: '#888', marginTop: '15px' }}>No orders yet</h3>
          <a href="/" style={styles.orderBtn}>Order Now</a>
        </div>
      ) : (
        <div style={styles.list}>
          {orders.map(order => {
            const cfg = statusConfig[order.status] || statusConfig['Food Processing'];
            return (
              <div key={order._id} style={styles.card}>
                <div className="order-card-header" style={styles.cardHeader}>
                  <div>
                    <p style={styles.orderId}>Order #{order._id.slice(-8).toUpperCase()}</p>
                    <p style={styles.date}>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                  <div style={{ ...styles.statusBadge, background: cfg.bg, color: cfg.color }}>
                    {cfg.icon} <span>{order.status}</span>
                  </div>
                </div>
                <div style={styles.items}>
                  {order.items.map((item, i) => (
                    <div key={i} style={styles.item}>
                      <img src={item.image?.startsWith('http') ? item.image : `http://localhost:5000/uploads/${item.image}`} alt={item.name} style={styles.img} onError={e => e.target.src = 'https://via.placeholder.com/50?text=F'} />
                      <span style={styles.itemName}>{item.name}</span>
                      <span style={styles.itemQty}>× {item.quantity}</span>
                      <span style={styles.itemPrice}>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div style={styles.cardFooter}>
                  <span style={{ color: '#888', fontSize: '14px' }}>Payment: <strong style={{ color: order.payment ? '#22c55e' : '#ef4444' }}>{order.payment ? 'Paid ✓' : 'Pending'}</strong></span>
                  <span style={styles.total}>Total: ₹{order.amount}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: '40px 5%', maxWidth: '900px', margin: '0 auto' },
  title: { fontSize: '28px', fontWeight: '800', marginBottom: '30px', color: '#222' },
  list: { display: 'flex', flexDirection: 'column', gap: '20px' },
  card: { background: '#fff', borderRadius: '20px', padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.07)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' },
  orderId: { fontWeight: '700', fontSize: '16px', color: '#222', margin: '0 0 4px' },
  date: { fontSize: '13px', color: '#888', margin: 0 },
  statusBadge: { display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' },
  items: { display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid #f0f0f0', paddingTop: '15px' },
  item: { display: 'flex', alignItems: 'center', gap: '12px' },
  img: { width: '50px', height: '50px', borderRadius: '10px', objectFit: 'cover' },
  itemName: { flex: 1, fontSize: '14px', fontWeight: '600', color: '#333' },
  itemQty: { fontSize: '13px', color: '#888' },
  itemPrice: { fontWeight: '700', color: '#ff6b35' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f0f0f0', paddingTop: '15px', marginTop: '15px' },
  total: { fontWeight: '800', fontSize: '18px', color: '#222' },
  center: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' },
  spinner: { width: '40px', height: '40px', border: '4px solid #f0f0f0', borderTop: '4px solid #ff6b35', borderRadius: '50%', animation: 'spin 1s linear infinite' },
  empty: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px' },
  orderBtn: { background: '#ff6b35', color: '#fff', padding: '12px 30px', borderRadius: '25px', textDecoration: 'none', marginTop: '15px', fontWeight: '600' }
};

import { useEffect, useState } from 'react';
import API from '../utils/api';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
const statuses = ['Food Processing', 'Out for Delivery', 'Delivered', 'Cancelled'];
const statusColors = { 'Food Processing': '#f59e0b', 'Out for Delivery': '#3b82f6', 'Delivered': '#22c55e', 'Cancelled': '#ef4444' };

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    API.get('/order/all').then(({ data }) => { setOrders(data); setLoading(false); }).catch(() => setLoading(false));

    const socket = io(SOCKET_URL);
    socket.emit('join-admin');
    socket.on('new-order', (order) => {
      setOrders(prev => [order, ...prev]);
      toast.success('🛎️ New order received!');
    });
    return () => socket.disconnect();
  }, []);

  const updateStatus = async (id, status) => {
    await API.put(`/order/status/${id}`, { status });
    setOrders(orders.map(o => o._id === id ? { ...o, status } : o));
    toast.success('Order status updated');
  };

  const filtered = filter === 'All' ? orders : orders.filter(o => o.status === filter);

  if (loading) return <div style={styles.center}><div style={styles.spinner} /></div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Orders Management</h1>
        <span style={styles.count}>{orders.length} total orders</span>
      </div>

      <div style={styles.filters}>
        {['All', ...statuses].map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{ ...styles.filterBtn, ...(filter === s ? styles.filterActive : {}) }}>{s}</button>
        ))}
      </div>

      <div style={styles.list}>
        {filtered.map(order => (
          <div key={order._id} style={styles.card}>
            <div style={styles.cardTop}>
              <div>
                <p style={styles.orderId}>#{order._id.slice(-8).toUpperCase()}</p>
                <p style={styles.customer}>{order.userId?.name || 'Customer'} • {order.userId?.email}</p>
                <p style={styles.date}>{new Date(order.createdAt).toLocaleString('en-IN')}</p>
              </div>
              <div style={styles.right}>
                <span style={{ ...styles.statusDot, background: statusColors[order.status] || '#888' }} />
                <select value={order.status} onChange={e => updateStatus(order._id, e.target.value)} style={{ ...styles.statusSelect, color: statusColors[order.status] }}>
                  {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div style={styles.items}>
              {order.items.map((item, i) => (
                <span key={i} style={styles.itemChip}>{item.name} ×{item.quantity}</span>
              ))}
            </div>

            <div style={styles.cardBottom}>
              <div style={styles.address}>
                📍 {order.address?.street}, {order.address?.city}, {order.address?.state} - {order.address?.zip}
              </div>
              <div style={styles.amountWrap}>
                <span style={{ color: order.payment ? '#22c55e' : '#ef4444', fontSize: '13px', fontWeight: '600' }}>
                  {order.payment ? '✓ Paid' : '⏳ Pending'}
                </span>
                <span style={styles.amount}>₹{order.amount}</span>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div style={styles.empty}>No orders found</div>}
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '35px' },
  header: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' },
  title: { fontSize: '26px', fontWeight: '800', color: '#222', margin: 0 },
  count: { background: '#3b82f6', color: '#fff', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' },
  filters: { display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '25px' },
  filterBtn: { padding: '8px 16px', border: '2px solid #f0f0f0', borderRadius: '25px', background: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: '600', color: '#555' },
  filterActive: { background: '#ff6b35', color: '#fff', border: '2px solid #ff6b35' },
  list: { display: 'flex', flexDirection: 'column', gap: '16px' },
  card: { background: '#fff', borderRadius: '18px', padding: '20px', boxShadow: '0 2px 15px rgba(0,0,0,0.06)' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' },
  orderId: { fontWeight: '800', fontSize: '16px', color: '#222', margin: '0 0 3px' },
  customer: { fontSize: '13px', color: '#555', margin: '0 0 3px' },
  date: { fontSize: '12px', color: '#aaa', margin: 0 },
  right: { display: 'flex', alignItems: 'center', gap: '8px' },
  statusDot: { width: '10px', height: '10px', borderRadius: '50%', flexShrink: 0 },
  statusSelect: { padding: '7px 12px', border: '2px solid #f0f0f0', borderRadius: '10px', fontSize: '13px', fontWeight: '600', outline: 'none', cursor: 'pointer' },
  items: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' },
  itemChip: { background: '#f5f5f5', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', color: '#555', fontWeight: '500' },
  cardBottom: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f5f5f5', paddingTop: '12px' },
  address: { fontSize: '13px', color: '#888', flex: 1 },
  amountWrap: { display: 'flex', alignItems: 'center', gap: '12px' },
  amount: { fontWeight: '800', fontSize: '18px', color: '#222' },
  center: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' },
  spinner: { width: '40px', height: '40px', border: '4px solid #f0f0f0', borderTop: '4px solid #ff6b35', borderRadius: '50%', animation: 'spin 1s linear infinite' },
  empty: { textAlign: 'center', padding: '40px', color: '#888' }
};

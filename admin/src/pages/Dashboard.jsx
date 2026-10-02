import { useEffect, useState } from 'react';
import API from '../utils/api';
import { MdFastfood, MdListAlt, MdAttachMoney, MdPeople } from 'react-icons/md';

export default function Dashboard() {
  const [stats, setStats] = useState({ foods: 0, orders: 0, revenue: 0, pending: 0 });

  useEffect(() => {
    Promise.all([API.get('/food'), API.get('/order/all')]).then(([foodRes, orderRes]) => {
      const orders = orderRes.data;
      setStats({
        foods: foodRes.data.length,
        orders: orders.length,
        revenue: orders.filter(o => o.payment).reduce((s, o) => s + o.amount, 0),
        pending: orders.filter(o => o.status === 'Food Processing').length
      });
    }).catch(() => {});
  }, []);

  const cards = [
    { icon: <MdFastfood size={28} />, label: 'Total Foods', value: stats.foods, color: '#ff6b35', bg: '#fff5f0' },
    { icon: <MdListAlt size={28} />, label: 'Total Orders', value: stats.orders, color: '#3b82f6', bg: '#eff6ff' },
    { icon: <MdAttachMoney size={28} />, label: 'Revenue', value: `₹${stats.revenue}`, color: '#22c55e', bg: '#f0fdf4' },
    { icon: <MdPeople size={28} />, label: 'Pending Orders', value: stats.pending, color: '#f59e0b', bg: '#fffbeb' },
  ];

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Dashboard</h1>
      <p style={styles.sub}>Welcome back, Admin! Here's what's happening today.</p>
      <div style={styles.grid}>
        {cards.map(c => (
          <div key={c.label} style={{ ...styles.card, background: c.bg }}>
            <div style={{ ...styles.iconWrap, color: c.color }}>{c.icon}</div>
            <div>
              <p style={styles.cardLabel}>{c.label}</p>
              <p style={{ ...styles.cardValue, color: c.color }}>{c.value}</p>
            </div>
          </div>
        ))}
      </div>
      <div style={styles.info}>
        <h2 style={styles.infoTitle}>Quick Actions</h2>
        <div style={styles.actions}>
          <a href="/add-food" style={styles.actionBtn}>+ Add New Food Item</a>
          <a href="/orders" style={styles.actionBtn2}>View All Orders</a>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '35px' },
  title: { fontSize: '28px', fontWeight: '800', color: '#222', marginBottom: '5px' },
  sub: { color: '#888', fontSize: '15px', marginBottom: '30px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '35px' },
  card: { borderRadius: '20px', padding: '25px', display: 'flex', alignItems: 'center', gap: '18px' },
  iconWrap: { padding: '12px', background: '#fff', borderRadius: '14px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' },
  cardLabel: { fontSize: '13px', color: '#888', margin: '0 0 5px', fontWeight: '500' },
  cardValue: { fontSize: '26px', fontWeight: '800', margin: 0 },
  info: { background: '#fff', borderRadius: '20px', padding: '25px', boxShadow: '0 2px 15px rgba(0,0,0,0.06)' },
  infoTitle: { fontSize: '18px', fontWeight: '700', marginBottom: '15px', color: '#222' },
  actions: { display: 'flex', gap: '15px', flexWrap: 'wrap' },
  actionBtn: { background: '#ff6b35', color: '#fff', padding: '12px 24px', borderRadius: '12px', textDecoration: 'none', fontWeight: '600', fontSize: '14px' },
  actionBtn2: { background: '#f0f0f0', color: '#333', padding: '12px 24px', borderRadius: '12px', textDecoration: 'none', fontWeight: '600', fontSize: '14px' }
};

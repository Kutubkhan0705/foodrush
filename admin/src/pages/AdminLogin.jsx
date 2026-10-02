import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';
import toast from 'react-hot-toast';
import { MdDeliveryDining } from 'react-icons/md';

export default function AdminLogin({ setToken }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post('/auth/login', form);
      if (data.user.role !== 'admin') { toast.error('Admin access required'); return; }
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUser', JSON.stringify(data.user));
      setToken(data.token);
      toast.success('Welcome Admin!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <MdDeliveryDining size={52} color="#ff6b35" />
          <h1 style={styles.title}>Admin Panel</h1>
          <p style={styles.sub}>FoodRush Management System</p>
        </div>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="admin@foodrush.com" style={styles.input} required />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Enter password" style={styles.input} required />
          </div>
          <button type="submit" disabled={loading} style={styles.btn}>{loading ? 'Signing in...' : 'Sign In to Admin'}</button>
        </form>
        <div style={styles.hint}>
          <p style={{ fontSize: '12px', color: '#aaa' }}>First time? Register an admin user via API or MongoDB</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1a1a2e, #16213e)', padding: '20px' },
  card: { background: '#fff', borderRadius: '24px', padding: '45px', width: '100%', maxWidth: '400px', boxShadow: '0 30px 80px rgba(0,0,0,0.4)' },
  header: { textAlign: 'center', marginBottom: '35px' },
  title: { fontSize: '28px', fontWeight: '800', color: '#222', margin: '10px 0 5px' },
  sub: { color: '#888', fontSize: '14px' },
  form: { display: 'flex', flexDirection: 'column', gap: '18px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', fontWeight: '600', color: '#555' },
  input: { padding: '12px 16px', border: '2px solid #f0f0f0', borderRadius: '12px', fontSize: '15px', outline: 'none', boxSizing: 'border-box' },
  btn: { background: 'linear-gradient(135deg, #ff6b35, #f7931e)', color: '#fff', border: 'none', padding: '14px', borderRadius: '12px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', marginTop: '5px' },
  hint: { marginTop: '20px', textAlign: 'center' }
};

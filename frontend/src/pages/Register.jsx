import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { MdDeliveryDining } from 'react-icons/md';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const { register, loading } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    try {
      await register(form.name, form.email, form.password);
      navigate('/');
    } catch {}
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <MdDeliveryDining size={48} color="#ff6b35" />
          <h1 style={styles.title}>Join FoodRush!</h1>
          <p style={styles.sub}>Create your account and start ordering</p>
        </div>
        <form onSubmit={handleSubmit} style={styles.form}>
          {[
            { key: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe' },
            { key: 'email', label: 'Email Address', type: 'email', placeholder: 'you@example.com' },
            { key: 'password', label: 'Password', type: 'password', placeholder: 'Min 6 characters' },
            { key: 'confirm', label: 'Confirm Password', type: 'password', placeholder: 'Repeat password' }
          ].map(f => (
            <div key={f.key} style={styles.field}>
              <label style={styles.label}>{f.label}</label>
              <input type={f.type} value={form[f.key]} onChange={e => { setForm({ ...form, [f.key]: e.target.value }); setError(''); }} placeholder={f.placeholder} style={styles.input} required />
            </div>
          ))}
          {error && <p style={styles.error}>{error}</p>}
          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? 'Creating Account...' : 'Create Account 🎉'}
          </button>
        </form>
        <p style={styles.switch}>Already have an account? <Link to="/login" style={styles.switchLink}>Sign in</Link></p>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #fff5f0, #fff)', padding: '20px' },
  card: { background: '#fff', borderRadius: '24px', padding: '40px', width: '100%', maxWidth: '420px', boxShadow: '0 20px 60px rgba(255,107,53,0.15)' },
  header: { textAlign: 'center', marginBottom: '30px' },
  title: { fontSize: '28px', fontWeight: '800', color: '#222', margin: '10px 0 5px' },
  sub: { color: '#888', fontSize: '14px' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '14px', fontWeight: '600', color: '#444' },
  input: { padding: '12px 16px', border: '2px solid #f0f0f0', borderRadius: '12px', fontSize: '15px', outline: 'none', boxSizing: 'border-box' },
  error: { color: '#e74c3c', fontSize: '13px', textAlign: 'center', background: '#ffeaea', padding: '8px', borderRadius: '8px' },
  btn: { background: 'linear-gradient(135deg, #ff6b35, #f7931e)', color: '#fff', border: 'none', padding: '14px', borderRadius: '12px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', marginTop: '5px' },
  switch: { textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#666' },
  switchLink: { color: '#ff6b35', fontWeight: '600', textDecoration: 'none' }
};

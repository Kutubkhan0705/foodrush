import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { MdDeliveryDining } from 'react-icons/md';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const { login, loading } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(form.email, form.password);
      navigate(data.user.role === 'admin' ? '/admin' : '/');
    } catch {}
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <MdDeliveryDining size={48} color="#ff6b35" />
          <h1 style={styles.title}>Welcome Back!</h1>
          <p style={styles.sub}>Sign in to your FoodRush account</p>
        </div>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email Address</label>
            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" style={styles.input} required />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <div style={styles.passWrap}>
              <input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Enter your password" style={{ ...styles.input, paddingRight: '45px' }} required />
              <button type="button" onClick={() => setShowPass(!showPass)} style={styles.eyeBtn}>
                {showPass ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? 'Signing in...' : 'Sign In 🚀'}
          </button>
        </form>
        <p style={styles.switch}>Don't have an account? <Link to="/register" style={styles.switchLink}>Create one</Link></p>
        <div style={styles.demo}>
          <p style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>Demo Admin: admin@foodrush.com / admin123</p>
        </div>
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
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '14px', fontWeight: '600', color: '#444' },
  input: { padding: '12px 16px', border: '2px solid #f0f0f0', borderRadius: '12px', fontSize: '15px', outline: 'none', transition: 'border 0.2s', width: '100%', boxSizing: 'border-box' },
  passWrap: { position: 'relative' },
  eyeBtn: { position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#888' },
  btn: { background: 'linear-gradient(135deg, #ff6b35, #f7931e)', color: '#fff', border: 'none', padding: '14px', borderRadius: '12px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', marginTop: '5px' },
  switch: { textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#666' },
  switchLink: { color: '#ff6b35', fontWeight: '600', textDecoration: 'none' },
  demo: { marginTop: '15px', padding: '12px', background: '#f9f9f9', borderRadius: '10px', textAlign: 'center' }
};

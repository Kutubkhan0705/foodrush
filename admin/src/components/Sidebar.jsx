import { NavLink, useNavigate } from 'react-router-dom';
import { MdDeliveryDining, MdDashboard, MdFastfood, MdListAlt, MdLogout } from 'react-icons/md';

export default function Sidebar({ setToken }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setToken('');
    window.location.href = 'http://localhost:5173';
  };

  const links = [
    { to: '/dashboard', icon: <MdDashboard size={20} />, label: 'Dashboard' },
    { to: '/add-food', icon: <MdFastfood size={20} />, label: 'Add Food' },
    { to: '/food-list', icon: <MdListAlt size={20} />, label: 'Food List' },
    { to: '/orders', icon: <MdListAlt size={20} />, label: 'Orders' },
  ];

  return (
    <div style={styles.sidebar}>
      <div style={styles.logo}>
        <MdDeliveryDining size={30} color="#ff6b35" />
        <span style={styles.logoText}>FoodRush</span>
        <span style={styles.adminBadge}>Admin</span>
      </div>
      <nav style={styles.nav}>
        {links.map(l => (
          <NavLink key={l.to} to={l.to} style={({ isActive }) => ({ ...styles.link, ...(isActive ? styles.activeLink : {}) })}>
            {l.icon} {l.label}
          </NavLink>
        ))}
      </nav>
      <button onClick={logout} style={styles.logoutBtn}><MdLogout size={18} /> Logout</button>
    </div>
  );
}

const styles = {
  sidebar: { width: '240px', minHeight: '100vh', background: '#1a1a2e', display: 'flex', flexDirection: 'column', padding: '20px 0', position: 'fixed', left: 0, top: 0 },
  logo: { display: 'flex', alignItems: 'center', gap: '8px', padding: '0 20px 25px', borderBottom: '1px solid #2a2a4e' },
  logoText: { fontSize: '18px', fontWeight: '800', color: '#fff' },
  adminBadge: { background: '#ff6b35', color: '#fff', fontSize: '10px', padding: '2px 8px', borderRadius: '10px', fontWeight: '700' },
  nav: { display: 'flex', flexDirection: 'column', gap: '4px', padding: '20px 12px', flex: 1 },
  link: { display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', borderRadius: '12px', color: '#aaa', textDecoration: 'none', fontSize: '14px', fontWeight: '500', transition: 'all 0.2s' },
  activeLink: { background: '#ff6b35', color: '#fff' },
  logoutBtn: { display: 'flex', alignItems: 'center', gap: '8px', margin: '0 12px', padding: '12px 16px', background: 'transparent', border: '1px solid #2a2a4e', borderRadius: '12px', color: '#aaa', cursor: 'pointer', fontSize: '14px' }
};

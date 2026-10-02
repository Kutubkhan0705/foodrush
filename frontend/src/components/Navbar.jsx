import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { FaShoppingCart, FaUser, FaBars, FaTimes, FaSignOutAlt } from 'react-icons/fa';
import { MdDeliveryDining } from 'react-icons/md';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout, getCartCount } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>
        <MdDeliveryDining size={34} color="#ff6b35" />
        <span style={styles.logoText}>Food<span style={{ color: '#ff6b35' }}>Rush</span></span>
      </Link>

      <div className="nav-links" style={styles.links}>
        {[['/', 'Home'], ['/menu', 'Menu'], ['/orders', 'Orders']].map(([path, label]) => (
          <Link key={path} to={path} style={{ ...styles.link, ...(isActive(path) ? styles.activeLink : {}) }}>
            {label}
            {isActive(path) && <div style={styles.activeDot} />}
          </Link>
        ))}
        {user?.role === 'admin' && (
          <Link to="/admin" style={{ ...styles.link, color: '#ff6b35' }}>⚙️ Admin</Link>
        )}
      </div>

      <div style={styles.actions}>
        <Link to="/cart" style={styles.cartBtn}>
          <FaShoppingCart size={19} color="#333" />
          {getCartCount() > 0 && <span style={styles.badge}>{getCartCount()}</span>}
        </Link>

        {user ? (
          <div style={{ position: 'relative' }}>
            <button onClick={() => setDropOpen(!dropOpen)} style={styles.userBtn}>
              <div style={styles.userAvatar}>{user.name[0].toUpperCase()}</div>
              <span style={styles.userName}>{user.name.split(' ')[0]}</span>
            </button>
            {dropOpen && (
              <div style={styles.dropdown}>
                <div style={styles.dropHeader}>
                  <strong style={{ color: '#222', fontSize: '14px' }}>{user.name}</strong>
                  <p style={{ color: '#888', fontSize: '12px', margin: '2px 0 0' }}>{user.email}</p>
                </div>
                <div style={styles.dropDivider} />
                <button onClick={() => { navigate('/orders'); setDropOpen(false); }} style={styles.dropItem}>📦 My Orders</button>
                <button onClick={() => { logout(); setDropOpen(false); }} style={{ ...styles.dropItem, color: '#ef4444' }}>
                  <FaSignOutAlt size={13} /> Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div style={styles.authBtns}>
            <button onClick={() => navigate('/login')} style={styles.loginBtn}>Login</button>
            <button onClick={() => navigate('/register')} style={styles.registerBtn}>Sign Up</button>
          </div>
        )}
      </div>

      <button className="nav-hamburger" style={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {menuOpen && (
        <div style={styles.mobileMenu}>
          {[['/', 'Home'], ['/menu', 'Menu'], ['/orders', 'Orders'], ['/cart', `Cart (${getCartCount()})`]].map(([path, label]) => (
            <Link key={path} to={path} style={styles.mobileLink} onClick={() => setMenuOpen(false)}>{label}</Link>
          ))}
          {!user ? (
            <div style={{ display: 'flex', gap: '10px', padding: '10px 0' }}>
              <button onClick={() => { navigate('/login'); setMenuOpen(false); }} style={styles.loginBtn}>Login</button>
              <button onClick={() => { navigate('/register'); setMenuOpen(false); }} style={styles.registerBtn}>Sign Up</button>
            </div>
          ) : (
            <button onClick={() => { logout(); setMenuOpen(false); }} style={{ ...styles.mobileLink, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>Logout</button>
          )}
        </div>
      )}
    </nav>
  );
}

const styles = {
  nav: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 6%', height: '68px', background: '#fff', boxShadow: '0 2px 20px rgba(0,0,0,0.07)', position: 'sticky', top: 0, zIndex: 1000 },
  logo: { display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' },
  logoText: { fontSize: '22px', fontWeight: '900', color: '#222', letterSpacing: '-0.5px' },
  links: { display: 'flex', gap: '8px', alignItems: 'center' },
  link: { textDecoration: 'none', color: '#555', fontWeight: '600', fontSize: '14px', padding: '6px 14px', borderRadius: '10px', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', transition: 'all 0.2s' },
  activeLink: { color: '#ff6b35', background: '#fff5f0' },
  activeDot: { width: '5px', height: '5px', background: '#ff6b35', borderRadius: '50%' },
  actions: { display: 'flex', alignItems: 'center', gap: '12px' },
  cartBtn: { position: 'relative', color: '#333', textDecoration: 'none', padding: '8px 10px', background: '#f5f5f5', borderRadius: '12px', display: 'flex', alignItems: 'center' },
  badge: { position: 'absolute', top: '-4px', right: '-4px', background: '#ff6b35', color: '#fff', borderRadius: '50%', width: '18px', height: '18px', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' },
  userBtn: { display: 'flex', alignItems: 'center', gap: '8px', background: '#f5f5f5', border: 'none', padding: '6px 14px 6px 6px', borderRadius: '30px', cursor: 'pointer' },
  userAvatar: { width: '30px', height: '30px', background: 'linear-gradient(135deg, #ff6b35, #f7931e)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '800', fontSize: '13px' },
  userName: { fontSize: '13px', fontWeight: '700', color: '#333' },
  dropdown: { position: 'absolute', top: '45px', right: 0, background: '#fff', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.12)', minWidth: '200px', overflow: 'hidden', zIndex: 100 },
  dropHeader: { padding: '15px 16px' },
  dropDivider: { height: '1px', background: '#f0f0f0' },
  dropItem: { display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: '#333', fontWeight: '500', textAlign: 'left' },
  authBtns: { display: 'flex', gap: '8px' },
  loginBtn: { background: 'transparent', color: '#ff6b35', border: '2px solid #ff6b35', padding: '7px 18px', borderRadius: '25px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' },
  registerBtn: { background: 'linear-gradient(135deg, #ff6b35, #f7931e)', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '25px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' },
  hamburger: { display: 'flex', background: 'none', border: 'none', cursor: 'pointer', color: '#333' },
  mobileMenu: { position: 'absolute', top: '68px', left: 0, right: 0, background: '#fff', padding: '15px 6%', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', gap: '5px' },
  mobileLink: { textDecoration: 'none', color: '#333', fontWeight: '600', fontSize: '15px', padding: '12px 0', borderBottom: '1px solid #f5f5f5' },
};

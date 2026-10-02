import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useState } from 'react';
import FoodCard from '../components/FoodCard';
import { MdDeliveryDining } from 'react-icons/md';
import { FaSearch, FaPhone, FaEnvelope, FaInstagram, FaTwitter, FaFacebook, FaStar, FaArrowRight } from 'react-icons/fa';

const categories = ['All', 'Burger', 'Pizza', 'Biryani', 'Chinese', 'South Indian', 'Dessert', 'Ice Cream', 'Drinks', 'Sandwich', 'Pasta', 'Rolls'];
const categoryEmojis = { All: '🍽️', Burger: '🍔', Pizza: '🍕', Biryani: '🍛', Chinese: '🥡', 'South Indian': '🥘', Dessert: '🍰', 'Ice Cream': '🍦', Drinks: '🥤', Sandwich: '🥪', Pasta: '🍝', Rolls: '🌯' };

export default function Home() {
  const { foods, fetchFoods } = useApp();
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleCategory = (cat) => { setActiveCategory(cat); fetchFoods(cat === 'All' ? '' : cat); };
  const filtered = foods.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif" }}>

      {/* ───── HERO ───── */}
      <div style={styles.hero}>
        <div style={styles.heroOverlay} />
        <div style={styles.heroContent}>
          <div style={styles.heroBadge}>
            <MdDeliveryDining size={16} /> &nbsp;Free delivery on first order 🎉
          </div>
          <h1 style={styles.heroTitle}>
            Hungry? <br />
            <span style={styles.heroHighlight}>We've Got You!</span>
          </h1>
          <p style={styles.heroSub}>
            Fresh, hot & delicious food delivered to your door in 30 minutes. 
            Over 500+ dishes from top restaurants.
          </p>
          <div style={styles.searchBox}>
            <FaSearch color="#ff6b35" size={16} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search burgers, pizza, biryani..."
              style={styles.searchInput}
            />
            <button onClick={() => navigate('/menu')} style={styles.searchBtn}>
              Search <FaArrowRight size={12} />
            </button>
          </div>
          <div className="hero-stats" style={styles.heroStats}>
            {[['500+', 'Dishes'], ['30 min', 'Delivery'], ['4.9★', 'Rating'], ['50K+', 'Orders']].map(([v, l]) => (
              <div key={l} style={styles.heroStat}>
                <strong style={styles.heroStatVal}>{v}</strong>
                <span style={styles.heroStatLabel}>{l}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="hero-img-wrap" style={styles.heroImgWrap}>
          <div style={styles.heroImgGlow} />
          <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600" alt="food" style={styles.heroImg} />
          <div style={styles.floatCard1}>🍔 Burger<br /><span style={{ color: '#ff6b35', fontWeight: 800 }}>₹149</span></div>
          <div style={styles.floatCard2}>⏱ 20 min<br /><span style={{ fontSize: '11px', color: '#888' }}>Avg delivery</span></div>
        </div>
      </div>

      {/* ───── CATEGORIES ───── */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <div>
            <h2 style={styles.sectionTitle}>What's on your mind? 🤤</h2>
            <p style={styles.sectionSub}>Choose from our wide variety of categories</p>
          </div>
        </div>
        <div style={styles.catGrid}>
          {categories.map(cat => (
            <button key={cat} onClick={() => handleCategory(cat)}
              style={{ ...styles.catBtn, ...(activeCategory === cat ? styles.catBtnActive : {}) }}>
              <span style={styles.catEmoji}>{categoryEmojis[cat]}</span>
              <span style={styles.catLabel}>{cat}</span>
              {activeCategory === cat && <div style={styles.catActiveDot} />}
            </button>
          ))}
        </div>
      </div>

      {/* ───── FOOD GRID ───── */}
      <div style={{ ...styles.section, background: '#fafafa', paddingTop: '40px', paddingBottom: '60px' }}>
        <div style={styles.sectionHeader}>
          <div>
            <h2 style={styles.sectionTitle}>
              {activeCategory === 'All' ? '🔥 Popular Near You' : `${categoryEmojis[activeCategory]} ${activeCategory}`}
            </h2>
            <p style={styles.sectionSub}>{filtered.length} delicious items available</p>
          </div>
          <button onClick={() => navigate('/menu')} style={styles.viewAllBtn}>View All →</button>
        </div>
        {filtered.length === 0 ? (
          <div style={styles.empty}>
            <div style={{ fontSize: '60px' }}>🍽️</div>
            <h3 style={{ color: '#888', marginTop: '15px' }}>No items found</h3>
            <p style={{ color: '#aaa', fontSize: '14px' }}>Try a different category or add food from admin panel</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {filtered.slice(0, 8).map(food => <FoodCard key={food._id} food={food} />)}
          </div>
        )}
        {filtered.length > 8 && (
          <div style={{ textAlign: 'center', marginTop: '35px' }}>
            <button onClick={() => navigate('/menu')} style={styles.loadMoreBtn}>
              View All {filtered.length} Items →
            </button>
          </div>
        )}
      </div>

      {/* ───── PROMO BANNER ───── */}
      <div className="promo-banner" style={styles.promoBanner}>
        <div className="promo-left" style={styles.promoLeft}>
          <span style={styles.promoTag}>Limited Time Offer 🎁</span>
          <h2 className="promo-title" style={styles.promoTitle}>Get 20% OFF on your first order!</h2>
          <p style={styles.promoSub}>Use code <strong style={{ color: '#ff6b35', background: '#fff3ee', padding: '2px 10px', borderRadius: '6px' }}>FIRST20</strong> at checkout</p>
          <button onClick={() => navigate('/menu')} style={styles.promoBtn}>Order Now →</button>
        </div>
        <div className="promo-right" style={styles.promoRight}>
          <img src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400" alt="promo" style={styles.promoImg} />
        </div>
      </div>

      {/* ───── WHY US ───── */}
      <div style={styles.whySection}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h2 style={styles.sectionTitle}>Why Choose <span style={{ color: '#ff6b35' }}>FoodRush?</span></h2>
          <p style={styles.sectionSub}>We make food delivery simple, fast and delicious</p>
        </div>
        <div style={styles.whyGrid}>
          {[
            { icon: '⚡', title: 'Lightning Fast', desc: 'Delivery in 30 minutes or less, guaranteed', color: '#fff3ee' },
            { icon: '🍳', title: 'Fresh & Hot', desc: 'Freshly prepared with premium quality ingredients', color: '#f0fdf4' },
            { icon: '🔒', title: 'Secure Payment', desc: '100% safe payments via Razorpay encryption', color: '#eff6ff' },
            { icon: '📍', title: 'Live Tracking', desc: 'Track your order from kitchen to doorstep', color: '#fdf4ff' },
            { icon: '🎁', title: 'Daily Offers', desc: 'New deals and discounts every single day', color: '#fffbeb' },
            { icon: '💬', title: '24/7 Support', desc: 'Round the clock customer support for you', color: '#fff5f0' },
          ].map(f => (
            <div key={f.title} style={{ ...styles.whyCard, background: f.color }}>
              <div style={styles.whyIcon}>{f.icon}</div>
              <h3 style={styles.whyTitle}>{f.title}</h3>
              <p style={styles.whyDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ───── TESTIMONIALS ───── */}
      <div style={{ ...styles.section, background: '#fafafa' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={styles.sectionTitle}>What Our Customers Say ❤️</h2>
          <p style={styles.sectionSub}>Thousands of happy customers love FoodRush</p>
        </div>
        <div style={styles.testimonialGrid}>
          {[
            { name: 'Rahul Sharma', review: 'Best food delivery app! Food always arrives hot and fresh. Love the variety!', rating: 5, avatar: '👨' },
            { name: 'Priya Singh', review: 'Amazing experience! The biryani was absolutely delicious. Will order again!', rating: 5, avatar: '👩' },
            { name: 'Amit Kumar', review: 'Super fast delivery and great packaging. The burgers are to die for!', rating: 5, avatar: '🧑' },
          ].map(t => (
            <div key={t.name} style={styles.testimonialCard}>
              <div style={styles.testimonialStars}>
                {[...Array(t.rating)].map((_, i) => <FaStar key={i} color="#ffc107" size={14} />)}
              </div>
              <p style={styles.testimonialText}>"{t.review}"</p>
              <div style={styles.testimonialAuthor}>
                <span style={styles.testimonialAvatar}>{t.avatar}</span>
                <strong style={{ color: '#222', fontSize: '14px' }}>{t.name}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ───── CONTACT ───── */}
      <div style={styles.contactSection} id="contact">
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h2 style={{ ...styles.sectionTitle, color: '#fff' }}>Get In Touch 📬</h2>
          <p style={{ color: '#aaa', fontSize: '15px' }}>We'd love to hear from you!</p>
        </div>
        <div style={styles.contactGrid}>
          <div style={styles.contactCard}>
            <div style={styles.contactIcon}><FaPhone color="#ff6b35" size={22} /></div>
            <h3 style={styles.contactTitle}>Call Us</h3>
            <p style={styles.contactInfo}>+91 70811 73829</p>
            <p style={styles.contactSub}>Mon - Sun, 9am - 11pm</p>
          </div>
          <div style={styles.contactCard}>
            <div style={styles.contactIcon}><FaEnvelope color="#ff6b35" size={22} /></div>
            <h3 style={styles.contactTitle}>Email Us</h3>
            <p style={styles.contactInfo}>kutubuddinkhan07860787</p>
            <p style={styles.contactInfo}>@gmail.com</p>
            <p style={styles.contactSub}>We reply within 24 hours</p>
          </div>
          <div style={styles.contactCard}>
            <div style={styles.contactIcon}><MdDeliveryDining color="#ff6b35" size={26} /></div>
            <h3 style={styles.contactTitle}>Delivery Area</h3>
            <p style={styles.contactInfo}>Pan India 🇮🇳</p>
            <p style={styles.contactSub}>500+ cities covered</p>
          </div>
        </div>
      </div>

      {/* ───── FOOTER ───── */}
      <footer style={styles.footer}>
        <div style={styles.footerTop} className="footer-top">
          <div style={styles.footerBrand}>
            <div style={styles.footerLogo}>
              <MdDeliveryDining size={32} color="#ff6b35" />
              <span style={styles.footerLogoText}>FoodRush</span>
            </div>
            <p style={styles.footerTagline}>Delivering happiness to your doorstep, one meal at a time. 🍔</p>
            <div style={styles.socialLinks}>
              {[FaInstagram, FaTwitter, FaFacebook].map((Icon, i) => (
                <a key={i} href="#" style={styles.socialBtn}><Icon size={16} /></a>
              ))}
            </div>
          </div>
          <div>
            <h4 style={styles.footerHeading}>Quick Links</h4>
            {[['Home', '/'], ['Menu', '/menu'], ['My Orders', '/orders'], ['Cart', '/cart']].map(([l, h]) => (
              <a key={l} href={h} style={styles.footerLink}>{l}</a>
            ))}
          </div>
          <div>
            <h4 style={styles.footerHeading}>Categories</h4>
            {['Burger', 'Pizza', 'Biryani', 'Ice Cream', 'Drinks'].map(c => (
              <a key={c} href="/menu" style={styles.footerLink}>{categoryEmojis[c]} {c}</a>
            ))}
          </div>
          <div>
            <h4 style={styles.footerHeading}>Contact</h4>
            <p style={styles.footerContactItem}><FaPhone size={12} color="#ff6b35" /> &nbsp;+91 70811 73829</p>
            <p style={styles.footerContactItem}><FaEnvelope size={12} color="#ff6b35" /> &nbsp;kutubuddinkhan07860787@gmail.com</p>
            <p style={{ ...styles.footerContactItem, marginTop: '15px', color: '#666', fontSize: '12px' }}>
              📍 India 🇮🇳
            </p>
          </div>
        </div>
        <div style={styles.footerBottom} className="footer-bottom">
          <p style={styles.footerCopy}>© 2024 FoodRush. All rights reserved. Made with ❤️ in India</p>
          <div style={styles.footerBottomLinks}>
            <a href="#" style={styles.footerBottomLink}>Privacy Policy</a>
            <a href="#" style={styles.footerBottomLink}>Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  // HERO
  hero: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '70px 6%', background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)', minHeight: '580px', gap: '40px', position: 'relative', overflow: 'hidden' },
  heroOverlay: { position: 'absolute', inset: 0, background: 'radial-gradient(circle at 70% 50%, rgba(255,107,53,0.15) 0%, transparent 60%)', pointerEvents: 'none' },
  heroContent: { flex: 1, maxWidth: '560px', position: 'relative', zIndex: 1 },
  heroBadge: { display: 'inline-flex', alignItems: 'center', background: 'rgba(255,107,53,0.2)', border: '1px solid rgba(255,107,53,0.4)', color: '#ff9a6c', padding: '7px 18px', borderRadius: '30px', fontSize: '13px', fontWeight: '600', marginBottom: '22px' },
  heroTitle: { fontSize: '58px', fontWeight: '900', lineHeight: '1.1', margin: '0 0 18px', color: '#fff' },
  heroHighlight: { background: 'linear-gradient(135deg, #ff6b35, #f7931e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  heroSub: { fontSize: '16px', color: '#aaa', marginBottom: '32px', lineHeight: '1.7' },
  searchBox: { display: 'flex', alignItems: 'center', gap: '10px', background: '#fff', borderRadius: '50px', padding: '8px 8px 8px 20px', boxShadow: '0 8px 30px rgba(255,107,53,0.3)', marginBottom: '35px' },
  searchInput: { flex: 1, border: 'none', outline: 'none', fontSize: '15px', color: '#333', background: 'transparent' },
  searchBtn: { display: 'flex', alignItems: 'center', gap: '6px', background: 'linear-gradient(135deg, #ff6b35, #f7931e)', color: '#fff', border: 'none', padding: '11px 22px', borderRadius: '40px', cursor: 'pointer', fontWeight: '700', fontSize: '14px', whiteSpace: 'nowrap' },
  heroStats: { display: 'flex', gap: '25px' },
  heroStat: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  heroStatVal: { fontSize: '20px', fontWeight: '800', color: '#fff' },
  heroStatLabel: { fontSize: '12px', color: '#888', marginTop: '2px' },
  heroImgWrap: { flex: 1, display: 'flex', justifyContent: 'center', position: 'relative', maxWidth: '480px' },
  heroImgGlow: { position: 'absolute', width: '350px', height: '350px', background: 'radial-gradient(circle, rgba(255,107,53,0.4), transparent)', borderRadius: '50%', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', filter: 'blur(40px)' },
  heroImg: { width: '100%', borderRadius: '30px', boxShadow: '0 30px 80px rgba(0,0,0,0.5)', position: 'relative', zIndex: 1 },
  floatCard1: { position: 'absolute', top: '15%', left: '-10px', background: '#fff', padding: '10px 16px', borderRadius: '14px', boxShadow: '0 8px 25px rgba(0,0,0,0.15)', fontSize: '13px', fontWeight: '700', zIndex: 2, lineHeight: '1.6' },
  floatCard2: { position: 'absolute', bottom: '15%', right: '-10px', background: '#fff', padding: '10px 16px', borderRadius: '14px', boxShadow: '0 8px 25px rgba(0,0,0,0.15)', fontSize: '13px', fontWeight: '700', zIndex: 2, lineHeight: '1.6' },

  // SECTIONS
  section: { padding: '55px 6%' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '30px' },
  sectionTitle: { fontSize: '28px', fontWeight: '800', color: '#222', margin: '0 0 6px' },
  sectionSub: { fontSize: '14px', color: '#888', margin: 0 },
  viewAllBtn: { background: 'transparent', border: '2px solid #ff6b35', color: '#ff6b35', padding: '8px 20px', borderRadius: '25px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', whiteSpace: 'nowrap' },

  // CATEGORIES
  catGrid: { display: 'flex', gap: '12px', flexWrap: 'wrap' },
  catBtn: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', padding: '14px 18px', border: '2px solid #f0f0f0', borderRadius: '18px', background: '#fff', cursor: 'pointer', fontSize: '12px', fontWeight: '600', color: '#666', transition: 'all 0.2s', position: 'relative', minWidth: '75px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' },
  catBtnActive: { border: '2px solid #ff6b35', background: 'linear-gradient(135deg, #fff5f0, #fff)', color: '#ff6b35', boxShadow: '0 4px 15px rgba(255,107,53,0.2)' },
  catEmoji: { fontSize: '26px' },
  catLabel: { fontSize: '11px', fontWeight: '700' },
  catActiveDot: { position: 'absolute', bottom: '6px', width: '5px', height: '5px', background: '#ff6b35', borderRadius: '50%' },

  // FOOD GRID
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(265px, 1fr))', gap: '24px' },
  loadMoreBtn: { background: 'linear-gradient(135deg, #ff6b35, #f7931e)', color: '#fff', border: 'none', padding: '13px 35px', borderRadius: '30px', cursor: 'pointer', fontWeight: '700', fontSize: '15px' },
  empty: { textAlign: 'center', padding: '60px', color: '#888' },

  // PROMO
  promoBanner: { margin: '0 6% 0', borderRadius: '28px', background: 'linear-gradient(135deg, #1a1a2e, #16213e)', display: 'flex', alignItems: 'center', overflow: 'hidden', minHeight: '200px' },
  promoLeft: { flex: 1, padding: '40px 50px' },
  promoTag: { background: 'rgba(255,107,53,0.2)', color: '#ff9a6c', padding: '5px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' },
  promoTitle: { fontSize: '28px', fontWeight: '900', color: '#fff', margin: '12px 0 8px', lineHeight: '1.2' },
  promoSub: { color: '#aaa', fontSize: '15px', marginBottom: '20px' },
  promoBtn: { background: 'linear-gradient(135deg, #ff6b35, #f7931e)', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: '25px', cursor: 'pointer', fontWeight: '700', fontSize: '15px' },
  promoRight: { width: '280px', height: '200px', overflow: 'hidden', flexShrink: 0 },
  promoImg: { width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 },

  // WHY US
  whySection: { padding: '70px 6%', background: '#fff' },
  whyGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' },
  whyCard: { padding: '30px 25px', borderRadius: '22px', textAlign: 'center', transition: 'transform 0.2s' },
  whyIcon: { fontSize: '42px', marginBottom: '15px' },
  whyTitle: { fontSize: '17px', fontWeight: '800', color: '#222', marginBottom: '8px' },
  whyDesc: { fontSize: '13px', color: '#888', lineHeight: '1.6' },

  // TESTIMONIALS
  testimonialGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' },
  testimonialCard: { background: '#fff', borderRadius: '20px', padding: '25px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' },
  testimonialStars: { display: 'flex', gap: '3px', marginBottom: '12px' },
  testimonialText: { fontSize: '14px', color: '#555', lineHeight: '1.7', marginBottom: '18px', fontStyle: 'italic' },
  testimonialAuthor: { display: 'flex', alignItems: 'center', gap: '10px' },
  testimonialAvatar: { fontSize: '28px', background: '#f5f5f5', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' },

  // CONTACT
  contactSection: { padding: '70px 6%', background: 'linear-gradient(135deg, #0f0c29, #302b63)' },
  contactGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' },
  contactCard: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '22px', padding: '30px', textAlign: 'center', backdropFilter: 'blur(10px)' },
  contactIcon: { background: 'rgba(255,107,53,0.15)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px' },
  contactTitle: { fontSize: '17px', fontWeight: '800', color: '#fff', marginBottom: '8px' },
  contactInfo: { fontSize: '14px', color: '#ff9a6c', fontWeight: '600', margin: '3px 0' },
  contactSub: { fontSize: '12px', color: '#888', marginTop: '5px' },

  // FOOTER
  footer: { background: '#0a0a0a', padding: '60px 6% 0' },
  footerTop: { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr', gap: '40px', paddingBottom: '40px', borderBottom: '1px solid #1a1a1a' },
  footerBrand: { display: 'flex', flexDirection: 'column', gap: '12px' },
  footerLogo: { display: 'flex', alignItems: 'center', gap: '8px' },
  footerLogoText: { fontSize: '22px', fontWeight: '900', color: '#fff' },
  footerTagline: { fontSize: '13px', color: '#555', lineHeight: '1.6', maxWidth: '260px' },
  socialLinks: { display: 'flex', gap: '10px', marginTop: '5px' },
  socialBtn: { background: '#1a1a1a', color: '#888', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', transition: 'all 0.2s' },
  footerHeading: { color: '#fff', fontSize: '14px', fontWeight: '700', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' },
  footerLink: { display: 'block', color: '#555', textDecoration: 'none', fontSize: '13px', marginBottom: '10px', transition: 'color 0.2s' },
  footerContactItem: { color: '#555', fontSize: '13px', marginBottom: '10px', display: 'flex', alignItems: 'center' },
  footerBottom: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0', flexWrap: 'wrap', gap: '10px' },
  footerCopy: { color: '#333', fontSize: '13px' },
  footerBottomLinks: { display: 'flex', gap: '20px' },
  footerBottomLink: { color: '#333', textDecoration: 'none', fontSize: '13px' },
};

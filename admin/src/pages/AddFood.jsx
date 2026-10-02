import { useState } from 'react';
import API from '../utils/api';
import toast from 'react-hot-toast';

const categories = ['Burger', 'Pizza', 'Biryani', 'Chinese', 'South Indian', 'Dessert', 'Ice Cream', 'Drinks', 'Sandwich', 'Pasta', 'Rolls'];

export default function AddFood() {
  const [form, setForm] = useState({ name: '', description: '', price: '', category: 'Burger', prepTime: '20-30 min', rating: '4.0' });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) { toast.error('Please select an image'); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append('image', image);
      await API.post('/food', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Food item added successfully!');
      setForm({ name: '', description: '', price: '', category: 'Burger', prepTime: '20-30 min', rating: '4.0' });
      setImage(null); setPreview('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add food');
    } finally { setLoading(false); }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Add New Food Item</h1>
      <div style={styles.layout}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Food Name *</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Chicken Burger" style={styles.input} required />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Description *</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Describe the food item..." style={{ ...styles.input, height: '90px', resize: 'vertical' }} required />
          </div>
          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Price (₹) *</label>
              <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="199" style={styles.input} required min="1" />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Category *</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={styles.input}>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Prep Time</label>
              <input value={form.prepTime} onChange={e => setForm({ ...form, prepTime: e.target.value })} placeholder="20-30 min" style={styles.input} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Rating (1-5)</label>
              <input type="number" value={form.rating} onChange={e => setForm({ ...form, rating: e.target.value })} placeholder="4.0" style={styles.input} min="1" max="5" step="0.1" />
            </div>
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Food Image *</label>
            <label style={styles.uploadArea}>
              {preview ? <img src={preview} alt="preview" style={styles.preview} /> : <div style={styles.uploadPlaceholder}><span style={{ fontSize: '40px' }}>📷</span><p>Click to upload image</p></div>}
              <input type="file" accept="image/*" onChange={handleImage} style={{ display: 'none' }} />
            </label>
          </div>
          <button type="submit" disabled={loading} style={styles.btn}>{loading ? 'Adding...' : '+ Add Food Item'}</button>
        </form>

        <div style={styles.preview_card}>
          <h3 style={styles.previewTitle}>Preview</h3>
          <div style={styles.card}>
            {preview ? <img src={preview} alt="preview" style={styles.cardImg} /> : <div style={styles.cardImgPlaceholder}>📷 No image</div>}
            <div style={styles.cardBody}>
              <span style={styles.catTag}>{form.category}</span>
              <h3 style={styles.cardName}>{form.name || 'Food Name'}</h3>
              <p style={styles.cardDesc}>{form.description || 'Description will appear here...'}</p>
              <div style={styles.cardFooter}>
                <span style={styles.cardPrice}>₹{form.price || '0'}</span>
                <span style={styles.cardTime}>⏱ {form.prepTime}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '35px' },
  title: { fontSize: '26px', fontWeight: '800', color: '#222', marginBottom: '25px' },
  layout: { display: 'grid', gridTemplateColumns: '1fr 320px', gap: '30px' },
  form: { background: '#fff', borderRadius: '20px', padding: '25px', boxShadow: '0 2px 15px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', gap: '18px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', fontWeight: '600', color: '#555' },
  input: { padding: '11px 14px', border: '2px solid #f0f0f0', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', width: '100%' },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' },
  uploadArea: { border: '2px dashed #f0f0f0', borderRadius: '12px', cursor: 'pointer', overflow: 'hidden', display: 'block', minHeight: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  uploadPlaceholder: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: '#aaa', padding: '20px' },
  preview: { width: '100%', height: '140px', objectFit: 'cover' },
  btn: { background: 'linear-gradient(135deg, #ff6b35, #f7931e)', color: '#fff', border: 'none', padding: '14px', borderRadius: '12px', fontSize: '15px', fontWeight: '700', cursor: 'pointer' },
  preview_card: { position: 'sticky', top: '20px', height: 'fit-content' },
  previewTitle: { fontSize: '16px', fontWeight: '700', color: '#555', marginBottom: '12px' },
  card: { background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' },
  cardImg: { width: '100%', height: '160px', objectFit: 'cover' },
  cardImgPlaceholder: { height: '160px', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', fontSize: '14px' },
  cardBody: { padding: '15px' },
  catTag: { background: '#ff6b35', color: '#fff', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' },
  cardName: { margin: '8px 0 5px', fontSize: '16px', fontWeight: '700', color: '#222' },
  cardDesc: { fontSize: '12px', color: '#888', lineHeight: '1.4', marginBottom: '10px' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  cardPrice: { fontSize: '18px', fontWeight: '800', color: '#ff6b35' },
  cardTime: { fontSize: '12px', color: '#888' }
};

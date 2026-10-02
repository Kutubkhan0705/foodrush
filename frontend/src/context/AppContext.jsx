import { createContext, useContext, useState, useEffect } from 'react';
import API from '../utils/api';
import toast from 'react-hot-toast';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [cartItems, setCartItems] = useState({});
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchFoods = async (category = '') => {
    const { data } = await API.get(`/food${category ? `?category=${category}` : ''}`);
    setFoods(data);
  };

  const fetchCart = async () => {
    if (!token) return;
    const { data } = await API.get('/cart/get');
    setCartItems(data.cart);
  };

  useEffect(() => { fetchFoods(); }, []);
  useEffect(() => {
    if (token) {
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchCart();
    } else {
      delete API.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await API.post('/auth/login', { email, password });
      setUser(data.user); setToken(data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      toast.success(`Welcome back, ${data.user.name}!`);
      return data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
      throw err;
    } finally { setLoading(false); }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const { data } = await API.post('/auth/register', { name, email, password });
      setUser(data.user); setToken(data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      toast.success('Account created successfully!');
      return data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
      throw err;
    } finally { setLoading(false); }
  };

  const logout = () => {
    setUser(null); setToken(''); setCartItems({});
    localStorage.removeItem('user'); localStorage.removeItem('token');
    localStorage.removeItem('adminToken'); localStorage.removeItem('adminUser');
    toast.success('Logged out successfully');
  };

  const addToCart = async (itemId) => {
    if (!token) { toast.error('Please login to add items'); return; }
    const newCart = { ...cartItems, [itemId]: (cartItems[itemId] || 0) + 1 };
    setCartItems(newCart);
    await API.post('/cart/add', { itemId });
    toast.success('Added to cart!');
  };

  const removeFromCart = async (itemId) => {
    const newCart = { ...cartItems };
    if (newCart[itemId] > 1) newCart[itemId]--;
    else delete newCart[itemId];
    setCartItems(newCart);
    await API.post('/cart/remove', { itemId });
  };

  const getCartTotal = () => {
    return Object.entries(cartItems).reduce((total, [id, qty]) => {
      const food = foods.find(f => f._id === id);
      return total + (food ? food.price * qty : 0);
    }, 0);
  };

  const getCartCount = () => Object.values(cartItems).reduce((a, b) => a + b, 0);

  return (
    <AppContext.Provider value={{
      user, token, cartItems, foods, loading,
      login, register, logout, addToCart, removeFromCart,
      getCartTotal, getCartCount, fetchFoods, setCartItems
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);

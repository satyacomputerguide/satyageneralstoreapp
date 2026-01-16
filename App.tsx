
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import CategoryFilter from './components/CategoryFilter';
import CartDrawer from './components/CartDrawer';
import ChatBot from './components/ChatBot';
import AuthScreen from './components/AuthScreen';
import BottomNav, { AppTab } from './components/BottomNav';
import SettingsView from './components/SettingsView';
import { Product, CartItem, DeliveryDetails, User } from './types';
import { MOCK_PRODUCTS, CATEGORIES as INITIAL_CATEGORIES, STORE_NAME } from './constants';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [categories, setCategories] = useState<string[]>(INITIAL_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [adminTab, setAdminTab] = useState<'products' | 'users'>('products');
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [registeredUsers, setRegisteredUsers] = useState<User[]>([]);

  const [deliveryDetails, setDeliveryDetails] = useState<DeliveryDetails>({
    address: '',
    pincode: '',
    contact: ''
  });

  // Load session and users
  useEffect(() => {
    const savedUser = localStorage.getItem('quickcart_session');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    const users = JSON.parse(localStorage.getItem('quickcart_users') || '[]');
    setRegisteredUsers(users);
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('quickcart_session', JSON.stringify(user));
    const users = JSON.parse(localStorage.getItem('quickcart_users') || '[]');
    setRegisteredUsers(users);
    setActiveTab('home');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('quickcart_session');
    setCartItems([]);
    setIsCartOpen(false);
    setAdminTab('products');
    setActiveTab('home');
  };

  const handleTabChange = (tab: AppTab) => {
    if (tab === 'cart') {
      setIsCartOpen(true);
    } else {
      setActiveTab(tab);
      setIsCartOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const [newProduct, setNewProduct] = useState({
    name: '',
    category: INITIAL_CATEGORIES[1],
    price: '',
    unit: '',
    variant: '',
    description: ''
  });

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  // Home page featured products (just show first 4)
  const featuredProducts = products.slice(0, 4);

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;

    const product: Product = {
      id: `NEW-${Date.now()}`,
      name: newProduct.name,
      category: newProduct.category,
      price: parseFloat(newProduct.price),
      unit: newProduct.unit || '1 unit',
      variant: newProduct.variant,
      description: newProduct.description || 'No description provided.',
      image: `https://picsum.photos/seed/${newProduct.name}/400/300`
    };

    setProducts(prev => [product, ...prev]);
    setShowAddProduct(false);
    setNewProduct({ name: '', category: categories[1], price: '', unit: '', variant: '', description: '' });
  };

  const handleAddCategory = () => {
    const name = prompt("Enter new category name:");
    if (name && !categories.includes(name)) {
      setCategories(prev => [...prev, name]);
    }
  };

  const handleDeleteCategory = (cat: string) => {
    if (cat === 'All') return;
    if (confirm(`Are you sure you want to delete the "${cat}" category?`)) {
      setCategories(prev => prev.filter(c => c !== cat));
      if (selectedCategory === cat) setSelectedCategory('All');
    }
  };

  const handleDeleteUser = (userId: string) => {
    if (userId === currentUser?.id) {
      alert("You cannot delete your own account!");
      return;
    }
    if (confirm("Are you sure you want to delete this account?")) {
      const updatedUsers = registeredUsers.filter(u => u.id !== userId);
      setRegisteredUsers(updatedUsers);
      localStorage.setItem('quickcart_users', JSON.stringify(updatedUsers));
    }
  };

  if (!currentUser) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  const isAdmin = currentUser.role === 'admin';

  return (
    <div className="min-h-screen flex flex-col pb-32 sm:pb-0 bg-[#fcfcfd]">
      <Header 
        onCartToggle={() => setIsCartOpen(!isCartOpen)} 
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)} 
        user={currentUser}
        onLogout={handleLogout}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        adminTab={adminTab}
        onAdminTabChange={setAdminTab}
      />

      <main className="flex-grow container mx-auto px-6 py-10">
        
        {activeTab === 'home' && (
          <div className="animate-slide-up space-y-16">
            {/* Elegant Hero Banner */}
            <div className={`relative rounded-[3rem] overflow-hidden p-12 text-white shadow-2xl shadow-green-100/20 ${isAdmin ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black' : 'bg-gradient-to-br from-green-600 via-green-500 to-emerald-400'}`}>
              <div className="absolute top-0 right-0 p-12 opacity-10 animate-float pointer-events-none">
                 <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-80 h-80 fill-white">
                   <path d="M44.7,-76.4C58.1,-69.2,70,-59.1,79.6,-46.5C89.3,-33.8,96.7,-18.5,96.5,-3.3C96.3,11.9,88.4,26.9,78.2,39.8C68,52.8,55.5,63.6,41.4,71.2C27.2,78.8,11.3,83.1,-3.9,89.9C-19.1,96.6,-33.5,105.7,-46.2,101.4C-58.9,97.1,-69.9,79.3,-77.2,63.1C-84.5,46.9,-88,32.3,-90.1,17.4C-92.2,2.5,-92.9,-12.7,-88,-26.6C-83.1,-40.5,-72.6,-53,-59.7,-60.6C-46.8,-68.2,-31.5,-70.9,-16.4,-74.6C-1.3,-78.3,13.8,-83,28.7,-81.9C43.6,-80.8,58.3,-73.9,44.7,-76.4Z" transform="translate(100 100)" />
                 </svg>
              </div>

              <div className="relative z-10 max-w-2xl">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xl px-4 py-1.5 rounded-full border border-white/20 w-fit mb-8 animate-fade-in">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-200 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-300"></span>
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest">{isAdmin ? 'Admin Console' : 'Open for Business'}</span>
                </div>

                <h2 className="text-4xl sm:text-6xl font-black mb-8 leading-[1.1] tracking-tight">
                  {isAdmin 
                    ? (adminTab === 'products' ? 'Inventory Control' : 'User Ecosystem') 
                    : `Your Neighborhood Store - ${STORE_NAME}`}
                </h2>
                <p className="text-lg opacity-90 mb-12 leading-relaxed font-medium">
                  {isAdmin 
                    ? 'Seamlessly manage every aspect of your storefront, from premium products to customer accounts.' 
                    : 'Experience premium shopping for all your daily needs. Authentic quality, competitive Indian prices, and lightning-fast delivery via WhatsApp.'}
                </p>
                <div className="flex gap-4">
                  <button 
                    onClick={() => handleTabChange('products')}
                    className="px-12 py-5 bg-white text-gray-900 rounded-[2rem] font-black shadow-2xl shadow-black/10 hover:scale-105 active:scale-95 transition-all flex items-center gap-4"
                  >
                    {isAdmin ? 'Start Managing' : 'Shop Collections'}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Special Offers Section */}
            {!isAdmin && (
              <section className="animate-fade-in">
                <div className="flex items-end justify-between mb-8">
                  <div>
                    <h3 className="text-3xl font-black text-gray-900 tracking-tight">Offer of the Week</h3>
                    <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-2">Exclusive deals for Satya customers</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="group relative overflow-hidden rounded-[2.5rem] bg-orange-500 p-10 text-white shadow-xl shadow-orange-100 transition-all hover:scale-[1.02]">
                    <div className="relative z-10">
                      <div className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full w-fit mb-6 text-[10px] font-black uppercase tracking-widest border border-white/30">Limited Period</div>
                      <h4 className="text-3xl font-black mb-4 leading-tight">Flat ₹200 OFF on First Order!</h4>
                      <p className="opacity-90 mb-8 font-medium">Use code <span className="bg-white/20 px-3 py-1 rounded-lg font-black border border-white/30">SATYA200</span> at checkout via WhatsApp to avail this offer.</p>
                      <button onClick={() => handleTabChange('products')} className="bg-white text-orange-600 px-8 py-3 rounded-2xl font-black text-sm shadow-lg hover:shadow-orange-200 transition-all">Claim Now</button>
                    </div>
                    <div className="absolute top-0 right-0 p-10 opacity-10 scale-150 rotate-12 group-hover:rotate-45 transition-transform duration-1000">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-48 w-48" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                      </svg>
                    </div>
                  </div>
                  <div className="group relative overflow-hidden rounded-[2.5rem] bg-indigo-600 p-10 text-white shadow-xl shadow-indigo-100 transition-all hover:scale-[1.02]">
                    <div className="relative z-10">
                      <div className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full w-fit mb-6 text-[10px] font-black uppercase tracking-widest border border-white/30">Free Delivery</div>
                      <h4 className="text-3xl font-black mb-4 leading-tight">Order above ₹999 & get FREE Delivery</h4>
                      <p className="opacity-90 mb-8 font-medium">No coupon required. Valid across all grocery items. Experience premium delivery today.</p>
                      <button onClick={() => handleTabChange('products')} className="bg-white text-indigo-600 px-8 py-3 rounded-2xl font-black text-sm shadow-lg hover:shadow-indigo-200 transition-all">Shop Items</button>
                    </div>
                    <div className="absolute top-0 right-0 p-10 opacity-10 scale-150 -rotate-12 group-hover:-rotate-45 transition-transform duration-1000">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-48 w-48" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Featured Products on Home Page */}
            {!isAdmin && (
              <section className="animate-fade-in">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-3xl font-black text-gray-900 tracking-tight">Our Best Sellers</h3>
                    <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-2">The products you love the most</p>
                  </div>
                  <button 
                    onClick={() => handleTabChange('products')}
                    className="text-green-600 font-black text-sm uppercase tracking-widest hover:underline"
                  >
                    View All
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {featuredProducts.map(product => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      onAddToCart={addToCart} 
                      onDelete={() => handleDeleteProduct(product.id)}
                      isAdmin={isAdmin}
                    />
                  ))}
                </div>
              </section>
            )}

            {!isAdmin && (
              <section className="bg-white rounded-[3.5rem] border border-gray-100 p-12 sm:p-16 card-shadow animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-16 gap-6">
                  <h3 className="text-3xl font-black text-gray-900 tracking-tight">Experience Convenience</h3>
                  <div className="h-1 w-20 bg-green-500 rounded-full"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-16">
                  {[
                    { step: '01', title: 'Pick Items', desc: 'Browse our catalog of fresh essentials.' },
                    { step: '02', title: 'Cart Bag', desc: 'Review your items and shipment details.' },
                    { step: '03', title: 'WhatsApp', desc: 'One click to send your order to us.' },
                    { step: '04', title: 'Delivery', desc: 'Freshness delivered right to your door.' }
                  ].map(item => (
                    <div key={item.step} className="group relative">
                      <span className="text-5xl font-black text-gray-50 group-hover:text-green-500 transition-colors duration-500 mb-6 block leading-none">
                        {item.step}
                      </span>
                      <h4 className="font-black text-gray-900 text-xl mb-3">{item.title}</h4>
                      <p className="text-sm text-gray-500 font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {(activeTab === 'products' || isAdmin) && (
          <div className="animate-fade-in space-y-12">
            {isAdmin && adminTab === 'users' ? (
              /* User Management View */
              <section className="bg-white rounded-[3rem] border border-gray-100 overflow-hidden shadow-sm card-shadow">
                <div className="p-10 border-b border-gray-50 flex justify-between items-center bg-gray-50/20">
                  <h3 className="text-2xl font-black text-gray-900 tracking-tight">Registered Users</h3>
                  <div className="flex items-center gap-3 px-5 py-2.5 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                    <span className="text-xs font-black uppercase tracking-widest text-gray-600">{registeredUsers.length} active accounts</span>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-[0.25em] border-b border-gray-100">
                        <th className="px-10 py-6">User Profile</th>
                        <th className="px-10 py-6 text-center">Status</th>
                        <th className="px-10 py-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {registeredUsers.map(user => (
                        <tr key={user.id} className="hover:bg-gray-50/50 transition-all duration-300 group">
                          <td className="px-10 py-8">
                            <div className="flex items-center gap-5">
                              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-xl ${user.role === 'admin' ? 'bg-red-500 shadow-red-100' : 'bg-blue-500 shadow-blue-100'}`}>
                                {user.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-black text-gray-900 text-lg tracking-tight">{user.name}</p>
                                <p className="text-xs text-gray-400 font-bold tracking-wide mt-0.5">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-10 py-8 text-center">
                            <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${user.role === 'admin' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-10 py-8 text-right">
                            <button 
                              onClick={() => handleDeleteUser(user.id)}
                              className="p-3.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all opacity-0 group-hover:opacity-100"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            ) : (
              /* Catalog Section */
              <section className="space-y-12">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8">
                  <div>
                    <h3 className="text-4xl font-black text-gray-900 tracking-tight">{isAdmin ? 'Inventory Master' : 'Browse Catalog'}</h3>
                    <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-2">Finest selection for your household</p>
                  </div>
                  {isAdmin && (
                    <button 
                      onClick={() => setShowAddProduct(!showAddProduct)}
                      className={`flex items-center justify-center gap-4 px-10 py-4 rounded-[1.5rem] font-black shadow-2xl transition-all ${showAddProduct ? 'bg-gray-100 text-gray-500' : 'bg-gray-900 text-white hover:bg-black shadow-gray-200'}`}
                    >
                      {showAddProduct ? 'Cancel Edit' : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                          </svg>
                          Add New Product
                        </>
                      )}
                    </button>
                  )}
                </div>

                {isAdmin && showAddProduct && (
                  <div className="bg-white rounded-[3rem] border border-gray-100 p-10 shadow-2xl animate-slide-up">
                    <h4 className="text-xl font-black mb-8 text-gray-900">Add Premium Product</h4>
                    <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Product Name</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Sona Masuri Rice" 
                          className="w-full px-6 py-4 rounded-[1.5rem] border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-green-500/10 outline-none transition-all font-medium"
                          value={newProduct.name}
                          onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Category</label>
                        <select 
                          className="w-full px-6 py-4 rounded-[1.5rem] border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-green-500/10 outline-none transition-all font-medium"
                          value={newProduct.category}
                          onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                        >
                          {categories.filter(c => c !== 'All').map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Price (₹)</label>
                        <input 
                          type="number" 
                          step="0.01" 
                          placeholder="0" 
                          className="w-full px-6 py-4 rounded-[1.5rem] border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-green-500/10 outline-none transition-all font-medium"
                          value={newProduct.price}
                          onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Unit</label>
                        <input 
                          type="text" 
                          placeholder="1 kg / 5 L" 
                          className="w-full px-6 py-4 rounded-[1.5rem] border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-green-500/10 outline-none transition-all font-medium"
                          value={newProduct.unit}
                          onChange={e => setNewProduct({...newProduct, unit: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Variant / Brand</label>
                        <input 
                          type="text" 
                          placeholder="Brand Name" 
                          className="w-full px-6 py-4 rounded-[1.5rem] border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-green-500/10 outline-none transition-all font-medium"
                          value={newProduct.variant}
                          onChange={e => setNewProduct({...newProduct, variant: e.target.value})}
                        />
                      </div>
                      <div className="lg:col-span-3 space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Product Description</label>
                        <textarea 
                          placeholder="Describe the freshness..." 
                          className="w-full px-6 py-4 rounded-[2rem] border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-green-500/10 outline-none h-32 resize-none transition-all font-medium"
                          value={newProduct.description}
                          onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                        />
                      </div>
                      <div className="lg:col-span-3 flex justify-end">
                        <button type="submit" className="px-14 py-5 bg-green-500 text-white rounded-[2rem] font-black text-lg hover:bg-green-600 transition-all shadow-2xl shadow-green-100">
                          Deploy to Store
                        </button>
                      </div>
                    </form>
                  </div>
                )}
                
                <CategoryFilter 
                  categories={categories}
                  selectedCategory={selectedCategory} 
                  onCategoryChange={setSelectedCategory} 
                  onAddCategory={handleAddCategory}
                  onDeleteCategory={handleDeleteCategory}
                  isAdmin={isAdmin}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 mt-12">
                  {filteredProducts.map(product => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      onAddToCart={addToCart} 
                      onDelete={() => handleDeleteProduct(product.id)}
                      isAdmin={isAdmin}
                    />
                  ))}
                </div>

                {filteredProducts.length === 0 && (
                  <div className="text-center py-32 bg-white rounded-[4rem] border border-gray-100 mt-12 card-shadow animate-fade-in">
                    <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <p className="text-gray-400 font-black uppercase tracking-[0.3em] text-sm">Shelf is Empty</p>
                    <p className="text-gray-300 text-xs mt-3 font-medium tracking-wide">Try a different category or refresh</p>
                  </div>
                )}
              </section>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <SettingsView user={currentUser} onLogout={handleLogout} isAdmin={isAdmin} />
        )}
      </main>

      {/* Cart Drawer is always rendered but handles its own overlay visibility */}
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        deliveryDetails={deliveryDetails}
        onUpdateDelivery={setDeliveryDetails}
      />

      <ChatBot />

      <BottomNav 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
      />

      <footer className="hidden sm:block bg-white text-gray-900 py-24 mt-32 border-t border-gray-100">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-20">
            <div className="max-w-sm">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-gray-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h2 className="text-3xl font-black tracking-tight">{STORE_NAME}</h2>
              </div>
              <p className="text-base text-gray-500 font-medium leading-relaxed">
                Your destination for quality essentials. Premium service, authentic Indian goods, and reliable neighborhood delivery.
              </p>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-24">
              <div className="space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Categories</h4>
                <ul className="space-y-3 text-sm font-bold text-gray-600">
                  <li><a href="#" className="hover:text-green-500 transition-colors">Daily Groceries</a></li>
                  <li><a href="#" className="hover:text-green-500 transition-colors">Dairy & Milk</a></li>
                  <li><a href="#" className="hover:text-green-500 transition-colors">Personal Care</a></li>
                </ul>
              </div>
              <div className="space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Quick Support</h4>
                <ul className="space-y-3 text-sm font-bold text-gray-600">
                  <li><a href="#" className="hover:text-green-500 transition-colors">Order Status</a></li>
                  <li><a href="#" className="hover:text-green-500 transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-green-500 transition-colors">WhatsApp Help</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="pt-24 mt-24 border-t border-gray-50 text-center">
            <p className="text-[10px] text-gray-300 font-black uppercase tracking-[0.5em]">
              &copy; {new Date().getFullYear()} {STORE_NAME.toUpperCase()} • Pure Excellence
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;

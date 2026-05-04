import React, { useEffect, useState } from 'react';
import { 
  Users, ShoppingBag, Package, LogOut, CheckCircle, 
  X, Plus, Trash2, Power, Edit3, TrendingUp 
} from 'lucide-react';

const AdminDashboard = () => {
  // --- State Management ---
  const [view, setView] = useState('orders'); 
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  
  // Modal/Editing States
  const [editingUser, setEditingUser] = useState(null);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '', price: '', category: '', image_url: '', stock: 0
  });

  // --- Data Fetching ---
  const fetchData = async () => {
    try {
      const [orderRes, userRes, prodRes] = await Promise.all([
        fetch('http://localhost:8082/api/admin/orders'),
        fetch('http://localhost:8082/api/admin/users'),
        fetch('http://localhost:8082/api/admin/products')
      ]);
      
      setOrders(await orderRes.json());
      setUsers(await userRes.json());
      setProducts(await prodRes.json());
    } catch (err) {
      console.error("Data fetch error:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- Core Action Functions ---
  
  const updateOrderStatus = (id, status) => {
    fetch(`http://localhost:8082/api/admin/orders/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    }).then(() => fetchData());
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    const res = await fetch(`http://localhost:8082/api/admin/users/${editingUser.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingUser),
    });
    if ((await res.json()).status === "Success") {
      setEditingUser(null);
      fetchData();
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:8082/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct),
    });
    if ((await res.json()).status === "Success") {
      setIsAddProductOpen(false);
      setNewProduct({ name: '', price: '', category: '', image_url: '', stock: 0 });
      fetchData();
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    const res = await fetch(`http://localhost:8082/api/admin/products/${editingProduct.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingProduct),
    });
    if ((await res.json()).status === "Success") {
      setEditingProduct(null);
      fetchData();
    }
  };

  const toggleProduct = (id) => {
    fetch(`http://localhost:8082/api/admin/products/${id}/toggle`, { method: 'PUT' })
      .then(() => fetchData());
  };

  const deleteProduct = (id) => {
    if(window.confirm("Permanent delete this ritual product?")) {
      fetch(`http://localhost:8082/api/admin/products/${id}`, { method: 'DELETE' })
        .then(() => fetchData());
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfbfb] flex font-sans text-[#1a1510]">
      {/* --- SIDEBAR --- */}
      <div className="w-64 bg-[#1a1510] text-white p-8 flex flex-col fixed h-full shadow-2xl">
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-serif text-[#c5a059] italic tracking-tighter">LUMIÈRE</h2>
          <p className="text-[8px] uppercase tracking-[0.4em] text-gray-500 mt-2">Management Atelier</p>
        </div>
        
        <nav className="space-y-4 flex-grow text-[10px] uppercase tracking-[0.2em]">
          {[
            { id: 'orders', icon: <ShoppingBag size={14}/>, label: 'Orders' },
            { id: 'users', icon: <Users size={14}/>, label: `Users (${users.length})` },
            { id: 'inventory', icon: <Package size={14}/>, label: 'Inventory' }
          ].map(item => (
            <div 
              key={item.id}
              onClick={() => setView(item.id)}
              className={`flex items-center gap-4 px-4 py-4 rounded-xl cursor-pointer transition-all ${view === item.id ? 'bg-[#c5a059] text-black font-bold' : 'text-gray-500 hover:bg-white/5 hover:text-white'}`}
            >
              {item.icon} {item.label}
            </div>
          ))}
        </nav>

        <button onClick={() => window.location.href='/SkincareSystem/'} className="flex items-center gap-3 text-gray-600 text-[10px] uppercase tracking-widest hover:text-red-400 mt-auto pt-8 border-t border-white/5">
          <LogOut size={14} /> Exit System
        </button>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 ml-64 p-12">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-serif italic capitalize">{view} Management</h1>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-w-[160px]">
            <p className="text-[9px] text-gray-400 uppercase tracking-widest mb-1">Total Revenue</p>
            <p className="text-2xl font-serif text-[#c5a059]">${orders.reduce((s, o) => s + parseFloat(o.total_amount), 0).toFixed(2)}</p>
          </div>
        </div>

        {/* --- VIEW: ORDERS --- */}
        {view === 'orders' && (
          <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100 animate-fadeIn">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50/50 text-[9px] uppercase tracking-[0.2em] text-gray-400">
                <tr>
                  <th className="p-6">Ritual ID</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {orders.map(order => (
                  <tr key={order.id} className="border-t border-gray-50 hover:bg-gray-50/30 transition">
                    <td className="p-6 font-mono text-[11px] text-gray-400">#LMR-{order.id}</td>
                    <td className="font-medium">{order.username}</td>
                    <td className="font-serif text-[#c5a059]">${order.total_amount}</td>
                    <td>
                      <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase ${order.status === 'Shipped' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <select 
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className="text-[10px] bg-transparent border border-gray-200 rounded px-2 py-1 outline-none"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* --- VIEW: USERS --- */}
        {view === 'users' && (
          <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100 animate-fadeIn">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 text-[9px] uppercase tracking-[0.2em] text-gray-400">
                <tr><th className="p-6">User ID</th><th>Name</th><th>Email</th><th>Role</th><th>Action</th></tr>
              </thead>
              <tbody className="text-sm">
                {users.map(user => (
                  <tr key={user.id} className="border-t border-gray-50">
                    <td className="p-6 font-mono text-gray-400">#USR-{user.id}</td>
                    <td className="font-medium">{user.username}</td>
                    <td className="text-gray-500">{user.email}</td>
                    <td className="uppercase text-[9px] tracking-widest font-bold">{user.role}</td>
                    <td className="p-4">
                      <button onClick={() => setEditingUser(user)} className="text-[#c5a059] hover:text-black flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest transition">
                        <Edit3 size={12}/> Modify
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* --- VIEW: INVENTORY --- */}
        {view === 'inventory' && (
          <div className="animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-serif italic text-gray-700">Ritual Collection</h3>
              <button 
                onClick={() => setIsAddProductOpen(true)}
                className="flex items-center gap-2 bg-[#1a1510] text-white px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-[#c5a059] transition-all shadow-md"
              >
                <Plus size={14} /> Add New Ritual
              </button>
            </div>

            <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50 text-[9px] uppercase tracking-[0.2em] text-gray-400">
                  <tr><th className="p-6">Product</th><th>Stock</th><th>Price</th><th>Visibility</th><th>Management</th></tr>
                </thead>
                <tbody className="text-sm">
                  {products.map(prod => (
                    <tr key={prod.id} className="border-t border-gray-50">
                      <td className="p-6 flex items-center gap-4">
                        <img src={prod.image_url} className="w-12 h-12 object-cover rounded-xl bg-gray-50" />
                        <span className="font-serif italic">{prod.name}</span>
                      </td>
                      <td className={`font-bold ${prod.stock < 10 ? 'text-red-400' : ''}`}>{prod.stock}</td>
                      <td className="text-[#c5a059] font-serif font-bold">${prod.price}</td>
                      <td>
                        <button onClick={() => toggleProduct(prod.id)} className={`flex items-center gap-2 px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest ${prod.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
                          <Power size={8}/> {prod.is_active ? 'Active' : 'Offline'}
                        </button>
                      </td>
                      <td className="p-4 flex items-center gap-2">
                        <button onClick={() => setEditingProduct(prod)} className="text-[#c5a059] hover:text-black transition p-2">
                          <Edit3 size={16}/>
                        </button>
                        <button onClick={() => deleteProduct(prod.id)} className="text-gray-300 hover:text-red-500 transition p-2">
                          <Trash2 size={16}/>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* --- MODAL: ADD PRODUCT --- */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-black/20">
          <form onSubmit={handleAddProduct} className="bg-white w-full max-w-lg rounded-[2.5rem] p-12 shadow-2xl animate-fadeInUp relative">
            <button type="button" onClick={() => setIsAddProductOpen(false)} className="absolute right-8 top-8 text-gray-400 hover:text-black transition"><X size={24}/></button>
            <h2 className="text-3xl font-serif italic mb-8">Curate New Product</h2>
            <div className="space-y-5">
              <input 
                className="w-full border-b border-gray-100 py-4 outline-none focus:border-[#c5a059] text-sm" 
                placeholder="Product Name" 
                value={newProduct.name}
                onChange={e => setNewProduct({...newProduct, name: e.target.value})} 
                required
              />
              <div className="flex gap-4">
                <input 
                  className="w-1/2 border-b border-gray-100 py-4 outline-none focus:border-[#c5a059] text-sm" 
                  placeholder="Price ($)" type="number" step="0.01" 
                  value={newProduct.price}
                  onChange={e => setNewProduct({...newProduct, price: e.target.value})} required
                />
                <input 
                  className="w-1/2 border-b border-gray-100 py-4 outline-none focus:border-[#c5a059] text-sm" 
                  placeholder="Initial Stock" type="number" 
                  value={newProduct.stock}
                  onChange={e => setNewProduct({...newProduct, stock: e.target.value})} required
                />
              </div>
              <input 
                className="w-full border-b border-gray-100 py-4 outline-none focus:border-[#c5a059] text-sm" 
                placeholder="Image URL" 
                value={newProduct.image_url}
                onChange={e => setNewProduct({...newProduct, image_url: e.target.value})} required
              />
              <input 
                className="w-full border-b border-gray-100 py-4 outline-none focus:border-[#c5a059] text-sm" 
                placeholder="Category (e.g. Cleanser)" 
                value={newProduct.category}
                onChange={e => setNewProduct({...newProduct, category: e.target.value})}
              />
            </div>
            <button type="submit" className="w-full bg-[#1a1510] text-white py-5 rounded-full text-[10px] font-bold uppercase tracking-widest mt-10 hover:bg-[#c5a059] transition-all shadow-lg">Launch to Collection</button>
          </form>
        </div>
      )}

      {/* --- MODAL: EDIT PRODUCT --- */}
      {editingProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-black/20">
          <form onSubmit={handleUpdateProduct} className="bg-white w-full max-w-lg rounded-[2.5rem] p-12 shadow-2xl animate-fadeInUp relative">
            <button type="button" onClick={() => setEditingProduct(null)} className="absolute right-8 top-8 text-gray-400 hover:text-black transition"><X size={24}/></button>
            <h2 className="text-3xl font-serif italic mb-8">Edit Ritual Product</h2>
            <div className="space-y-5">
              <div>
                <label className="text-[9px] uppercase tracking-widest text-gray-400 mb-1 block">Product Name</label>
                <input className="w-full border-b border-gray-100 py-2 outline-none focus:border-[#c5a059] text-sm font-medium" value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} required/>
              </div>
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="text-[9px] uppercase tracking-widest text-gray-400 mb-1 block">Price ($)</label>
                  <input className="w-full border-b border-gray-100 py-2 outline-none focus:border-[#c5a059] text-sm font-medium" type="number" step="0.01" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: e.target.value})} required/>
                </div>
                <div className="w-1/2">
                  <label className="text-[9px] uppercase tracking-widest text-gray-400 mb-1 block">Stock Count</label>
                  <input className="w-full border-b border-gray-100 py-2 outline-none focus:border-[#c5a059] text-sm font-medium" type="number" value={editingProduct.stock} onChange={e => setEditingProduct({...editingProduct, stock: e.target.value})} required/>
                </div>
              </div>
              <div>
                <label className="text-[9px] uppercase tracking-widest text-gray-400 mb-1 block">Image URL</label>
                <input className="w-full border-b border-gray-100 py-2 outline-none focus:border-[#c5a059] text-sm font-medium" value={editingProduct.image_url} onChange={e => setEditingProduct({...editingProduct, image_url: e.target.value})} required/>
              </div>
              <div>
                <label className="text-[9px] uppercase tracking-widest text-gray-400 mb-1 block">Category</label>
                <input className="w-full border-b border-gray-100 py-2 outline-none focus:border-[#c5a059] text-sm font-medium" value={editingProduct.category} onChange={e => setEditingProduct({...editingProduct, category: e.target.value})}/>
              </div>
            </div>
            <button type="submit" className="w-full bg-[#1a1510] text-white py-5 rounded-full text-[10px] font-bold uppercase tracking-widest mt-10 hover:bg-[#c5a059] transition-all shadow-lg">Save Changes</button>
          </form>
        </div>
      )}

      {/* --- MODAL: EDIT USER --- */}
      {editingUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-black/20">
          <form onSubmit={handleUpdateUser} className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl animate-fadeInUp relative overflow-y-auto max-h-[90vh]">
            <button type="button" onClick={() => setEditingUser(null)} className="absolute right-8 top-8 text-gray-400 hover:text-black transition"><X size={24}/></button>
            <h2 className="text-3xl font-serif italic mb-6">Modify Member Detail</h2>
            <div className="space-y-4">
              <input className="w-full border-b border-gray-100 py-2 outline-none focus:border-[#c5a059] text-sm font-medium" value={editingUser.username || ''} onChange={e => setEditingUser({...editingUser, username: e.target.value})} required/>
              <input type="email" className="w-full border-b border-gray-100 py-2 outline-none focus:border-[#c5a059] text-sm font-medium" value={editingUser.email || ''} onChange={e => setEditingUser({...editingUser, email: e.target.value})} required/>
              <textarea className="w-full border-b border-gray-100 py-2 outline-none focus:border-[#c5a059] text-sm font-medium resize-none h-16" value={editingUser.address || ''} onChange={e => setEditingUser({...editingUser, address: e.target.value})} />
              <select className="w-full border-b border-gray-100 py-2 outline-none focus:border-[#c5a059] text-sm" value={editingUser.role || 'customer'} onChange={e => setEditingUser({...editingUser, role: e.target.value})}>
                <option value="customer">Customer</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
            <button type="submit" className="w-full bg-[#1a1510] text-white py-4 rounded-full text-[10px] font-bold uppercase tracking-widest mt-8 hover:bg-[#c5a059] transition-all shadow-lg">Update Profile</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
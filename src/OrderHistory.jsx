import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (user?.id) {
      fetch(`http://localhost:8082/api/skincare/orders/${user.id}`)
        .then(res => res.json())
        .then(data => setOrders(data))
        .catch(err => console.log(err));
    }
  }, [user?.id]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-serif text-[#c5a059] mb-12 italic text-center">Your Ritual History</h2>
        
        {orders.length === 0 ? (
          <p className="text-center text-gray-600 uppercase tracking-widest text-[10px]">No rituals performed yet.</p>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order.id} className="bg-[#111] p-8 rounded-2xl border border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-left space-y-2">
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest block">Order #LMR-{order.id}</span>
                  <p className="text-sm font-serif">{order.items}</p>
                  <span className="text-[10px] text-gray-600 block">{new Date(order.created_at).toLocaleDateString()}</span>
                </div>
                <div className="text-right">
                  <span className="text-[#c5a059] font-serif text-xl">${order.total_amount}</span>
                  <span className="block text-[9px] uppercase text-emerald-500 tracking-widest mt-1">{order.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-16 text-center">
          <Link to="/" className="text-[10px] uppercase tracking-widest text-gray-500 border-b border-gray-800 pb-1 hover:text-[#c5a059] hover:border-[#c5a059] transition-all">Back to Atelier</Link>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
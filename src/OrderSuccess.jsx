import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const OrderSuccess = () => {
  const location = useLocation();
  const orderData = location.state?.order || null; // 获取从 Checkout 传过来的订单数据

  if (!orderData) {
    return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">No Order Found.</div>;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-6 font-sans">
      <div className="max-w-2xl w-full bg-[#111] p-12 rounded-3xl border border-white/5 text-center shadow-2xl animate-fadeIn">
        
        {/* 顶部成功标志 */}
        <div className="w-20 h-20 bg-[#c5a059]/10 rounded-full flex items-center justify-center mx-auto mb-8">
          <div className="w-10 h-10 border-2 border-[#c5a059] rounded-full flex items-center justify-center">
            <span className="text-[#c5a059] text-xl">✓</span>
          </div>
        </div>

        <h2 className="text-3xl font-serif text-[#c5a059] mb-4 italic">The Ritual is Complete</h2>
        <p className="text-gray-500 text-xs uppercase tracking-[0.3em] mb-12">Thank you for choosing LUMIÈRE</p>

        {/* 订单摘要卡片 */}
        <div className="bg-black/40 rounded-2xl p-8 mb-12 text-left border border-white/5">
          <div className="flex justify-between mb-6 border-b border-white/5 pb-4">
            <span className="text-[10px] uppercase text-gray-500 tracking-widest">Order Number</span>
            <span className="text-[10px] text-white">#LMR-{orderData.orderId}</span>
          </div>

          <div className="space-y-4 mb-8">
            {orderData.cart.map((item, index) => (
              <div key={index} className="flex justify-between text-xs">
                <span className="text-gray-400">{item.name} x {item.quantity}</span>
                <span className="font-serif">{item.price}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-white/5 flex justify-between items-end">
            <span className="text-[10px] uppercase text-gray-500 tracking-widest">Total Ritual Amount</span>
            <span className="text-2xl font-serif text-[#c5a059]">${orderData.total.toFixed(2)}</span>
          </div>
        </div>

        <p className="text-gray-600 text-[10px] leading-relaxed mb-10 italic">
          A confirmation email has been sent to {orderData.email}. <br />
          Your luxury package will be prepared at our atelier.
        </p>

        <Link to="/" className="inline-block bg-[#c5a059] text-black px-10 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-all">
          Return to Atelier
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
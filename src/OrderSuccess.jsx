import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Gift, Copy, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast'; // 1. 导入 toast

const OrderSuccess = () => {
  const location = useLocation();
  const orderData = location.state?.order || null;

  // 定义仪式感 Toast 样式
  const ritualToast = {
    style: {
      background: '#111',
      color: '#c5a059',
      border: '1px solid rgba(197, 160, 89, 0.3)',
      fontSize: '12px',
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      borderRadius: '12px',
      padding: '16px',
    },
    iconTheme: {
      primary: '#c5a059',
      secondary: '#111',
    },
  };

  // 点击复制优惠码的函数
  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    // 2. 替换为 toast.success
    toast.success("Promo code copied to ritual clipboard! ✨", ritualToast);
  };

  if (!orderData) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white font-sans">
        <div className="text-center">
          <p className="mb-6 text-gray-500 uppercase tracking-[0.3em]">No Order Found.</p>
          <Link to="/" className="text-[#c5a059] border-b border-[#c5a059]/30 pb-1 uppercase text-[10px] tracking-widest hover:text-white hover:border-white transition-all">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-6 font-sans">
      <div className="max-w-2xl w-full bg-[#111] p-12 rounded-3xl border border-white/5 text-center shadow-2xl animate-fadeIn relative overflow-hidden">
        
        {/* 背景装饰光晕 */}
        {orderData.promoCode && (
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#c5a059]/10 blur-[100px] rounded-full pointer-events-none" />
        )}

        {/* 顶部成功标志 */}
        <div className="w-20 h-20 bg-[#c5a059]/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-[#c5a059]/20">
           <CheckCircle className="text-[#c5a059]" size={32} />
        </div>

        <h2 className="text-3xl font-serif text-[#c5a059] mb-4 italic">The Ritual is Complete</h2>
        <p className="text-gray-500 text-xs uppercase tracking-[0.3em] mb-12">Thank you for choosing LUMIÈRE</p>

        {/* --- 优惠码奖励区域 --- */}
        {orderData.promoCode && (
          <div className="mb-12 p-8 rounded-2xl bg-gradient-to-br from-[#c5a059]/10 to-transparent border border-[#c5a059]/30 relative group shadow-2xl">
            <div className="flex items-center justify-center gap-3 mb-4 text-[#c5a059]">
              <Gift size={20} />
              <span className="text-[10px] uppercase tracking-[0.4em] font-bold">Loyalty Reward Unlocked</span>
            </div>
            
            <p className="text-gray-300 text-xs mb-6 font-light leading-relaxed">
              Your dedication to your skincare ritual has reached new heights. <br/>
              Since your cumulative spending has exceeded **RM 500**, <br/> 
              please accept this exclusive gift for your next purchase:
            </p>

            <div 
              onClick={() => copyCode(orderData.promoCode)}
              className="bg-black/60 border border-dashed border-[#c5a059] py-4 px-6 rounded-xl flex items-center justify-between cursor-pointer hover:bg-black transition-all group"
            >
              <span className="text-2xl font-mono tracking-[0.3em] text-[#c5a059]">
                {orderData.promoCode}
              </span>
              <div className="flex items-center gap-2 text-[9px] uppercase tracking-widest text-gray-500 group-hover:text-white transition-colors">
                <Copy size={12} /> Copy Code
              </div>
            </div>
          </div>
        )}

        {/* 订单摘要卡片 */}
        <div className="bg-black/40 rounded-2xl p-8 mb-12 text-left border border-white/5">
          <div className="flex justify-between mb-6 border-b border-white/5 pb-4">
            <span className="text-[10px] uppercase text-gray-500 tracking-widest">Order Number</span>
            <span className="text-[10px] text-white">#LMR-{orderData.orderId}</span>
          </div>

          <div className="space-y-4 mb-8 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
            {orderData.cart.map((item, index) => (
              <div key={index} className="flex justify-between text-xs">
                <span className="text-gray-400 font-light">{item.name} <span className="text-[10px] opacity-50 ml-1">x{item.quantity}</span></span>
                <span className="font-serif">
                  ${(parseFloat(item.price.replace('$', '')) * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-white/5 flex justify-between items-end">
            <span className="text-[10px] uppercase text-gray-500 tracking-widest">Total Ritual Amount</span>
            <span className="text-2xl font-serif text-[#c5a059]">${orderData.total.toFixed(2)}</span>
          </div>
        </div>

        <p className="text-gray-600 text-[10px] leading-relaxed mb-10 italic font-light">
          A confirmation email has been sent to {orderData.email}. <br />
          Your luxury package will be prepared at our atelier.
        </p>

        <Link to="/" className="inline-block bg-[#c5a059] text-black px-12 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-all shadow-lg shadow-[#c5a059]/10">
          Return to Atelier
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
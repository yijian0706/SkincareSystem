import React, { useState } from 'react';
import toast from 'react-hot-toast'; // 确保已安装并导入
import { useNavigate, Link } from 'react-router-dom';

const Checkout = () => {
  const navigate = useNavigate();
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const user = JSON.parse(localStorage.getItem('user'));

  // 自定义 Toast 样式（黑金奢华风）
  const ritualToastStyle = {
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

  // --- 状态管理 ---
  const [promoInput, setPromoInput] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isPromoApplied, setIsPromoApplied] = useState(false);

  const [formData, setFormData] = useState({
    fullName: user?.username || '',
    email: user?.email || '',
    address: user?.address || '',
    city: '',
    zip: '',
    cardNumber: '',
    exp: '',
    cvv: ''
  });

  // --- 价格计算逻辑 ---
  const subtotal = cart.reduce((total, item) => 
    total + (parseFloat(item.price.replace('$', '')) * item.quantity), 0
  );
  const shipping = 15.00;
  const total = subtotal + shipping - discount;

  // --- 1. 验证 Promo Code ---
  const applyPromoCode = async () => {
    if (!user?.id) {
      toast.error("Please log in to apply your ritual promo code.", ritualToastStyle);
      return;
    }

    try {
      const response = await fetch('http://localhost:8082/api/skincare/verify-promo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          promoCode: promoInput, 
          userId: user.id 
        }),
      });

      const data = await response.json();

      if (data.status === "Success") {
        setDiscount(data.discountAmount); 
        setIsPromoApplied(true);
        toast.success(data.message + " ✨", ritualToastStyle);
      } else {
        toast.error(data.message, ritualToastStyle);
      }
    } catch (error) {
      console.error("Promo verification error:", error);
      toast.error("Unable to verify promo code at this moment.", ritualToastStyle);
    }
  };

  // --- 2. 表单完整性验证 ---
  const isPaymentComplete = 
    formData.fullName.trim() !== '' &&
    formData.address.trim() !== '' &&
    formData.city.trim() !== '' &&
    formData.zip.trim() !== '' &&
    formData.cardNumber.replace(/\s/g, '').length >= 16 && 
    formData.exp.trim() !== '' &&
    formData.cvv.trim().length >= 3;

  // --- 3. 提交订单 ---
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!isPaymentComplete) return;

    const orderData = {
        user_id: user?.id || null,
        fullName: formData.fullName,
        email: formData.email,
        address: `${formData.address}, ${formData.city}, ${formData.zip}`,
        total: total,
        discount: discount,
        cart: cart
    };

    const loadingToast = toast.loading("Preparing your luxury ritual...", ritualToastStyle);

    try {
        const response = await fetch('http://localhost:8082/api/skincare/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData),
        });

        const data = await response.json();

        if (data.status === "Success") {
          toast.dismiss(loadingToast);
          toast.success("Order confirmed! Your ritual begins now. ✨", ritualToastStyle);
          
          const summaryData = {
              orderId: data.orderId,
              cart: cart,
              total: total,
              email: formData.email,
              promoCode: data.promoCode || null 
          };
          
          localStorage.removeItem('cart');
          setTimeout(() => {
            navigate('/order-success', { state: { order: summaryData } });
          }, 1000);
        } else {
          toast.dismiss(loadingToast);
          toast.error("Submission failed: " + data.message, ritualToastStyle);
        }
    } catch (error) {
        toast.dismiss(loadingToast);
        console.error("Checkout Error:", error);
        toast.error("Network error, please check your connection.", ritualToastStyle);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">
        <div className="text-center">
          <p className="text-gray-500 mb-6 uppercase tracking-[0.3em]">Your cart is empty</p>
          <Link to="/" className="text-[#c5a059] border-b border-[#c5a059] pb-1 uppercase text-[10px] tracking-widest">Return to Collection</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-32 pb-20 px-6 font-sans">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
        
        {/* 左侧：配送与支付表单 */}
        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-serif text-[#c5a059] mb-8 italic">Shipping Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input className="col-span-2 bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-[#c5a059]" placeholder="Full Name" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
              <input className="col-span-2 bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-[#c5a059]" placeholder="Shipping Address" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
              <input className="bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-[#c5a059]" placeholder="City" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} />
              <input className="bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-[#c5a059]" placeholder="Postcode" value={formData.zip} onChange={(e) => setFormData({...formData, zip: e.target.value})} />
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-[#c5a059] mb-8 italic">Payment Method</h2>
            <div className="bg-white/5 border border-white/10 p-8 rounded-2xl space-y-4">
              <input className="w-full bg-black/40 border border-white/10 p-4 rounded-xl outline-none" placeholder="Card Number (0000 0000 0000 0000)" value={formData.cardNumber} onChange={(e) => setFormData({...formData, cardNumber: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <input className="bg-black/40 border border-white/10 p-4 rounded-xl outline-none" placeholder="MM/YY" value={formData.exp} onChange={(e) => setFormData({...formData, exp: e.target.value})} />
                <input className="bg-black/40 border border-white/10 p-4 rounded-xl outline-none" placeholder="CVV" value={formData.cvv} onChange={(e) => setFormData({...formData, cvv: e.target.value})} />
              </div>
            </div>
          </section>

          <button 
            onClick={handlePlaceOrder} 
            disabled={!isPaymentComplete} 
            className={`w-full font-bold py-5 rounded-full uppercase tracking-[0.3em] text-xs transition-all shadow-xl ${
              isPaymentComplete 
                ? "bg-[#c5a059] text-black hover:bg-white cursor-pointer" 
                : "bg-gray-800 text-gray-500 cursor-not-allowed opacity-50"
            }`}
          >
            {isPaymentComplete ? `Complete Ritual - $${total.toFixed(2)}` : "Please Enter Payment Details"}
          </button>
        </div>

        {/* 右侧：订单摘要与优惠码 */}
        <div className="bg-[#111] p-10 rounded-3xl h-fit border border-white/5">
          <h3 className="text-lg font-serif mb-8 text-gray-400">Order Summary</h3>
          
          <div className="space-y-6 mb-10">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-white/5 rounded-lg flex items-center justify-center p-2">
                    <img src={item.image_url || item.img} alt="" className="object-contain" />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-widest">{item.name}</h4>
                    <p className="text-gray-500 text-[10px]">Qty: {item.quantity}</p>
                  </div>
                </div>
                <span className="text-sm font-serif">{item.price}</span>
              </div>
            ))}
          </div>

          {/* --- 优惠码输入框 --- */}
          <div className="mb-8 pt-6 border-t border-white/5">
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-3">Ritual Promo Code</p>
            <div className="flex gap-3">
              <input 
                className="flex-grow bg-white/5 border border-white/10 p-3 rounded-lg outline-none focus:border-[#c5a059] text-sm uppercase"
                placeholder="Enter Code"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                disabled={isPromoApplied}
              />
              <button 
                onClick={applyPromoCode}
                disabled={isPromoApplied || !promoInput}
                className={`px-6 py-2 rounded-lg text-[10px] uppercase font-bold tracking-widest transition-all ${
                  isPromoApplied 
                    ? "bg-emerald-500/20 text-emerald-500 border border-emerald-500/30" 
                    : "bg-white/10 hover:bg-[#c5a059] hover:text-black text-white"
                }`}
              >
                {isPromoApplied ? "Applied" : "Apply"}
              </button>
            </div>
          </div>

          {/* 价格结算明细 */}
          <div className="border-t border-white/5 pt-6 space-y-4">
            <div className="flex justify-between text-xs text-gray-500 uppercase tracking-widest">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            
            {discount > 0 && (
              <div className="flex justify-between text-xs text-emerald-500 uppercase tracking-widest">
                <span>Ritual Discount</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between text-xs text-gray-500 uppercase tracking-widest">
              <span>Shipping Ritual</span>
              <span>$15.00</span>
            </div>
            
            <div className="flex justify-between text-xl font-serif text-[#c5a059] pt-4 border-t border-white/5">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;
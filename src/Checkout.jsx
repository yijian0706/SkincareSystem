import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Checkout = () => {
  const navigate = useNavigate();
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const user = JSON.parse(localStorage.getItem('user'));

  // 计算总价
  const subtotal = cart.reduce((total, item) => 
    total + (parseFloat(item.price.replace('$', '')) * item.quantity), 0
  );
  const shipping = 15.00;
  const total = subtotal + shipping;

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

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    // 整理要发送的数据
    const orderData = {
        user_id: user?.id || null, // 从 localStorage 获取的 ID
        fullName: formData.fullName,
        email: formData.email,
        address: formData.address,
        total: total, // 刚才计算的总价
        cart: cart    // 购物车数组
    };

    try {
        const response = await fetch('http://localhost:8082/api/skincare/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
        });

        const data = await response.json();

        if (data.status === "Success") {
        // 1. 准备要展示给用户看的数据包
        const summaryData = {
            orderId: data.orderId,
            cart: cart,
            total: total,
            email: formData.email
        };

        // 2. 清空购物车存储
        localStorage.removeItem('cart');

        // 3. 跳转到成功页，并把数据通过 state 传过去
        navigate('/order-success', { state: { order: summaryData } });
        } else {
        alert("提交失败: " + data.message);
        }
    } catch (error) {
        console.error("Checkout Error:", error);
        alert("网络错误，请检查后端服务器。");
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
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
        
        {/* 左侧：表单部分 */}
        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-serif text-[#c5a059] mb-8 italic">Shipping Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                className="col-span-2 bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-[#c5a059]" 
                placeholder="Full Name" 
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              />
              <input 
                className="col-span-2 bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-[#c5a059]" 
                placeholder="Shipping Address" 
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              />
              <input className="bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-[#c5a059]" placeholder="City" />
              <input className="bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-[#c5a059]" placeholder="Postcode" />
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-[#c5a059] mb-8 italic">Payment Method</h2>
            <div className="bg-white/5 border border-white/10 p-8 rounded-2xl space-y-4">
              <input className="w-full bg-black/40 border border-white/10 p-4 rounded-xl outline-none" placeholder="Card Number (0000 0000 0000 0000)" />
              <div className="grid grid-cols-2 gap-4">
                <input className="bg-black/40 border border-white/10 p-4 rounded-xl outline-none" placeholder="MM/YY" />
                <input className="bg-black/40 border border-white/10 p-4 rounded-xl outline-none" placeholder="CVV" />
              </div>
            </div>
          </section>

          <button 
            onClick={handlePlaceOrder}
            className="w-full bg-[#c5a059] text-black font-bold py-5 rounded-full uppercase tracking-[0.3em] text-xs hover:bg-white transition-all shadow-xl"
          >
            Complete Ritual - ${total.toFixed(2)}
          </button>
        </div>

        {/* 右侧：订单摘要 */}
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

          <div className="border-t border-white/5 pt-6 space-y-4">
            <div className="flex justify-between text-xs text-gray-500 uppercase tracking-widest">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500 uppercase tracking-widest">
              <span>Shipping Ritual</span>
              <span>$15.00</span>
            </div>
            <div className="flex justify-between text-xl font-serif text-[#c5a059] pt-4">
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
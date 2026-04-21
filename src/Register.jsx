import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast'; // 1. 导入 toast

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    address: '',
    password: ''
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 显示加载状态
    const loadingToast = toast.loading("Creating your ritual account...", ritualToast);

    try {
      const response = await fetch('http://localhost:8082/api/skincare/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      toast.dismiss(loadingToast); // 关闭加载框

      if (data.status === "Success") {
        // 保存用户信息
        localStorage.setItem('user', JSON.stringify(data.user)); 
        
        // 成功提示
        toast.success(data.message + " ✨", ritualToast);
        
        // 延迟跳转，让用户看一眼提示
        setTimeout(() => {
          navigate('/'); 
        }, 1500);
      } else {
        // 失败提示（使用后端返回的错误信息）
        toast.error(data.message, ritualToast);
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error("Network error:", error);
      toast.error("Unable to connect to the LUMIÈRE server.", ritualToast);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-6 selection:bg-[#c5a059] selection:text-black font-sans">
      <form onSubmit={handleSubmit} className="bg-[#111] p-10 rounded-2xl border border-white/5 w-full max-w-md shadow-2xl">
        
        <div className="text-center mb-10">
          <div className="w-12 h-12 bg-gradient-to-tr from-orange-400 to-emerald-400 rounded-full mx-auto mb-6 opacity-80" />
          <h2 className="text-3xl font-serif text-[#c5a059] mb-2 italic">LUMIÈRE</h2>
          <p className="text-gray-500 text-[10px] uppercase tracking-[0.3em]">Create Your Ritual Account</p>
        </div>

        <div className="space-y-4">
          <input 
            className="w-full bg-white/5 p-4 rounded-full outline-none border border-white/5 focus:border-[#c5a059] transition-all text-sm" 
            placeholder="Username" 
            required
            onChange={(e) => setFormData({...formData, username: e.target.value})} 
          />
          
          <input 
            type="email"
            className="w-full bg-white/5 p-4 rounded-full outline-none border border-white/5 focus:border-[#c5a059] transition-all text-sm" 
            placeholder="Email Address" 
            required
            onChange={(e) => setFormData({...formData, email: e.target.value})} 
          />

          <textarea 
            className="w-full bg-white/5 p-4 rounded-2xl outline-none border border-white/5 focus:border-[#c5a059] transition-all text-sm resize-none h-24" 
            placeholder="Shipping Address (For your luxury package)" 
            required
            onChange={(e) => setFormData({...formData, address: e.target.value})} 
          />

          <input 
            type="password" 
            className="w-full bg-white/5 p-4 rounded-full outline-none border border-white/5 focus:border-[#c5a059] transition-all text-sm" 
            placeholder="Password" 
            required
            onChange={(e) => setFormData({...formData, password: e.target.value})} 
          />
        </div>

        <button className="w-full bg-[#c5a059] text-black font-bold py-4 rounded-full uppercase tracking-[0.2em] text-[11px] mt-10 hover:bg-white transition-all duration-500 shadow-lg shadow-[#c5a059]/10">
          Sign Up Now
        </button>

        <div className="mt-8 text-center space-y-3">
          <p className="text-[11px] text-gray-600 uppercase tracking-widest">
            Already a member? <Link to="/login" className="text-[#c5a059] hover:text-white transition-colors">Login Here</Link>
          </p>
          <p className="text-[9px] text-gray-700 uppercase tracking-widest">
            <Link to="/" className="hover:text-gray-400 transition-colors">Back to Home</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast'; // 1. 导入 toast

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // 定义统一的 LUMIÈRE 奢华风格样式
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

  const handleLogin = async (e) => {
    e.preventDefault();

    // 显示加载状态
    const loadingToast = toast.loading("Verifying your ritual credentials...", ritualToast);

    try {
      const response = await fetch('http://localhost:8082/api/skincare/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      // 请求完成后关闭加载框
      toast.dismiss(loadingToast);

      if (data.status === "Success") {
        const userToStore = {
          id: data.user.id,
          username: data.user.username,
          email: email,
          address: data.user.address, 
          role: data.user.role
        };

        localStorage.setItem('user', JSON.stringify(userToStore));

        // --- 替换原本的 alert ---
        toast.success("Welcome back—it’s time to begin your skincare ritual. ✨", ritualToast);
        
        // 延迟 1 秒跳转，让用户看到成功的提示
        setTimeout(() => {
          navigate('/'); 
        }, 1000);
      } else {
        // --- 替换原本的 alert ---
        toast.error(data.message || "Login failed. Please check your credentials.", ritualToast);
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error("Login error:", error);
      // --- 替换原本的 alert ---
      toast.error("Unable to connect to the LUMIÈRE server.", ritualToast);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-6 font-sans">
      <form onSubmit={handleLogin} className="bg-[#111] p-10 rounded-2xl border border-white/5 w-full max-w-md shadow-2xl">
        <div className="text-center mb-10">
          <div className="w-12 h-12 bg-gradient-to-tr from-orange-400 to-emerald-400 rounded-full mx-auto mb-6 opacity-80" />
          <h2 className="text-3xl font-serif text-[#c5a059] mb-2 italic">LUMIÈRE</h2>
          <p className="text-gray-500 text-[10px] uppercase tracking-[0.3em]">Sign In to Your Ritual</p>
        </div>

        <div className="space-y-4">
          <input 
            type="email"
            className="w-full bg-white/5 p-4 rounded-full outline-none border border-white/5 focus:border-[#c5a059] transition-all text-sm" 
            placeholder="Email Address" 
            required
            onChange={(e) => setEmail(e.target.value)} 
          />
          <input 
            type="password" 
            className="w-full bg-white/5 p-4 rounded-full outline-none border border-white/5 focus:border-[#c5a059] transition-all text-sm" 
            placeholder="Password" 
            required
            onChange={(e) => setPassword(e.target.value)} 
          />
        </div>

        <button className="w-full bg-[#c5a059] text-black font-bold py-4 rounded-full uppercase tracking-[0.2em] text-[11px] mt-10 hover:bg-white transition-all duration-500 shadow-lg shadow-[#c5a059]/10">
          Login
        </button>

        <p className="mt-8 text-center text-[11px] text-gray-600 uppercase tracking-widest">
          Don't have an account? <Link to="/register" className="text-[#c5a059] hover:text-white transition-colors">Register Here</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
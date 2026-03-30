import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8082/api/skincare/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.status === "Success") {
        // --- 核心修改：确保存储的对象包含 address ---
        // 我们从后端返回的 data.user 中提取字段
        const userToStore = {
          id: data.user.id,
          username: data.user.username,
          email: email, // 直接用输入的 email
          address: data.user.address, // 这里就是你要求的 address
          role: data.user.role
        };

        // 存入 localStorage
        localStorage.setItem('user', JSON.stringify(userToStore));

        alert("Welcome back—it’s time to begin your skincare ritual.✨");
        navigate('/'); 
      } else {
        alert("Login failed: " + data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Unable to connect to the server. Please check if the Node.js backend is running.");
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

        <button className="w-full bg-[#c5a059] text-black font-bold py-4 rounded-full uppercase tracking-[0.2em] text-[11px] mt-10 hover:bg-white transition-all duration-500 shadow-lg">
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
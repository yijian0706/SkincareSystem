import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // 导入 Link

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    address: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8082/api/skincare/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.status === "Success") {
        // 注册成功自动保存状态并跳回首页
        localStorage.setItem('user', JSON.stringify({ username: formData.username, address: formData.address }));
        alert("Registration successful! Welcome to your skincare ritual.✨");
        navigate('/'); 
      } else {
        alert("Registration failed: " + data.message);
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Unable to connect to the server. Please check if the Node.js backend is running.");
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

        {/* --- 修改后的底部链接部分 --- */}
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
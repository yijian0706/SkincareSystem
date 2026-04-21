import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Plus, Minus, X, Check, ChevronDown, Clock, LogOut, ShieldCheck } from 'lucide-react';
import Register from './Register';
import Login from './Login';
import Checkout from './Checkout';
import OrderSuccess from './OrderSuccess';
import OrderHistory from './OrderHistory';
import AdminDashboard from './AdminDashboard';
import FormulaPage from './FormulaPage';
import { Toaster } from 'react-hot-toast';

// --- LANDING PAGE COMPONENT ---
const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const loggedInUser = JSON.parse(localStorage.getItem('user'));
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
  // 从数据库获取产品
  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:8082/api/skincare/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("无法加载产品仪式:", error);
    }
  };

  fetchProducts();

  // 原有的滚动监听逻辑
  const handleScroll = () => {
    setIsScrolled(window.scrollY > 20);
  };
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);

   // --- 核心：加入购物车函数 ---
  const addToCart = (product) => {
    // 1. 安全检查：必须登录
    const user = JSON.parse(localStorage.getItem('user'));
    
    // 定义仪式感样式 (保持全站统一)
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

    if (!user) {
      toast.error("Please log in to your account to begin your exclusive LUMIÈRE experience. ✨", ritualToast);
      
      // 稍微延迟跳转，让用户看清楚 toast
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      return;
    }

    // 2. 准备更新后的购物车数据
    let updatedCart;
    const isExist = cart.find(item => item.id === product.id);
    
    if (isExist) {
      updatedCart = cart.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updatedCart = [...cart, { ...product, quantity: 1 }];
    }

    // 3. 同时更新 React 状态和 LocalStorage
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart)); 

    // --- 可选：添加成功加入购物车的提示 ---
    toast.success(`${product.name} added to your ritual.`, ritualToast);

    // 4. 打开购物车抽屉预览
    setIsCartOpen(true);
  };

  const updateQuantity = (productId, delta) => {
    let updatedCart = cart.map(item => {
      if (item.id === productId) {
        const newQty = item.quantity + delta;
        // 如果数量小于 1，我们先返回 null，稍后过滤掉
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean); // 过滤掉数量变为 0 的商品 (null)

    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  // --- 新增：手动移除商品函数 ---
  const removeFromCart = (productId) => {
    const updatedCart = cart.filter(item => item.id !== productId);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  // const products = [
  //   {
  //     id: 1,
  //     tag: "Best Seller",
  //     category: "Serums",
  //     name: "Radiance Revival Serum",
  //     price: "$148",
  //     img: "https://readdy.ai/api/search-image?query=luxury%20glass%20serum%20bottle%20with%20gold%20dropper%20cap%20on%20light%20cream%20background%2C%20minimal%20skincare%20product%20photography%2C%20elegant%20cosmetic%20bottle%2C%20soft%20natural%20lighting%2C%20premium%20beauty%20product&width=400&height=500&seq=list_serum_01&orientation=portrait" 
  //   },
  //   {
  //     id: 2,
  //     tag: "New",
  //     category: "Moisturizers",
  //     name: "Golden Hour Moisturizer",
  //     price: "$98",
  //     img: "https://readdy.ai/api/search-image?query=luxury%20white%20and%20gold%20cream%20jar%20on%20soft%20pink%20beige%20background%2C%20premium%20moisturizer%20product%20photography%2C%20elegant%20beauty%20skincare%20packaging%2C%20subtle%20bokeh%2C%20clean%20minimalist%20style&width=400&height=500&seq=list_moisturizer_02&orientation=portrait"
  //   },
  //   {
  //     id: 3,
  //     tag: null,
  //     category: "Facial Oils",
  //     name: "Midnight Renewal Oil",
  //     price: "$124",
  //     img: "https://readdy.ai/api/search-image?query=amber%20glass%20dropper%20bottle%20facial%20oil%20on%20dark%20background%20with%20soft%20warm%20glow%2C%20luxury%20skincare%20product%20still%20life%20photography%2C%20elegant%20bottle%20with%20golden%20details%2C%20premium%20beauty%20editorial&width=400&height=500&seq=list_oil_03&orientation=portrait"
  //   }
  // ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

    return (
    <div className="bg-[#0a0a0a] text-white font-sans selection:bg-[#c5a059] selection:text-black scroll-smooth">
      
      {/* --- FIXED NAVIGATION BAR --- */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] w-full h-20 transition-all duration-500 ease-in-out px-6 md:px-12 flex items-center justify-between ${
        isScrolled 
          ? "bg-[#0a0a0a]/85 backdrop-blur-xl shadow-2xl" 
          : "bg-transparent"
      }`}>
        {/* 左侧 Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-tr from-orange-400 to-emerald-400 rounded-full opacity-80" />
        </div>
        
        {/* 中间菜单 */}
        <div className="hidden md:flex space-x-10 text-[11px] uppercase tracking-[0.2em] font-light text-gray-300">
          {['About', 'Ingredients','Ritual', 'Collection'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-[#c5a059] transition-colors duration-300">
              {item}
            </a>
          ))}
        </div>

        {/* 右侧交互区域 */}
        <div className="flex gap-6 items-center">
          
          {/* 1. 购物车按钮 (始终显示) */}
          <button onClick={() => setIsCartOpen(true)} className="relative mr-2 group">
            <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 group-hover:text-[#c5a059] transition-colors">
              Cart
            </span>
            {cart.length > 0 && (
              <span className="absolute -top-3 -right-3 bg-[#c5a059] text-black text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </button>

          {/* 2. 用户状态逻辑 */}
          {loggedInUser ? (
            <div className="relative flex items-center gap-4 animate-fadeIn">
              {/* 用户名触发区域 */}
              <div 
                className="flex flex-col items-end cursor-pointer group"
                onClick={() => setIsProfileOpen(!isProfileOpen)} // 点击切换菜单
              >
                <span className="text-[9px] uppercase tracking-[0.2em] text-gray-500 font-light group-hover:text-white transition-colors">The Ritual of</span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] uppercase tracking-[0.2em] text-[#c5a059] font-bold group-hover:text-white transition-colors">
                    {loggedInUser.username}
                  </span>
                  <ChevronDown size={10} className={`text-[#c5a059] transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                </div>
              </div>

              {/* 下拉菜单本体 */}
              {isProfileOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)}></div>
                  
                  <div className="absolute top-12 right-0 w-52 bg-[#111] border border-white/5 rounded-xl shadow-2xl py-3 z-20 animate-fadeInUp overflow-hidden">
                    
                    {/* --- 新增：如果是 Admin，显示 Dashboard 入口 --- */}
                    {loggedInUser.role === 'admin' && (
                      <Link 
                        to="/admin" 
                        className="flex items-center gap-3 px-5 py-3 text-[10px] uppercase tracking-widest text-[#c5a059] hover:bg-[#c5a059]/10 transition-all font-bold border-b border-white/5"
                      >
                        <ShieldCheck size={12} /> Admin Dashboard
                      </Link>
                    )}

                    <Link 
                      to="/order-history" 
                      className="flex items-center gap-3 px-5 py-3 text-[10px] uppercase tracking-widest text-gray-400 hover:bg-white/5 hover:text-[#c5a059] transition-all"
                    >
                      <Clock size={12} /> Order History
                    </Link>
                    
                    <div className="h-[1px] bg-white/5 my-2 mx-4" />
                    
                    <button 
                      onClick={() => { 
                        localStorage.removeItem('user'); 
                        navigate('/'); 
                      }}
                      className="w-full flex items-center gap-3 px-5 py-3 text-[10px] uppercase tracking-widest text-gray-500 hover:text-red-400 transition-all"
                    >
                      <LogOut size={12} /> Exit Ritual
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            /* 状态 B: 用户未登录 (显示 Register 和 Shop Now) */
            <div className="flex items-center gap-6">
              <Link 
                to="/login" 
                className="text-[10px] uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-colors"
              >
                  Login
              </Link>
              
              <a href="#collection" className={`px-8 py-2 text-[10px] uppercase tracking-[0.2em] rounded-full transition-all duration-500 border ${
                isScrolled 
                  ? "bg-[#c5a059] border-[#c5a059] text-black font-bold shadow-lg shadow-[#c5a059]/20" 
                  : "bg-white/10 border-white/20 text-white hover:bg-white hover:text-black"
              }`}>
                Shop Now
              </a>
            </div>
          )}
        </div>
      </nav>

      {/* --- SECTION 1: HERO --- */}
      <header className="min-h-screen flex flex-col">
        <main className="flex-grow flex items-center">
          <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-32 items-center relative py-16">
            <div className="z-10">
              <div className="inline-block border border-[#c5a059]/30 px-4 py-1 rounded-full mb-8">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#c5a059]">Best Seller — New Formula</span>
              </div>
              <h1 className="mb-8">
                <span className="block text-4xl md:text-5xl italic font-serif text-[#c5a059] mb-2">Radiance</span>
                <span className="block text-6xl md:text-8xl font-medium tracking-tight">Redefined</span>
              </h1>
              <p className="max-w-md text-gray-400 text-sm leading-relaxed mb-10 font-light">
                A breakthrough 30ml serum infused with 24K gold micro-particles and tri-peptide complex. 
                Visibly lifts, firms, and illuminates in just 7 days.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-[#c5a059] text-black px-8 py-4 rounded-full text-[11px] uppercase font-bold tracking-widest hover:bg-[#d4b475] transition">Discover Now</button>
                <button className="border border-gray-700 px-8 py-4 rounded-full text-[11px] uppercase tracking-widest hover:border-white transition">Learn More</button>
              </div>
              <div className="mt-20 pt-8 flex gap-8 md:gap-12">
                {[{ label: 'Volume', val: '30ml' }, { label: 'Visible Results', val: '7 Days' }, { label: 'Satisfaction', val: '98%' }].map((stat, i) => (
                  <div key={i}>
                    <div className="text-xl font-medium">{stat.val}</div>
                    <div className="text-[10px] uppercase tracking-tighter text-gray-500">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md aspect-[4/5] overflow-hidden rounded-sm shadow-2xl">
                <img src="/SkincareSystem/112.png" alt="Radiance Serum" className="w-full h-full object-cover" />
                <div className="absolute top-10 -right-4 bg-[#1a1a1a]/90 backdrop-blur-md border border-gray-800 p-4 rounded-lg text-center">
                  <div className="text-[9px] uppercase tracking-widest text-gray-500 mb-1">Starting At</div>
                  <div className="text-2xl font-serif text-[#c5a059]">$148</div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </header>

      {/* --- SECTION 2: ABOUT / MOISTURE --- */}
      <section id="about" className="py-32 px-6 md:px-12 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="relative group order-2 lg:order-1">
            <div className="relative aspect-square overflow-hidden rounded-sm bg-[#1a1a1a]">
              <img src="https://readdy.ai/api/search-image?query=luxury%20white%20cream%20jar%20with%20gold%20lid%20skincare%20moisturizer%20product%20on%20warm%20beige%20background%2C%20elegant%20beauty%20photography%2C%20soft%20diffused%20lighting%20highlighting%20cream%20texture%2C%20premium%20cosmetics%20branding%20still%20life%2C%20minimalist%20aesthetic%20with%20rose%20petals%20and%20botanical%20elements&width=600&height=700&seq=showcase_moisturizer_01&orientation=portrait" alt="Hydration Formula" className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[#c5a059] px-6 py-2 rounded-full shadow-xl text-black text-xs font-bold tracking-widest">
                $98
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start order-1 lg:order-2">
            <div className="inline-block border border-[#c5a059]/40 px-4 py-1 rounded-full mb-6">
              <span className="text-[9px] uppercase tracking-[0.4em] text-[#c5a059]">Deep Hydration</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-serif leading-tight mb-8">
              24-Hour <br /> <span className="italic text-[#c5a059]">Luminous</span> Moisture
            </h2>
            <ul className="space-y-4 mb-12">
              {["Restores moisture barrier", "Plumps fine lines", "Balances skin tone", "Non-comedogenic"].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-[13px] text-gray-300 tracking-wide font-light">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059]" /> {item}
                </li>
              ))}
            </ul>
            <button className="flex items-center gap-4 group">
              {/* 找到 Section 2 里的那个按钮 */}
              <Link to="/formula" className="flex items-center gap-4 group cursor-pointer">
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold border-b border-transparent group-hover:border-[#c5a059] transition-all text-white">
                  Explore Formula
                </span>
                <div className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                  <ArrowRight size={16} />
                </div>
              </Link>
            </button>
          </div>
        </div>
      </section>

      {/* --- SECTION 3: INGREDIENTS --- */}
      <section id="ingredients" className="relative py-32 px-6 md:px-12 bg-gradient-to-b from-[#0a0a0a] via-[#1a1a1a] to-[#f5f2ed]">
        <div className="text-center mb-20">
          <div className="inline-block border border-[#c5a059]/40 px-4 py-1 rounded-full mb-6">
            <span className="text-[9px] uppercase tracking-[0.4em] text-[#c5a059]">Award-Winning</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-serif text-white tracking-tight">The Signature Formula</h2>
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative flex justify-center">
            <div className="relative z-10 w-full max-w-sm overflow-hidden rounded-sm">
              <img src="/SkincareSystem/112.png" alt="Signature Serum" className="w-full h-full object-cover" />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-orange-500/10 blur-[120px] rounded-full" />
          </div>
          <div>
            <h3 className="text-4xl md:text-5xl font-serif text-white/90 mb-6">Radiance Revival Serum</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-10">
              {["24K Gold Particles", "Tri-Peptide Complex", "Bakuchiol Extract", "Marine Collagen"].map((active, i) => (
                <div key={i} className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-3 rounded-md backdrop-blur-sm text-xs text-gray-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#c5a059]" /> {active}
                </div>
              ))}
            </div>
            <div className="flex gap-12 mb-10 items-end text-white">
              <div>
                <span className="text-[9px] uppercase tracking-widest text-gray-500 block mb-2">Price</span>
                <span className="text-2xl font-serif text-[#c5a059]">$148</span>
              </div>
            </div>
            <a href="#ritual" className="bg-[#111] border border-gray-800 text-white px-10 py-4 rounded-full text-[11px] uppercase font-bold tracking-[0.3em] hover:bg-[#c5a059] hover:text-black transition-all duration-500 flex items-center gap-3 w-fit inline-flex">
              Add to Ritual <Plus size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* --- SECTION 4: RITUAL / PACKAGING --- */}
      <section id="ritual" className="bg-[#f5f2ed] text-[#1a1a1a] py-32 px-6 md:px-12 relative overflow-hidden">
        <div className="max-w-3xl mx-auto text-center mb-24">
          <div className="inline-block border border-[#c5a059]/40 px-4 py-1 rounded-full mb-6">
            <span className="text-[9px] uppercase tracking-[0.4em] text-[#c5a059] font-bold">Signature Packaging</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-serif mb-6 tracking-tight text-[#1a1510]">Crafted to Unwrap</h2>
          <p className="text-gray-600 text-sm leading-relaxed max-w-xl mx-auto font-light">
            Every bottle is hand-placed into our iconic matte-black signature box, adorned with gold foil embossing.
          </p>
        </div>

        {/* 使用 lg:translate-x-24 将整个左侧容器向右平移 */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center">
          
          {/* 左侧：包装盒展示部分 */}
          <div className="relative flex justify-center lg:justify-start pt-1 lg:translate-x-50 transition-transform duration-700">
            <div className="relative w-72 h-96 bg-[#1a1510] rounded-t-3xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center p-8">
               <span className="text-[#c5a059] font-serif text-3xl tracking-[0.2em] select-none">UMIÈRE</span>
               <span className="text-[#c5a059]/60 text-[8px] tracking-[0.4em] mt-2 select-none">PARIS</span>
               
               {/* 瓶子图片：稍微伸出盒子左侧 */}
               <div className="absolute -left-12 top-1/2 -translate-y-1/2 w-48 h-55 drop-shadow-2xl hover:scale-105 transition-transform duration-500">
                  <img src="/SkincareSystem/112.png" alt="Packaging Preview" className="w-full h-full object-cover" />
               </div>
            </div>
            
            {/* 装饰性光影效果 */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#c5a059]/5 blur-[100px] rounded-full" />
          </div>

          {/* 右侧：文字说明部分 */}
          <div className="flex flex-col items-start text-[#1a1a1a] z-10">
            <h3 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
              The Gift of <br /> <span className="italic text-[#c5a059]">Luminous Skin</span>
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-10 max-w-md font-light">
              Wrapped in our signature matte black box with 24K gold foil embossing, our products arrive as a gift, ensuring your ritual begins the moment you receive it.
            </p>
            
            <div className="flex flex-wrap gap-x-8 gap-y-4 mb-12">
               <a href="#collection" className="bg-[#1a1510] text-white px-8 py-4 rounded-full text-[10px] uppercase font-bold tracking-widest hover:bg-[#c5a059] transition-all shadow-lg active:scale-95">
                 Shop the collection
               </a>
               <button className="text-[9px] uppercase tracking-[0.2em] font-bold border-b border-gray-300 hover:border-[#c5a059] transition-all pb-1">
                 Gift options
               </button>
            </div>
            
            <div className="grid grid-cols-2 gap-x-12 gap-y-6 w-full pt-8 border-t border-black/5">
              {["Eco-Friendly Box", "Gold Foil Emboss", "Satin Ribbon", "Personal Note"].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-[10px] text-gray-500 uppercase tracking-widest font-medium">
                  <Check size={14} className="text-[#c5a059]" /> {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 5: COLLECTION --- */}
      <section id="collection" className="bg-[#f5f2ed] py-32 px-6 md:px-12 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none select-none">
          <h2 className="text-[15vw] font-serif text-[#1a1510]/5 leading-none uppercase tracking-widest">
            Collection
          </h2>
        </div>

        <div className="max-w-7xl mx-auto relative z-10 text-[#1a1a1a]">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div className="max-w-xl">
              <div className="inline-block border border-[#c5a059]/40 px-4 py-1 rounded-full mb-6">
                <span className="text-[9px] uppercase tracking-[0.4em] text-[#c5a059] font-bold">The Full Ritual</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-serif leading-tight">
                Shop The <br /> Collection
              </h2>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs mb-4">
              Each product in the LUMIÈRE collection is a complete ritual in itself — formulated to transform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => {
              // 判断是否售罄
              const isOutOfStock = product.stock <= 0;

              return (
                <div key={product.id} className="group bg-white flex flex-col h-full relative">
                  {/* 图片容器 */}
                  <div className="relative aspect-square overflow-hidden bg-gray-50 flex items-center justify-center">
                    <img 
                      src={product.image_url || product.img} 
                      alt={product.name}
                      // --- 关键修改：售罄时增加 grayscale(灰度) 和 blur(模糊) ---
                      className={`w-full h-full object-contain transition-transform duration-700 ${
                        isOutOfStock ? 'blur-sm grayscale opacity-60' : 'group-hover:scale-110'
                      }`} 
                    />

                    {/* --- 关键修改：右上角显示 Out of Stock 标签 --- */}
                    {isOutOfStock && (
                      <div className="absolute top-4 right-4 bg-black/80 text-[#c5a059] px-3 py-1 rounded-sm shadow-xl z-20">
                        <span className="text-[9px] uppercase tracking-[0.2em] font-bold">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </div>

                  {/* 产品文字信息 */}
                  <div className="p-8 flex-grow flex flex-col">
                    <span className="text-[9px] uppercase tracking-[0.2em] text-[#c5a059] block mb-2">
                      {product.category}
                    </span>
                    <h3 className="text-xl font-serif mb-8 leading-snug">{product.name}</h3>
                    
                    <div className="flex items-center justify-between mt-auto">
                      <span className={`text-xl font-serif ${isOutOfStock ? 'text-gray-400' : ''}`}>
                        {product.price.toString().startsWith('$') ? product.price : `$${product.price}`}
                      </span>
                      
                      {/* --- 关键修改：如果售罄，禁用按钮并改变样式 --- */}
                      <button 
                        onClick={() => !isOutOfStock && addToCart(product)} 
                        disabled={isOutOfStock}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                          isOutOfStock 
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                            : 'bg-[#1a1510] text-white hover:bg-[#c5a059]'
                        }`}
                      >
                        {isOutOfStock ? <X size={16} /> : <Plus size={18} />}
                      </button>
                    </div>
                    
                    {/* 可选：在下方显示剩余库存提示（针对低库存） */}
                    {!isOutOfStock && product.stock < 10 && (
                      <p className="text-[9px] text-red-500 uppercase mt-2 tracking-widest animate-pulse">
                        Only {product.stock} left in ritual
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-[#050505] text-white pt-24 pb-12 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-20">
            <div className="lg:col-span-4">
              <div className="w-10 h-10 bg-gradient-to-tr from-orange-400 to-emerald-400 rounded-full opacity-80 mb-8" />
              <p className="text-gray-400 text-sm leading-relaxed max-w-sm mb-10 font-light">
                Born in Grasse, France. Crafted with science, infused with nature. LUMIÈRE redefines luxury skincare for the modern ritual.
              </p>
              {/* <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300">
                  <Instagram size={16} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300">
                  <Facebook size={16} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300">
                  <Youtube size={16} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300">
                  <Twitter size={16} />
                </a>
              </div> */}
            </div>

            <div className="lg:col-span-2 text-gray-500">
              <h4 className="text-[10px] uppercase tracking-[0.3em] text-[#c5a059] font-bold mb-8">Ritual</h4>
              <ul className="space-y-4 text-sm font-light">
                {["Morning Routine", "Evening Routine", "Weekly Treatment", "Gift Sets"].map(item => (
                  <li key={item}><a href="#" className="hover:text-white transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-2 text-gray-500">
              <h4 className="text-[10px] uppercase tracking-[0.3em] text-[#c5a059] font-bold mb-8">The House</h4>
              <ul className="space-y-4 text-sm font-light">
                {["Our Story", "Ingredients", "Sustainability", "Press"].map(item => (
                  <li key={item}><a href="#" className="hover:text-white transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-4">
              <h4 className="text-[10px] uppercase tracking-[0.3em] text-[#c5a059] font-bold mb-8">Join the Ritual</h4>
              <p className="text-gray-400 text-sm mb-8 font-light">Receive exclusive skincare rituals, early access to launches, and members-only offers.</p>
              <div className="flex flex-col gap-3">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="bg-white/5 border border-white/10 rounded-full px-6 py-4 text-sm focus:outline-none focus:border-[#c5a059] transition-all"
                />
                <button className="bg-[#c5a059] text-black text-[10px] uppercase font-bold tracking-[0.2em] py-4 rounded-full hover:bg-white transition-all duration-500">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] uppercase tracking-widest text-gray-600">
            <p>© 2026 LUMIÈRE Skincare. All rights reserved.</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Settings</a>
            </div>
          </div>
        </div>
      </footer>

      {/* --- CART DRAWER --- */}
      <div className={`fixed inset-y-0 right-0 w-full md:w-[400px] bg-[#0a0a0a] z-[200] shadow-2xl transform transition-transform duration-500 ease-in-out border-l border-white/5 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-full flex flex-col p-8">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-xl font-serif text-[#c5a059] italic">Your Ritual Cart</h2>
            <button onClick={() => setIsCartOpen(false)} className="text-gray-500 hover:text-white">Close</button>
          </div>

          {/* 购物车列表 */}
          <div className="flex-grow overflow-y-auto space-y-8 pr-2 custom-scrollbar">
            {cart.length === 0 ? (
              <div className="h-40 flex flex-col items-center justify-center text-center">
                <p className="text-gray-600 text-sm italic mb-4">Your ritual is empty.</p>
                <button onClick={() => setIsCartOpen(false)} className="text-[10px] uppercase tracking-widest text-[#c5a059] border-b border-[#c5a059]/30 pb-1">Start Exploring</button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex gap-5 items-center group animate-fadeIn">
                  {/* 商品图片 */}
                  <div className="relative w-20 h-20 bg-white/5 rounded-xl overflow-hidden flex-shrink-0 border border-white/5">
                    <img src={item.image_url || item.img} className="w-full h-full object-contain p-2" alt={item.name} />
                  </div>

                  {/* 商品信息与控制 */}
                  <div className="flex-grow flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <h4 className="text-xs font-serif text-white tracking-wide max-w-[150px] leading-relaxed">{item.name}</h4>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-600 hover:text-red-400 transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </div>
                    
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-[#c5a059] font-serif text-sm">
                        ${(parseFloat(item.price.toString().replace('$', '')) * item.quantity).toFixed(2)}
                      </span>

                      {/* --- 加减控制按钮组 --- */}
                      <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-full px-3 py-1 scale-90 origin-right">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-[#c5a059] transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        
                        <span className="text-[10px] font-bold text-white w-4 text-center">{item.quantity}</span>
                        
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-[#c5a059] transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* 结算部分 */}
          {cart.length > 0 && (
            <div className="pt-8 border-t border-white/10 mt-auto">
              <div className="flex justify-between mb-6">
                <span className="text-[10px] uppercase tracking-widest text-gray-400">Total Ritual</span>
                <span className="text-[#c5a059] font-serif">
                  ${cart.reduce((total, item) => total + (parseInt(item.price.replace('$', '')) * item.quantity), 0)}
                </span>
              </div>
              <button 
                onClick={() => {
                  // 【关键步骤】在跳转前，把当前的 cart 数组存入浏览器本地存储
                  localStorage.setItem('cart', JSON.stringify(cart)); 
                  
                  setIsCartOpen(false);
                  navigate('/checkout');
                }}
                className="w-full bg-[#c5a059] text-black py-4 rounded-full text-[10px] uppercase font-bold tracking-widest hover:bg-white transition-all"
              >
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 背景遮罩层 */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150]" onClick={() => setIsCartOpen(false)} />
      )}
    </div>
  );
};

// --- MAIN APP COMPONENT WITH ROUTING ---
function App() {
  return (
    // 添加 basename 属性，确保路由能识别 GitHub Pages 的子路径
    <Router basename="/SkincareSystem">
      <Toaster 
        position="top-center" 
        toastOptions={{
          duration: 3000,
          style: {
            background: '#111',
            color: '#c5a059',
            border: '1px solid rgba(197, 160, 89, 0.3)',
          }
        }} 
      />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/order-history" element={<OrderHistory />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/formula" element={<FormulaPage />} />
      </Routes>
    </Router>
  );
}

export default App;
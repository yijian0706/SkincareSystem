import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MapPin, CheckCircle2, FlaskConical, Beaker } from 'lucide-react';

const FormulaPage = () => {
  const [activeTab, setActiveTab] = useState(0);

  // 每次进入页面自动回到顶部
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // --- 成分数据配置 ---
  const ingredientsData = [
    {
      id: "gold",
      tabName: "24K GOLD MICRO-PARTICLES",
      title: "24K Gold Micro-Particles",
      description: "Nano-sized gold particles stimulate collagen synthesis and deliver unmatched luminosity deep within the dermis.",
      detail: "Each 30ml bottle contains 0.08g of ethically-sourced 24K gold suspended in our unique carrier matrix. Gold's natural biocompatibility means zero irritation and maximum absorption. Clinical trials show a significant improvement in skin brightness.",
      result: "34% brighter skin",
      location: "MILAN, ITALY",
      img: "https://readdy.ai/api/search-image?query=24k%20gold%20flakes%20and%20powder%20close%20up%20macro%20photography%20on%20black%20velvet%20background%2C%20warm%20golden%20luxury%20texture%2C%20shimmering%20metallic%20particles%2C%20premium%20beauty%20ingredient%20photography%2C%20dramatic%20side%20lighting&width=500&height=600&seq=ing_gold_01&orientation=portrait" 
    },
    {
      id: "peptide",
      tabName: "TRI-PEPTIDE COMPLEX",
      title: "Tri-Peptide Complex",
      description: "A proprietary blend of three essential peptides that mimic the skin's natural regenerative signals.",
      detail: "Our lab-engineered peptides penetrate the surface layer to stimulate fibroblast activity, effectively rebuilding the skin's structural matrix from within for a visible lifting effect.",
      result: "42% firmer contours",
      location: "GRASSE, FRANCE",
      img: "https://readdy.ai/api/search-image?query=abstract%20molecular%20peptide%20chain%20science%20visualization%20on%20dark%20background%20with%20soft%20blue%20teal%20glow%2C%20premium%20beauty%20science%20editorial%2C%20biotechnology%20concept%2C%20elegant%20laboratory%20aesthetic&width=500&height=600&seq=ing_peptide_02&orientation=portrait"
    },
    {
      id: "bakuchiol",
      tabName: "BAKUCHIOL EXTRACT",
      title: "Sytenol® A Bakuchiol",
      description: "The plant-based retinol alternative that delivers all the anti-aging benefits without the irritation.",
      detail: "Sourced from the Psoralea Corylifolia plant, this pure extract stabilizes cellular turnover and targets fine lines while being gentle enough for sensitive skin types and daytime use.",
      result: "Zero irritation",
      location: "KERALA, INDIA",
      img: "https://readdy.ai/api/search-image?query=babchi%20plant%20seeds%20and%20botanical%20extract%20on%20warm%20terracotta%20surface%2C%20macro%20photography%20of%20skincare%20ingredient%2C%20earthy%20natural%20beauty%20concept%2C%20warm%20golden%20sunlight%2C%20premium%20organic%20cosmetics%20ingredient%20photography&width=500&height=600&seq=ing_bakuchiol_03&orientation=portrait"
    }
  ];

  const processSteps = [
  {
    id: "01",
    title: "Extraction",
    subtitle: "ECO-FRIENDLY METHOD",
    description: "Our botanical elements are extracted using a low-temperature CO2 method that preserves the molecular integrity of every active compound.",
    img: "https://readdy.ai/api/search-image?query=botanical%20ingredient%20sourcing%20in%20exotic%20location%2C%20person%20harvesting%20rare%20plant%20ingredients%20golden%20hour%20sunrise%2C%20luxury%20skincare%20brand%20editorial%2C%20warm%20natural%20tones%2C%20organic%20beauty%20documentary%20style%20photography&width=600&height=400&seq=process_sourcing&orientation=landscape"
  },
  {
    id: "02",
    title: "Refinement",
    subtitle: "PURITY GUARANTEED",
    description: "Each extract undergoes a triple-filtration process in our clean-room facility to remove any impurities while concentrating the active essence.",
    img: "https://readdy.ai/api/search-image?query=luxury%20skincare%20laboratory%20scientist%20formulating%20serum%2C%20golden%20toned%20scientific%20glassware%20and%20pipettes%2C%20elegant%20premium%20cosmetic%20lab%20interior%2C%20dark%20warm%20aesthetic%2C%20precision%20chemistry%20beauty%20science&width=600&height=400&seq=process_lab&orientation=landscape"
  },
  {
    id: "03",
    title: "Blending",
    subtitle: "PRECISION MIXOLOGY",
    description: "The base and actives are emulsified at specific RPMs to create a texture that is both ultra-lightweight and incredibly potent.",
    img: "https://readdy.ai/api/search-image?query=luxury%20skincare%20clinical%20dermatology%20testing%20on%20skin%20close%20up%2C%20premium%20beauty%20science%20photography%2C%20clean%20minimalist%20medical%20aesthetic%2C%20warm%20glowing%20skin%20texture%20macro%2C%20advanced%20cosmetic%20technology&width=600&height=400&seq=process_clinical&orientation=landscape"
  },
  {
    id: "04",
    title: "Potency Test",
    subtitle: "CLINICAL VALIDATION",
    description: "Before bottling, every batch is tested for bio-activity to ensure it meets our 100% potency standard for visible results.",
    img: "https://readdy.ai/api/search-image?query=luxury%20glass%20skincare%20serum%20bottles%20on%20production%20line%20close%20up%2C%20premium%20cosmetics%20packaging%20photography%2C%20gold%20caps%20and%20amber%20glass%2C%20dark%20elegant%20factory%20with%20warm%20lighting%2C%20precision%20craftsmanship%20beauty%20brand&width=600&height=400&seq=process_bottle&orientation=landscape"
  }
];

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#c5a059] selection:text-black">
      
      {/* --- BACK BUTTON --- */}
      <Link 
        to="/" 
        className="fixed top-10 left-10 z-50 flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-gray-500 hover:text-[#c5a059] transition-all group"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
        Back to Ritual
      </Link>

      <section className="relative min-h-[110vh] flex items-start justify-center px-6 overflow-hidden pt-48 md:pt-28">
        {/* 背景氛围保持不变 */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://public.readdy.ai/ai/img_res/9eb2c8d6eff1a42b0117130270530e3c.jpg" 
            className="w-full h-full object-cover opacity-30 grayscale brightness-50 scale-110" 
            alt="Lab"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center animate-fadeInUp">
          <span className="text-[10px] uppercase tracking-[0.8em] text-[#c5a059] mb-12 block opacity-80 font-bold">
            LUMIÈRE — Science & Nature
          </span>
          
          <h1 className="mb-14">
            <span className="block text-6xl md:text-9xl font-serif text-white tracking-tighter mb-6">The Art of</span>
            <span className="block text-7xl md:text-[11rem] font-serif italic text-[#c5a059] leading-[0.8] drop-shadow-[0_10px_40px_rgba(197,160,89,0.25)]">The Formula</span>
          </h1>

          <div className="w-24 h-[1px] bg-[#c5a059]/40 mx-auto mb-12 shadow-[0_0_15px_rgba(197,160,89,0.5)]" />
          
          <p className="text-[10px] uppercase tracking-[0.6em] text-gray-500 mb-16 font-light">
            12 Years of Research. One Perfect Serum.
          </p>

          <p className="text-sm md:text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto font-light italic mb-20 px-4 opacity-90">
            "Every LUMIÈRE formula begins in our laboratory in Grasse, France — where science meets 
            the ancient wisdom of botanical alchemy. We fuse the rarest natural actives with precision 
            biotechnology to craft formulas that truly transform skin."
          </p>

          {/* 往下引导的图标 */}
          <div className="animate-bounce opacity-40 mb-8">
             <div className="w-[1px] h-12 bg-gradient-to-b from-[#c5a059] to-transparent mx-auto" />
          </div>
          
          <a href="#actives" className="text-[10px] uppercase tracking-[1em] text-gray-600 hover:text-[#c5a059] transition-all duration-500 border-b border-gray-900 pb-3">
            Scroll to Discover
          </a>
        </div>
      </section>

      {/* --- SECTION 2: KEY INGREDIENTS (第二张图) --- */}
      <section id="actives" className="py-40 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <span className="text-[10px] uppercase tracking-[0.5em] text-[#c5a059] block mb-4 font-bold">Our Actives</span>
          <h2 className="text-5xl md:text-7xl font-serif tracking-tight">Key Ingredients</h2>
          <div className="w-12 h-[1px] bg-[#c5a059] mx-auto mt-8 shadow-[0_0_10px_#c5a059]" />
        </div>

        {/* --- TAB NAVIGATION --- */}
        <div className="flex flex-wrap justify-center gap-4 mb-24">
          {ingredientsData.map((ing, index) => (
            <button
              key={ing.id}
              onClick={() => setActiveTab(index)}
              className={`px-8 py-3 rounded-full text-[9px] uppercase tracking-[0.2em] border transition-all duration-700 ${
                activeTab === index 
                ? "bg-[#c5a059] border-[#c5a059] text-black font-bold shadow-[0_0_25px_rgba(197,160,89,0.3)]" 
                : "border-white/10 text-gray-500 hover:border-white/30 hover:text-white"
              }`}
            >
              {ing.tabName}
            </button>
          ))}
        </div>

        {/* --- DYNAMIC CONTENT AREA --- */}
        <div key={activeTab} className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center animate-fadeInUp">
          
          {/* LEFT: Image with Location */}
          <div className="relative group">
            <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-[#111] border border-white/5 shadow-2xl">
              <img 
                src={ingredientsData[activeTab].img} 
                className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110" 
                alt={ingredientsData[activeTab].title} 
              />
              {/* 地图定位点效果 */}
              <div className="absolute bottom-8 left-8 flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                <div className="w-2 h-2 bg-[#c5a059] rounded-full animate-ping" />
                <span className="text-[10px] uppercase tracking-[0.2em] text-white/80">
                   {ingredientsData[activeTab].location}
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT: Text Details */}
          <div className="flex flex-col items-start lg:pl-10">
            <div className="flex items-center gap-3 mb-8">
               <FlaskConical size={14} className="text-[#c5a059]" />
               <span className="text-[10px] uppercase tracking-[0.3em] text-[#c5a059] font-bold">
                 Active Ingredient
               </span>
            </div>
            
            <h3 className="text-5xl font-serif mb-8 text-white/95 leading-tight tracking-tight">
              {ingredientsData[activeTab].title}
            </h3>
            
            <p className="text-xl text-gray-300 font-light italic leading-relaxed mb-8 border-l-2 border-[#c5a059]/30 pl-6">
              {ingredientsData[activeTab].description}
            </p>
            
            <p className="text-base text-gray-500 leading-relaxed mb-12 font-light">
              {ingredientsData[activeTab].detail}
            </p>

            {/* PROVEN RESULT BOX */}
            <div className="w-full bg-gradient-to-r from-white/5 to-transparent border border-white/10 rounded-2xl p-8 flex items-center gap-8 group hover:border-[#c5a059]/30 transition-colors">
              <div className="w-14 h-14 rounded-full bg-[#c5a059]/10 flex items-center justify-center border border-[#c5a059]/20 group-hover:bg-[#c5a059]/20 transition-all">
                <CheckCircle2 size={24} className="text-[#c5a059]" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 block mb-1">Clinically Proven</span>
                <span className="text-2xl font-serif text-[#c5a059] tracking-tight">{ingredientsData[activeTab].result}</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* --- SECTION 3: OUR PROCESS (紧凑强化版) --- */}
      <section id="process" className="py-20 px-6 md:px-12 bg-[#080808]">
        <div className="max-w-5xl mx-auto"> {/* 容器宽度从 7xl 缩减到 5xl，让内容更聚拢 */}
          
          {/* 标题部分 - 减少下边距 */}
          <div className="text-center mb-20">
            <span className="text-[9px] uppercase tracking-[0.5em] text-[#c5a059] block mb-2 font-bold">The Craftsmanship</span>
            <h2 className="text-3xl md:text-4xl font-serif tracking-tight">Our Process</h2>
            <div className="w-10 h-[1px] bg-[#c5a059]/50 mx-auto mt-4" />
          </div>

          {/* 流程迭代 - space-y 从原来的 80/48 缩小到 16/24 */}
          <div className="space-y-24 md:space-y-32"> 
            {processSteps.map((step, index) => (
              <div 
                key={step.id} 
                className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center"
              >
                {/* 图片部分 */}
                <div className={`w-full group overflow-hidden rounded-xl ${
                  index % 2 !== 0 ? 'md:order-last' : 'md:order-first'
                }`}>
                  <img 
                    src={step.img} 
                    alt={step.title}
                    className="w-full aspect-[16/10] md:aspect-[4/3] object-cover grayscale-[0.2] transition-all duration-[1.5s] group-hover:scale-105"
                  />
                </div>

                {/* 文字部分 - 移除所有 padding 让它紧贴图片间隙 */}
                <div className="w-full space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-serif italic text-[#c5a059]/30">{step.id}</span>
                    <div className="h-[1px] w-8 bg-[#c5a059]/20" />
                  </div>
                  
                  <div>
                    <span className="text-[8px] uppercase tracking-[0.3em] text-gray-500 block mb-1 font-bold">
                      {step.subtitle}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-serif text-white tracking-tight">
                      {step.title}
                    </h3>
                  </div>

                  <p className="text-gray-400 text-sm leading-relaxed font-light italic max-w-sm">
                    "{step.description}"
                  </p>

                  <div className="pt-3 flex items-center gap-3 border-t border-white/5">
                    <Beaker size={12} className="text-gray-600" />
                    <span className="text-[8px] uppercase tracking-[0.2em] text-gray-600">LUMIÈRE Lab Standard</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* --- FOOTER CTA --- */}
      <section className="py-40 text-center bg-gradient-to-t from-[#0a0a0a] to-transparent">
        <h4 className="text-2xl font-serif italic text-gray-400 mb-10">Experience the Alchemy</h4>
        <Link to="/#collection" className="bg-[#c5a059] text-black px-12 py-5 rounded-full text-[11px] uppercase font-bold tracking-[0.3em] hover:bg-white transition-all shadow-2xl">
           Back to Collection
        </Link>
      </section>

    </div>
  );
};

export default FormulaPage;
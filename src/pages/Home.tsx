import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Banknote, FileText, Star, MapPin, Phone, Car, Gauge, Fuel, Cog, Settings2, Compass, ExternalLink, Instagram, Video, ChevronDown } from 'lucide-react';
import { formatPrice, MOCK_REVIEWS } from '../data/mockData';
import { useVehicles } from '../context/VehicleContext';
import { Helmet } from 'react-helmet-async';

const CARD_THEMES = [
  {
    glow: "hover:border-white/50 hover:shadow-lg hover:shadow-white/5",
    textHover: "group-hover:text-white",
    price: "text-white",
    badge: "text-white border-white/20 bg-white/10 shadow-sm backdrop-blur-md",
    btn: "group-hover:border-white group-hover:text-zinc-950 group-hover:bg-white group-hover:shadow-sm",
    icon: "text-white",
    border: "border-white/10 hover:border-white/30"
  },
  {
    glow: "hover:border-zinc-300/50 hover:shadow-lg hover:shadow-zinc-300/5",
    textHover: "group-hover:text-zinc-200",
    price: "text-white",
    badge: "text-zinc-300 border-zinc-300/20 bg-white/10 shadow-sm backdrop-blur-md",
    btn: "group-hover:border-zinc-300 group-hover:text-zinc-950 group-hover:bg-zinc-200 group-hover:shadow-sm",
    icon: "text-zinc-300",
    border: "border-white/10 hover:border-zinc-300/30"
  },
  {
    glow: "hover:border-zinc-400/50 hover:shadow-lg hover:shadow-zinc-400/5",
    textHover: "group-hover:text-zinc-300",
    price: "text-white",
    badge: "text-zinc-400 border-zinc-400/20 bg-white/10 shadow-sm backdrop-blur-md",
    btn: "group-hover:border-zinc-400 group-hover:text-zinc-950 group-hover:bg-zinc-300 group-hover:shadow-sm",
    icon: "text-zinc-400",
    border: "border-white/10 hover:border-zinc-400/30"
  },
  {
    glow: "hover:border-zinc-500/50 hover:shadow-lg hover:shadow-zinc-500/5",
    textHover: "group-hover:text-zinc-400",
    price: "text-white",
    badge: "text-zinc-500 border-zinc-500/20 bg-white/10 shadow-sm backdrop-blur-md",
    btn: "group-hover:border-zinc-500 group-hover:text-zinc-950 group-hover:bg-zinc-400 group-hover:shadow-sm",
    icon: "text-zinc-500",
    border: "border-white/10 hover:border-zinc-500/30"
  }
];

export default function Home() {
  const { vehicles, siteConfig, loading } = useVehicles();
  const featuredCars = vehicles.filter(v => v.status === 'Available').slice(0, 3);
  
  const siteUrl = "https://instagram.com/team_cartronics";
  const defaultDesc = "Cartronics | Explore premium pre-owned vehicles at Mumbai's premier enthusiast showroom. Quality inventory, transparent pricing and an enthusiast-focused buying experience.";

  return (
    <div className="flex flex-col min-h-screen bg-transparent text-zinc-300 font-sans">
      <Helmet>
        <title>Cartronics | Premium Pre-Owned Cars Mumbai</title>
        <meta name="description" content={defaultDesc} />
        <meta property="og:title" content="Cartronics | Premium Pre-Owned Cars Mumbai" />
        <meta property="og:description" content={defaultDesc} />
        <meta property="og:image" content={siteConfig.homeHeroImage} />
        <meta property="og:url" content={siteUrl} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      {/* Hero Space - Styled with quick action buttons using black and white minimalist style positioned higher */}
      <section className="relative min-h-[80vh] sm:min-h-[85vh] lg:min-h-[88vh] flex flex-col items-center justify-end pb-28 sm:pb-64 lg:pb-80 overflow-hidden px-4 text-center z-20">
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center w-full">
          
          <div className="relative z-30 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full max-w-xs sm:max-w-xl mx-auto">
            <div className="relative group w-[185px] sm:w-[195px] hover:scale-105 active:scale-95 transition-all duration-300">
              <Link 
                to="/inventory" 
                className="relative z-0 flex items-center justify-center w-full h-10 sm:h-12 bg-black/60 hover:bg-white text-white hover:text-black border border-white/30 hover:border-white backdrop-blur-md font-bold tracking-wide uppercase text-[10px] sm:text-xs font-mono rounded-xl transition-all duration-300 text-center overflow-hidden shadow-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]"
              >
                {/* Clean, perfectly integrated circulating trace */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-300" fill="none">
                  <rect 
                    x="1" 
                    y="1" 
                    width="calc(100% - 2px)" 
                    height="calc(100% - 2px)" 
                    rx="11" 
                    pathLength="100"
                    className="circulating-ring stroke-white group-hover:stroke-black stroke-[2px] opacity-100" 
                  />
                </svg>
                <span className="relative z-10">Explore Collection</span>
              </Link>
            </div>

            <div className="relative group w-[185px] sm:w-[195px] hover:scale-105 active:scale-95 transition-all duration-300">
              <Link 
                to="/sell" 
                className="relative z-0 flex items-center justify-center w-full h-10 sm:h-12 bg-black/60 hover:bg-white text-white hover:text-black border border-white/30 hover:border-white backdrop-blur-md font-bold tracking-wide uppercase text-[10px] sm:text-xs font-mono rounded-xl transition-all duration-300 text-center overflow-hidden shadow-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]"
              >
                {/* Clean, perfectly integrated circulating trace */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-300" fill="none">
                  <rect 
                    x="1" 
                    y="1" 
                    width="calc(100% - 2px)" 
                    height="calc(100% - 2px)" 
                    rx="11" 
                    pathLength="100"
                    className="circulating-ring stroke-white group-hover:stroke-black stroke-[2px] opacity-80 group-hover:opacity-100" 
                  />
                </svg>
                <span className="relative z-10">Sell Your Car</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="pt-20 pb-12 sm:py-16 bg-transparent relative z-10">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
            <span className="text-zinc-400 tracking-[0.2em] uppercase text-[10px] sm:text-xs font-bold mb-2 block font-mono">Certified Quality Standards</span>
            <h2 className="text-2xl sm:text-3xl font-sans text-white tracking-tight font-bold">Uncompromising Assurance</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { icon: ShieldCheck, title: "Rigorous Checks", desc: "Multi-point mechanical, structural, and aesthetic certification on every vehicle." },
              { icon: Banknote, title: "Transparent Pricing", desc: "Upfront, fair market pricing with zero hidden fees or sales pressure." },
              { icon: Car, title: "Custom Financing", desc: "Tailored auto loan packages from leading premium banking partners." },
              { icon: FileText, title: "Pristine Transfer", desc: "Complete hassle-free management of RTO transfers and ownership paperwork." }
            ].map((feature, i) => (
              <div key={i} className="group relative bg-zinc-950/40 border border-white/5 hover:border-white/15 hover:bg-zinc-950/60 transition-all duration-300 p-5 rounded-xl flex flex-col items-center text-center shadow-lg backdrop-blur-md">
                <div className="w-12 h-12 bg-zinc-900/65 border border-white/10 group-hover:border-white/25 group-hover:bg-zinc-950/80 transition-all duration-300 flex items-center justify-center mb-4 rounded-xl shadow-sm backdrop-blur-md">
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xs font-bold tracking-widest text-white mb-2 uppercase font-mono">{feature.title}</h3>
                <p className="text-zinc-400 text-xs leading-relaxed font-light">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="pt-4 sm:pt-8 pb-16 sm:pb-24 bg-transparent animate-fade-in relative z-10">
         <div className="container mx-auto max-w-7xl px-4">
           <div className="text-center mb-10 sm:mb-20">
             <h2 className="text-2xl sm:text-3xl font-serif text-white tracking-tight font-bold">Client Testimonials</h2>
             <div className="w-16 sm:w-24 h-[1px] bg-white/20 mx-auto mt-3 sm:mt-4"></div>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-10">
             {MOCK_REVIEWS.map((review, i) => {
               const hoverBorders = [
                 "hover:border-white/40 hover:shadow-lg hover:shadow-white/5",
                 "hover:border-zinc-400/40 hover:shadow-lg hover:shadow-zinc-400/5",
                 "hover:border-zinc-500/40 hover:shadow-lg hover:shadow-zinc-500/5"
               ];
               const starColors = ["text-white", "text-zinc-300", "text-zinc-400"];
              
              return (
                <div key={review.id} className={`bg-zinc-900/55 border border-zinc-900 p-5 sm:p-8 rounded-xl sm:rounded-2xl flex flex-col justify-between h-full transition-all duration-300 shadow-sm backdrop-blur-md ${hoverBorders[i % 3]}`}>
                  <div>
                    <div className="flex mb-3 sm:mb-6 space-x-1">
                      {[...Array(review.rating)].map((_, idx) => (
                        <Star key={idx} className="w-3.5 h-3.5 fill-current text-amber-500" />
                      ))}
                    </div>
                    <p className="text-zinc-300 italic text-xs sm:text-sm md:text-base leading-relaxed mb-4 sm:mb-8 flex-grow">"{review.text}"</p>
                  </div>
                  <div className="border-t border-zinc-800/80 pt-3.5 sm:pt-5 flex justify-between items-center font-mono">
                    <div>
                      <p className="font-sans font-bold text-white uppercase tracking-wider text-xs mb-1">{review.name}</p>
                      <p className="text-[10px] text-zinc-500 tracking-wider">{review.date}</p>
                    </div>
                    <span className="text-[9px] sm:text-[10px] bg-white/10 text-white font-bold px-2 py-0.5 rounded border border-white/15 font-mono">Verified</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 sm:mt-16 flex justify-center">
            <a 
              href="https://share.google/lolTXlsqZR1EaCrGJ" 
              target="_blank" 
              rel="noreferrer"
              className="group flex items-center justify-between gap-4 sm:gap-6 px-6 sm:px-8 py-3.5 sm:py-4 bg-black/60 border border-white/20 hover:border-white text-white hover:bg-white hover:text-black rounded-full text-[11px] sm:text-xs font-bold tracking-[0.15em] sm:tracking-[0.2em] uppercase font-mono transition-all duration-500 hover:scale-[1.03] active:scale-95 shadow-xl hover:shadow-white/10 max-w-md w-full sm:w-auto"
            >
              <div className="flex items-center gap-2.5 sm:gap-3">
                <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current text-white group-hover:text-black transition-colors" />
                <span>Write or View Google Reviews</span>
              </div>
              <span className="text-sm font-light transition-transform duration-300 group-hover:translate-x-1.5">→</span>
            </a>
          </div>

        </div>
      </section>

      {/* Instagram Reels Showcase Section */}
      {siteConfig.instagramReels && siteConfig.instagramReels.length > 0 && (
        <section className="py-24 bg-transparent relative z-10 border-t border-zinc-900/40">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="text-center mb-16">
              <span className="text-zinc-400 tracking-[0.2em] uppercase text-xs font-bold mb-3 block font-mono">Social Showcase</span>
              <h2 className="text-3xl md:text-4xl font-serif text-white tracking-tight font-bold">Featured Instagram Highlights</h2>
              <div className="w-24 h-[1px] bg-white/20 mx-auto mt-4"></div>
              <p className="text-zinc-[400] text-xs mt-3 uppercase tracking-wider font-mono">
                Interactive video reels direct from our linked{" "}
                <a 
                  href="https://www.instagram.com/team_cartronics/" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-white underline hover:text-zinc-400 transition-all font-bold"
                >
                  @team_cartronics
                </a>{" "}
                channel
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center items-stretch">
              {siteConfig.instagramReels.map((url, idx) => {
                const match = url.match(/(?:\/p\/|\/reel\/|\/tv\/)([A-Za-z0-9_-]+)/);
                const reelId = match ? match[1] : null;
                
                if (!reelId) return null;
  
                const themeColors = [
                  "border-white/10 hover:border-white/30 hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]",
                  "border-zinc-400/10 hover:border-zinc-400/30 hover:shadow-[0_0_15px_rgba(160,160,160,0.05)]",
                  "border-zinc-600/10 hover:border-zinc-600/30 hover:shadow-[0_0_15px_rgba(120,120,120,0.05)]"
                ];

                return (
                  <div key={idx} className={`border bg-zinc-900/35 backdrop-blur-md rounded-2xl p-4 flex flex-col justify-between hover:shadow-xl hover:shadow-black/55 transition-all duration-300 ${themeColors[idx % themeColors.length]}`}>
                    <div className="relative w-full aspect-[9/16] rounded-xl overflow-hidden bg-zinc-950/60 shadow-inner">
                      <iframe 
                        src={`https://www.instagram.com/reel/${reelId}/embed`}
                        className="absolute inset-0 w-full h-full border-0 rounded-xl"
                        allowtransparency="true"
                        allow="encrypted-media"
                        scrolling="no"
                      />
                    </div>
                    <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between font-mono text-[9px] text-zinc-500 uppercase tracking-widest px-1">
                      <span className="flex items-center gap-1.5"><Video className="w-3.5 h-3.5 text-white" /> Reel #{idx + 1}</span>
                      <a href={url} target="_blank" rel="noreferrer" className="text-white hover:text-zinc-400 flex items-center gap-1 font-bold">
                        PLAY ON APP <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section className="py-20 flex flex-col justify-center items-center bg-transparent border-t border-zinc-900/40 relative overflow-hidden z-10">
        {/* Background elements */}
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-white/1 blur-[120px] rounded-full pointer-events-none -translate-y-1/2"></div>
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-white/1 blur-[120px] rounded-full pointer-events-none -translate-y-1/2"></div>
 
        <div className="w-full max-w-4xl flex flex-col justify-center px-8 text-center relative z-10">
          <span className="text-zinc-400 tracking-[0.2em] uppercase text-xs font-bold mb-4 block font-mono">Our Showroom</span>
          <h2 className="text-4xl md:text-5xl font-serif text-white font-bold mb-16 tracking-tight">Visit Us In-Person</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
            <div className="flex flex-col items-center bg-zinc-900/55 p-10 rounded-2xl border border-zinc-900 hover:border-white/30 transition-all duration-500 shadow-sm hover:shadow-md backdrop-blur-md text-zinc-300">
              <div className="bg-white/5 p-4 rounded-full mb-6">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-sans tracking-widest text-[11px] uppercase text-zinc-500 mb-4 font-mono font-bold">Showroom Address</h3>
              <p className="text-zinc-300 text-base leading-relaxed tracking-wide font-light">
                Shop No 10, Neel Empire,<br/>
                Sector 25, Nerul East,<br/>
                Navi Mumbai, Maharashtra 400706
              </p>
              <a 
                href="https://www.google.com/maps/place/Cartronics+-+Car+Dealers/@19.0232457,73.0226216,17z/data=!3m1!4b1!4m6!3m5!1s0x3be7c3df9dbfffff:0x66315419caf903f0!8m2!3d19.0232457!4d73.0226216!16s%2Fg%2F11h_tv31lj?entry=ttu&g_ep=EgoyMDI2MDYyNC4wIKXMDSoASAFQAw%3D%3D" 
                target="_blank" 
                rel="noreferrer" 
                className="mt-8 text-white hover:text-zinc-400 text-xs tracking-widest uppercase font-mono border-b border-white/40 hover:border-white pb-1 transition-all inline-flex items-center gap-2"
              >
                <span>Get Directions</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            
            <div className="flex flex-col items-center bg-zinc-900/55 p-10 rounded-2xl border border-zinc-900 hover:border-white/30 transition-all duration-500 shadow-sm hover:shadow-md backdrop-blur-md text-zinc-300">
              <div className="bg-white/5 p-4 rounded-full mb-6">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-sans tracking-widest text-[11px] uppercase text-zinc-500 mb-4 font-mono font-bold">Contact Us</h3>
              <a href="tel:+919076012999" className="text-zinc-200 text-2xl tracking-wide hover:text-white transition-all font-mono font-bold my-auto">+91 90760 12999</a>
              <a 
                href="tel:+919076012999" 
                className="mt-8 text-white hover:text-zinc-400 text-xs tracking-widest uppercase font-mono border-b border-white/40 hover:border-white pb-1 transition-all"
              >
                Call Now
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

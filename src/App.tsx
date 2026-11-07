/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, MapPin, ChevronDown, Search, Heart, User, 
  Bed, Bath, Square, ArrowRight, ShieldCheck, Award, 
  TrendingUp, Phone, Mail, CheckCircle2, X, Star, 
  SlidersHorizontal, Home, DollarSign, Calendar, Sparkles,
  Compass, Eye, Play, ChevronRight, Check, IndianRupee,
  Briefcase, Calculator, FileText, PieChart, Download, Wrench,
  Layers, Percent, Shield, Activity, ExternalLink, ArrowUpRight
} from 'lucide-react';

const FRAME_COUNT = 192;

const getFrameUrl = (index: number) => {
  const paddedIndex = String(index + 1).padStart(4, '0');
  return `/frames/frame_${paddedIndex}.webp`;
};

// Formatter for Indian Currency (₹ Lakhs & Crores)
const formatIndianCurrency = (amount: number, isMonthly = false) => {
  if (isMonthly) {
    return `₹${amount.toLocaleString('en-IN')}`;
  }
  if (amount >= 10000000) {
    const cr = (amount / 10000000).toFixed(2).replace(/\.00$/, '');
    return `₹${cr} Cr`;
  }
  if (amount >= 100000) {
    const lakh = (amount / 100000).toFixed(2).replace(/\.00$/, '');
    return `₹${lakh} Lakh`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
};

interface Property {
  id: string;
  title: string;
  tagline: string;
  type: 'Villa' | 'Apartment' | 'Penthouse' | 'Townhouse';
  category: 'buy' | 'rent';
  price: number;
  location: string;
  beds: number;
  baths: number;
  sqft: number;
  image: string;
  featured?: boolean;
  description: string;
  amenities: string[];
}

const PROPERTIES: Property[] = [
  {
    id: '1',
    title: 'The Horizon Glass Villa',
    tagline: 'Modern architectural masterpiece with panoramic valley and garden views',
    type: 'Villa',
    category: 'buy',
    price: 38500000, // ₹3.85 Cr
    location: 'Worli Sea Face, Mumbai',
    beds: 5,
    baths: 6,
    sqft: 6200,
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=95&w=2400',
    featured: true,
    description: 'Designed by internationally renowned architects, this bespoke luxury residence features floor-to-ceiling double-glazed thermal glass walls, a cantilevered infinity edge pool, Italian marble flooring, and private terraced gardens.',
    amenities: ['Infinity Edge Pool', 'Smart Home Automation', 'Wine Tasting Cellar', 'Private Sea-Deck Terrace', 'Steam & Sauna', 'Double-Height Ceilings']
  },
  {
    id: '2',
    title: 'Aurelia Sky Penthouse',
    tagline: 'Exquisite city sanctuary with private rooftop terrace and direct elevator',
    type: 'Penthouse',
    category: 'buy',
    price: 29500000, // ₹2.95 Cr
    location: 'Golf Links, South Delhi',
    beds: 3,
    baths: 3,
    sqft: 3400,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=95&w=2400',
    featured: true,
    description: 'Offering breathtaking 360-degree city skyline views, private keyed elevator access, bespoke Statuario marble finishes, and a 1,200 sqft private landscaped rooftop deck.',
    amenities: ['Private Keyed Elevator', 'Statuario Marble Baths', 'Landscaped Rooftop', '24/7 Concierge', 'Skyline Vistas']
  },
  {
    id: '3',
    title: 'Solstice Coastal Villa',
    tagline: 'Direct oceanfront living with private golden beach access',
    type: 'Villa',
    category: 'rent',
    price: 185000, // ₹1,85,000 / mo
    location: 'Candolim, North Goa',
    beds: 4,
    baths: 5,
    sqft: 4800,
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=95&w=2400',
    featured: true,
    description: 'Wake up to the sound of ocean waves. Fully serviced luxury beachfront villa featuring expansive teakwood sun decks, private plunge pool, and gourmet open-air chef kitchen.',
    amenities: ['Direct Beach Access', 'Oceanfront Teak Deck', 'Outdoor Plunge Pool', 'Gourmet Chef Kitchen', 'Private Security']
  },
  {
    id: '4',
    title: 'Verde Botanical Townhouse',
    tagline: 'Sustainable modern luxury nestled in a quiet prestigious enclave',
    type: 'Townhouse',
    category: 'buy',
    price: 16500000, // ₹1.65 Cr
    location: 'Indiranagar, Bengaluru',
    beds: 3,
    baths: 3,
    sqft: 2700,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=95&w=2400',
    featured: false,
    description: 'Eco-conscious design meets refined modern elegance with rooftop solar power, private central courtyard, double-height living spaces, and custom white oak millwork.',
    amenities: ['Rooftop Solar Array', 'Central Courtyard', 'Double-Height Living', 'Custom Oak Millwork', 'EV Fast Charger']
  },
  {
    id: '5',
    title: 'Alpine Crest Chalet',
    tagline: 'Pine-forested mountain estate with heated indoor plunge pool',
    type: 'Villa',
    category: 'rent',
    price: 240000, // ₹2,40,000 / mo
    location: 'Mashobra, Shimla Hills',
    beds: 6,
    baths: 7,
    sqft: 7100,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=95&w=2400',
    featured: false,
    description: 'The ultimate Himalayan getaway. Featuring hand-hewn cedar beams, massive natural stone fireplaces, temperature-controlled plunge pool, and panoramic snow-peak views.',
    amenities: ['Snow Peak Views', 'Heated Indoor Pool', 'Stone Fireplace', 'Wine Cellar', 'Private Chef Service']
  },
  {
    id: '6',
    title: 'Metropolitan High-Rise Loft',
    tagline: 'Industrial chic high-ceiling modern residence with river views',
    type: 'Apartment',
    category: 'rent',
    price: 75000, // ₹75,000 / mo
    location: 'Bandra West, Mumbai',
    beds: 2,
    baths: 2,
    sqft: 1850,
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=95&w=2400',
    featured: false,
    description: 'Boutique architectural loft featuring exposed artisanal brickwork, 13ft ceilings, floor-to-ceiling acoustic glass, and designer mood lighting overlooking the sea.',
    amenities: ['13ft High Ceilings', 'Artisanal Brickwork', 'Acoustic Glass', 'Sea View Deck', 'Fitness Center & Spa']
  }
];

export default function App() {
  // Navigation & Filtering State
  const [activeTab, setActiveTab] = useState<'all' | 'buy' | 'rent'>('all');
  const [selectedLocation, setSelectedLocation] = useState('All Cities');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedPriceRange, setSelectedPriceRange] = useState('Any Price');
  const [searchQuery, setSearchQuery] = useState('');

  // Interactive UI State
  const [favorites, setFavorites] = useState<string[]>(['1']);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showFavoritesDrawer, setShowFavoritesDrawer] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isNavScrolled, setIsNavScrolled] = useState(false);

  // MANAGE PROPERTY MODULE STATE
  const [showManageModal, setShowManageModal] = useState(false);
  const [manageActiveTab, setManageActiveTab] = useState<'overview' | 'leases' | 'services'>('overview');

  // RESOURCES MODULE STATE
  const [showResourcesModal, setShowResourcesModal] = useState(false);
  const [resourcesActiveTab, setResourcesActiveTab] = useState<'calculator' | 'reports' | 'advisory'>('calculator');

  // EMI & WEALTH ADVISORY CALCULATOR STATE
  const [calcPrice, setCalcPrice] = useState(38500000); // ₹3.85 Cr
  const [calcDownPaymentPercent, setCalcDownPaymentPercent] = useState(20); // 20%
  const [calcTenureYears, setCalcTenureYears] = useState(20); // 20 Years
  const [calcInterestRate, setCalcInterestRate] = useState(8.5); // 8.5%

  // Real-time Mortgage & Yield Math
  const loanPrincipal = calcPrice * (1 - calcDownPaymentPercent / 100);
  const monthlyRate = calcInterestRate / 12 / 100;
  const totalMonths = calcTenureYears * 12;
  const calculatedEmi = Math.round(
    (loanPrincipal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
    (Math.pow(1 + monthlyRate, totalMonths) - 1)
  );
  const totalLoanRepayment = calculatedEmi * totalMonths;
  const totalInterestPayable = totalLoanRepayment - loanPrincipal;

  // Hero Canvas & Scroll Animation References
  const heroRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(FRAME_COUNT).fill(null));
  const loadedRef = useRef<boolean[]>(new Array(FRAME_COUNT).fill(false));
  const currentFrameRef = useRef<number>(0);
  const targetFrameRef = useRef<number>(0);
  const animFrameIdRef = useRef<number | null>(null);
  const lastRenderedIndexRef = useRef<number>(-1);
  const [heroProgress, setHeroProgress] = useState(0);
  const [currentFrameDisplay, setCurrentFrameDisplay] = useState(1);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(f => f !== id));
      showToast('Removed from saved collection');
    } else {
      setFavorites([...favorites, id]);
      showToast('Added to saved collection');
    }
  };

  const scrollToProperties = () => {
    const el = document.getElementById('properties-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  // Canvas Scroll-Based Animation Setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const updateCanvasSize = () => {
      // Allow up to 3x DPR for true 4K UHD and Retina rendering
      const dpr = Math.min(window.devicePixelRatio || 1, 3);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      lastRenderedIndexRef.current = -1;
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    const renderFrame = (index: number) => {
      let imgToDraw: HTMLImageElement | null = null;

      if (loadedRef.current[index] && imagesRef.current[index]) {
        imgToDraw = imagesRef.current[index];
      } else {
        // Fallback to nearest loaded frame
        for (let i = index; i >= 0; i--) {
          if (loadedRef.current[i] && imagesRef.current[i]) {
            imgToDraw = imagesRef.current[i];
            break;
          }
        }
        if (!imgToDraw) {
          for (let i = index; i < FRAME_COUNT; i++) {
            if (loadedRef.current[i] && imagesRef.current[i]) {
              imgToDraw = imagesRef.current[i];
              break;
            }
          }
        }
      }

      if (!imgToDraw || !imgToDraw.complete || imgToDraw.naturalWidth === 0) return;

      const cw = canvas.width;
      const ch = canvas.height;
      const iw = imgToDraw.naturalWidth;
      const ih = imgToDraw.naturalHeight;

      // Aspect ratio "cover" algorithm
      const scale = Math.max(cw / iw, ch / ih);
      const dw = iw * scale;
      const dh = ih * scale;
      const dx = (cw - dw) / 2;
      const dy = (ch - dh) / 2;

      // 4K Ultra-High-Definition Rendering Configuration
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      ctx.drawImage(imgToDraw, dx, dy, dw, dh);
      lastRenderedIndexRef.current = index;
    };

    // Preload all 192 frames asynchronously with decode
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.src = getFrameUrl(i);

      const onReady = () => {
        loadedRef.current[i] = true;
        imagesRef.current[i] = img;
        const activeIdx = Math.round(currentFrameRef.current);
        if (i === 0 && lastRenderedIndexRef.current === -1) {
          renderFrame(0);
        } else if (i === activeIdx) {
          renderFrame(activeIdx);
        }
      };

      if ('decode' in img) {
        img.decode().then(onReady).catch(() => {
          img.onload = onReady;
        });
      } else {
        img.onload = onReady;
      }

      imagesRef.current[i] = img;
    }

    // Scroll listener calculates progress specifically through the Hero container
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsNavScrolled(scrollY > 80);

      const heroEl = heroRef.current;
      if (!heroEl) return;

      const heroRect = heroEl.getBoundingClientRect();
      const heroHeight = heroRect.height;
      const maxHeroScroll = heroHeight - window.innerHeight;
      
      const progress = maxHeroScroll > 0 
        ? Math.min(Math.max(-heroRect.top / maxHeroScroll, 0), 1) 
        : 0;

      setHeroProgress(progress);
      targetFrameRef.current = progress * (FRAME_COUNT - 1);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Smooth lerp animation loop
    const tick = () => {
      const diff = targetFrameRef.current - currentFrameRef.current;
      if (Math.abs(diff) > 0.001) {
        currentFrameRef.current += diff * 0.14;
      } else {
        currentFrameRef.current = targetFrameRef.current;
      }

      const rounded = Math.round(currentFrameRef.current);
      if (rounded !== lastRenderedIndexRef.current) {
        renderFrame(rounded);
        setCurrentFrameDisplay(rounded + 1);
      }

      animFrameIdRef.current = requestAnimationFrame(tick);
    };

    animFrameIdRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      window.removeEventListener('scroll', handleScroll);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, []);

  // Filter properties with Indian currency boundaries
  const filteredProperties = PROPERTIES.filter(p => {
    if (activeTab !== 'all' && p.category !== activeTab) {
      return false;
    }
    if (selectedLocation !== 'All Cities' && !p.location.toLowerCase().includes(selectedLocation.toLowerCase())) {
      return false;
    }
    if (selectedType !== 'All Types' && p.type !== selectedType) {
      return false;
    }
    // Indian Currency Filter (₹ Crores)
    if (selectedPriceRange === '2Cr' && p.price > 20000000) return false;
    if (selectedPriceRange === '5Cr' && (p.price <= 20000000 || p.price > 50000000)) return false;
    if (selectedPriceRange === 'Above5Cr' && p.price <= 50000000) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return p.title.toLowerCase().includes(q) || 
             p.location.toLowerCase().includes(q) || 
             p.tagline.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative selection:bg-emerald-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600/95 backdrop-blur-md text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-fade-in border border-emerald-400/50">
          <Sparkles className="w-5 h-5 text-emerald-200" />
          <span className="font-medium text-sm tracking-wide">{toastMessage}</span>
        </div>
      )}

      {/* FIXED GLASS NAVIGATION BAR */}
      <header className={`fixed top-0 left-0 right-0 z-50 px-6 lg:px-12 py-5 transition-all duration-300 flex items-center justify-between gap-8 ${
        isNavScrolled 
          ? 'bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl py-4' 
          : 'bg-gradient-to-b from-slate-950/90 via-slate-950/40 to-transparent'
      }`}>
        <a href="#" className="flex items-center gap-3 text-white font-bold group whitespace-nowrap shrink-0">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 backdrop-blur-md flex items-center justify-center border border-emerald-500/30 group-hover:bg-emerald-500/20 transition-all">
            <Building2 className="w-5 h-5 text-emerald-400" />
          </div>
          <span className="text-2xl font-serif tracking-widest uppercase">Luxora</span>
        </a>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-200">
          <button 
            onClick={() => { setActiveTab('buy'); scrollToProperties(); }}
            className={`hover:text-emerald-400 transition-colors pb-1 border-b-2 ${activeTab === 'buy' ? 'border-emerald-400 text-emerald-400 font-semibold' : 'border-transparent'}`}
          >
            Buy
          </button>
          <button 
            onClick={() => { setActiveTab('rent'); scrollToProperties(); }}
            className={`hover:text-emerald-400 transition-colors pb-1 border-b-2 ${activeTab === 'rent' ? 'border-emerald-400 text-emerald-400 font-semibold' : 'border-transparent'}`}
          >
            Rent
          </button>
          <button 
            onClick={() => setShowSellModal(true)}
            className="hover:text-emerald-400 transition-colors pb-1 border-b-2 border-transparent"
          >
            Sell
          </button>
          {/* MANAGE PROPERTY MODULE DROPDOWN */}
          <div className="relative group py-1">
            <button 
              onClick={() => { setShowManageModal(true); setManageActiveTab('overview'); }}
              className="flex items-center gap-1 hover:text-emerald-400 transition-colors cursor-pointer text-slate-200"
            >
              <span>Manage Property</span> <ChevronDown className="w-3.5 h-3.5 opacity-70 group-hover:rotate-180 transition-transform duration-200" />
            </button>
            <div className="absolute top-full left-0 mt-2 w-60 bg-slate-900/95 border border-slate-800 rounded-2xl shadow-2xl py-2 hidden group-hover:block backdrop-blur-xl animate-fade-in z-50">
              <button 
                onClick={() => { setShowManageModal(true); setManageActiveTab('overview'); }} 
                className="w-full text-left px-4 py-2.5 text-xs text-slate-300 hover:bg-slate-800/80 hover:text-emerald-400 transition-colors flex items-center gap-2.5 cursor-pointer"
              >
                <Briefcase className="w-4 h-4 text-emerald-400" />
                <div>
                  <div className="font-semibold text-white">Owner & Landlord Hub</div>
                  <div className="text-[10px] text-slate-400">Portfolio & yield performance</div>
                </div>
              </button>
              <button 
                onClick={() => { setShowManageModal(true); setManageActiveTab('leases'); }} 
                className="w-full text-left px-4 py-2.5 text-xs text-slate-300 hover:bg-slate-800/80 hover:text-emerald-400 transition-colors flex items-center gap-2.5 cursor-pointer"
              >
                <Layers className="w-4 h-4 text-emerald-400" />
                <div>
                  <div className="font-semibold text-white">Active Leases & Tenants</div>
                  <div className="text-[10px] text-slate-400">Track active luxury agreements</div>
                </div>
              </button>
              <button 
                onClick={() => { setShowManageModal(true); setManageActiveTab('services'); }} 
                className="w-full text-left px-4 py-2.5 text-xs text-slate-300 hover:bg-slate-800/80 hover:text-emerald-400 transition-colors flex items-center gap-2.5 cursor-pointer"
              >
                <Wrench className="w-4 h-4 text-emerald-400" />
                <div>
                  <div className="font-semibold text-white">Concierge & Maintenance</div>
                  <div className="text-[10px] text-slate-400">Estate care & RERA compliance</div>
                </div>
              </button>
            </div>
          </div>

          {/* RESOURCES MODULE DROPDOWN */}
          <div className="relative group py-1">
            <button 
              onClick={() => { setShowResourcesModal(true); setResourcesActiveTab('calculator'); }}
              className="flex items-center gap-1 hover:text-emerald-400 transition-colors cursor-pointer text-slate-200"
            >
              <span>Resources</span> <ChevronDown className="w-3.5 h-3.5 opacity-70 group-hover:rotate-180 transition-transform duration-200" />
            </button>
            <div className="absolute top-full left-0 mt-2 w-64 bg-slate-900/95 border border-slate-800 rounded-2xl shadow-2xl py-2 hidden group-hover:block backdrop-blur-xl animate-fade-in z-50">
              <button 
                onClick={() => { setShowResourcesModal(true); setResourcesActiveTab('calculator'); }} 
                className="w-full text-left px-4 py-2.5 text-xs text-slate-300 hover:bg-slate-800/80 hover:text-emerald-400 transition-colors flex items-center gap-2.5 cursor-pointer"
              >
                <Calculator className="w-4 h-4 text-emerald-400" />
                <div>
                  <div className="font-semibold text-white">Mortgage & Yield Calculator</div>
                  <div className="text-[10px] text-slate-400">Live EMI, interest & 5-yr returns</div>
                </div>
              </button>
              <button 
                onClick={() => { setShowResourcesModal(true); setResourcesActiveTab('reports'); }} 
                className="w-full text-left px-4 py-2.5 text-xs text-slate-300 hover:bg-slate-800/80 hover:text-emerald-400 transition-colors flex items-center gap-2.5 cursor-pointer"
              >
                <PieChart className="w-4 h-4 text-emerald-400" />
                <div>
                  <div className="font-semibold text-white">Market Intelligence 2026</div>
                  <div className="text-[10px] text-slate-400">Mumbai, Delhi & Goa growth trends</div>
                </div>
              </button>
              <button 
                onClick={() => { setShowResourcesModal(true); setResourcesActiveTab('advisory'); }} 
                className="w-full text-left px-4 py-2.5 text-xs text-slate-300 hover:bg-slate-800/80 hover:text-emerald-400 transition-colors flex items-center gap-2.5 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-emerald-400" />
                <div>
                  <div className="font-semibold text-white">Tax & Legal Advisory</div>
                  <div className="text-[10px] text-slate-400">Sec 54 exemptions & title checklists</div>
                </div>
              </button>
            </div>
          </div>
          <button onClick={() => {
            const el = document.getElementById('luxora-standard');
            el?.scrollIntoView({ behavior: 'smooth' });
          }} className="hover:text-emerald-400 transition-colors">
            About
          </button>
          <button onClick={() => setShowContactModal(true)} className="hover:text-emerald-400 transition-colors">
            Contact
          </button>
        </nav>

        <div className="flex items-center gap-4 shrink-0">
          <button 
            onClick={() => setShowFavoritesDrawer(true)} 
            className="relative p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all backdrop-blur-md border border-white/10 hover:border-emerald-500/30"
            title="Saved Collection"
          >
            <Heart className="w-4 h-4 text-emerald-400" />
            {favorites.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-slate-950 text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-950">
                {favorites.length}
              </span>
            )}
          </button>
          
          <button 
            onClick={() => setShowAuthModal(true)}
            className="px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs tracking-wide uppercase transition-all shadow-lg hover:shadow-emerald-500/20 whitespace-nowrap shrink-0 flex items-center gap-2"
          >
            <User className="w-3.5 h-3.5" />
            <span>{isAuthenticated ? 'VIP Account' : 'Sign In'}</span>
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* HERO SECTION WITH HIGH-QUALITY SCROLL-BASED VIDEO ANIMATION               */}
      {/* ========================================================================= */}
      <section ref={heroRef} className="relative w-full h-[320vh] bg-slate-950">
        {/* Sticky Viewport Container */}
        <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex flex-col justify-between">
          
          {/* 4K Canvas Rendering Video Frames with Smooth Interpolation */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />

          {/* Cinematic Vignette Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-slate-950/70 pointer-events-none" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/20 to-black/60 pointer-events-none" />

          {/* Top Spacing for Fixed Navbar */}
          <div className="h-28" />

          {/* DYNAMIC SCROLL OVERLAYS */}
          <div className="relative z-20 max-w-7xl mx-auto w-full px-6 lg:px-12 my-auto flex flex-col items-center text-center">
            
            {/* STAGE 1: Initial Hero Headline & Search Filter Bar */}
            <div 
              className="w-full flex flex-col items-center transition-all duration-300"
              style={{
                opacity: Math.max(0, 1 - heroProgress * 3.2),
                transform: `translateY(${-heroProgress * 80}px)`,
                pointerEvents: heroProgress < 0.25 ? 'auto' : 'none'
              }}
            >
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-emerald-400 font-semibold mb-4 bg-emerald-950/60 px-5 py-2 rounded-full backdrop-blur-md border border-emerald-500/30 shadow-lg">
                <Compass className="w-3.5 h-3.5" />
                <span>Turning Dreams into Reality, One Property at a Time</span>
              </div>

              <h1 className="text-[clamp(4.5rem,13vw,11rem)] font-serif font-bold text-white tracking-tight leading-none drop-shadow-2xl select-none mb-3">
                HAVEN
              </h1>

              <p className="text-lg md:text-2xl font-light text-slate-200 max-w-2xl mb-10 drop-shadow-md">
                Buy, Rent, or Sell — Simplifying Your Real Estate Journey
              </p>

              {/* Glassmorphic Search & Filter Console with Indian Currency */}
              <div className="w-full max-w-4xl bg-slate-900/90 text-slate-100 p-3 lg:p-4 rounded-2xl shadow-2xl backdrop-blur-2xl border border-white/10 grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
                <div className="flex flex-col text-left px-4 py-2 border-b md:border-b-0 md:border-r border-slate-800">
                  <label className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">Location</label>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                    <select 
                      value={selectedLocation} 
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full bg-transparent text-sm font-medium text-slate-100 outline-none cursor-pointer"
                    >
                      <option value="All Cities" className="bg-slate-900 text-white">Select Region</option>
                      <option value="Mumbai" className="bg-slate-900 text-white">Mumbai, MH</option>
                      <option value="Delhi" className="bg-slate-900 text-white">South Delhi, DL</option>
                      <option value="Goa" className="bg-slate-900 text-white">Goa Coastline</option>
                      <option value="Bengaluru" className="bg-slate-900 text-white">Bengaluru, KA</option>
                      <option value="Shimla" className="bg-slate-900 text-white">Shimla / Himalayas</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col text-left px-4 py-2 border-b md:border-b-0 md:border-r border-slate-800">
                  <label className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">Property Type</label>
                  <div className="flex items-center gap-2">
                    <Home className="w-4 h-4 text-emerald-400 shrink-0" />
                    <select 
                      value={selectedType} 
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-full bg-transparent text-sm font-medium text-slate-100 outline-none cursor-pointer"
                    >
                      <option value="All Types" className="bg-slate-900 text-white">All Architecture</option>
                      <option value="Villa" className="bg-slate-900 text-white">Luxury Villa</option>
                      <option value="Penthouse" className="bg-slate-900 text-white">Sky Penthouse</option>
                      <option value="Townhouse" className="bg-slate-900 text-white">Townhouse</option>
                      <option value="Apartment" className="bg-slate-900 text-white">Apartment & Loft</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col text-left px-4 py-2">
                  <label className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">Budget (INR)</label>
                  <div className="flex items-center gap-2">
                    <IndianRupee className="w-4 h-4 text-emerald-400 shrink-0" />
                    <select 
                      value={selectedPriceRange} 
                      onChange={(e) => setSelectedPriceRange(e.target.value)}
                      className="w-full bg-transparent text-sm font-medium text-slate-100 outline-none cursor-pointer"
                    >
                      <option value="Any Price" className="bg-slate-900 text-white">Any Budget</option>
                      <option value="2Cr" className="bg-slate-900 text-white">Up to ₹2 Crore</option>
                      <option value="5Cr" className="bg-slate-900 text-white">₹2 Cr - ₹5 Crore</option>
                      <option value="Above5Cr" className="bg-slate-900 text-white">₹5 Crore+</option>
                    </select>
                  </div>
                </div>

                <div className="p-1">
                  <button 
                    onClick={() => {
                      scrollToProperties();
                      showToast(`Showing residences for ${selectedLocation}`);
                    }}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3.5 px-6 rounded-xl transition-all shadow-xl hover:shadow-emerald-500/25 flex items-center justify-center gap-2 text-sm whitespace-nowrap cursor-pointer"
                  >
                    <span>Browse Properties</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* STAGE 2: Mid-Scroll Architectural Feature Highlight */}
            <div 
              className="absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-300"
              style={{
                opacity: heroProgress > 0.35 && heroProgress < 0.75 
                  ? Math.min((heroProgress - 0.35) * 5, (0.75 - heroProgress) * 5, 1) 
                  : 0,
                transform: `scale(${0.95 + heroProgress * 0.08})`
              }}
            >
              <div className="bg-slate-950/80 backdrop-blur-xl border border-white/15 p-6 md:p-8 rounded-3xl max-w-xl text-left shadow-2xl">
                <div className="flex items-center justify-between gap-4 mb-3">
                  <span className="text-[11px] uppercase tracking-widest text-emerald-400 font-bold bg-emerald-950/70 px-3 py-1 rounded-full border border-emerald-500/30">
                    Live Interior Fly-Through
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Frame {currentFrameDisplay} / {FRAME_COUNT}
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-2">
                  The Horizon Glass Villa
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed mb-4">
                  Experience bespoke architectural proportions with continuous double-height glass panels, integrated limestone finishes, and organic light design.
                </p>
                <div className="flex items-center gap-6 text-xs text-slate-400 pt-3 border-t border-slate-800">
                  <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-400" /> 6,200 sqft</span>
                  <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-400" /> 5 Suites</span>
                  <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-400" /> ₹3.85 Cr</span>
                </div>
              </div>
            </div>

            {/* STAGE 3: Final Scroll Transition Call-To-Action */}
            <div 
              className="absolute inset-0 flex flex-col items-center justify-center transition-all duration-300"
              style={{
                opacity: heroProgress >= 0.78 ? Math.min((heroProgress - 0.78) * 5, 1) : 0,
                pointerEvents: heroProgress >= 0.78 ? 'auto' : 'none'
              }}
            >
              <div className="bg-slate-950/85 backdrop-blur-2xl border border-emerald-500/30 p-8 rounded-3xl max-w-lg shadow-2xl text-center">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mb-2">
                  Ready to Step Inside?
                </h3>
                <p className="text-sm text-slate-300 mb-6">
                  Explore our complete portfolio of verified ultra-luxury estates and private sanctuaries.
                </p>
                <button
                  onClick={scrollToProperties}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-8 py-3.5 rounded-full transition-all shadow-xl hover:shadow-emerald-500/25 flex items-center justify-center gap-2 mx-auto text-sm cursor-pointer"
                >
                  <span>Explore Curated Residences</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

          {/* Bottom Indicators */}
          <div className="relative z-20 max-w-7xl mx-auto w-full px-6 lg:px-12 pb-8 flex justify-between items-center text-xs text-slate-400">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> 100% RERA & Title Verified
              </span>
              <span className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-400" /> Top Luxury Real Estate 2026
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* FEATURED PROPERTIES SECTION WITH SCROLL REVEAL ANIMATIONS                 */}
      {/* ========================================================================= */}
      <section id="properties-section" className="py-24 px-6 lg:px-12 max-w-7xl mx-auto relative z-30">
        
        {/* Header & Category Controls */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6"
        >
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-emerald-400 font-semibold mb-2 block">
              Curated Portfolio
            </span>
            <h2 className="text-3xl lg:text-5xl font-serif font-bold text-white tracking-tight">
              Exceptional Living Spaces
            </h2>
          </div>

          {/* Buy / Rent / Sell Tab Switcher */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-2xl border border-slate-800">
            <button 
              onClick={() => setActiveTab('all')}
              className={`px-5 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${activeTab === 'all' ? 'bg-emerald-500 text-slate-950 shadow-md font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              All Residences
            </button>
            <button 
              onClick={() => setActiveTab('buy')}
              className={`px-5 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${activeTab === 'buy' ? 'bg-emerald-500 text-slate-950 shadow-md font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              For Buy
            </button>
            <button 
              onClick={() => setActiveTab('rent')}
              className={`px-5 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${activeTab === 'rent' ? 'bg-emerald-500 text-slate-950 shadow-md font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              For Rent
            </button>
            <button 
              onClick={() => setShowSellModal(true)}
              className="px-5 py-2.5 text-xs font-semibold rounded-xl transition-all text-slate-400 hover:text-white cursor-pointer"
            >
              List Property
            </button>
          </div>
        </motion.div>

        {/* Search Bar & Property Type Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-10"
        >
          <div className="flex gap-3 items-center bg-slate-900/80 px-4 py-3 rounded-2xl border border-slate-800 flex-1 max-w-md">
            <Search className="w-5 h-5 text-emerald-400 shrink-0" />
            <input 
              type="text" 
              placeholder="Search by title, location or features..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 outline-none"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-slate-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {['All Types', 'Villa', 'Penthouse', 'Townhouse', 'Apartment'].map(type => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  selectedType === type 
                    ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40 shadow-sm' 
                    : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Property Grid: Animated Stagger & Interactive Lift */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.map((property, idx) => {
            const isFav = favorites.includes(property.id);
            return (
              <motion.div 
                key={property.id}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                onClick={() => setSelectedProperty(property)}
                className="group bg-slate-900/80 rounded-3xl overflow-hidden border border-slate-800 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-950/30 cursor-pointer flex flex-col"
              >
                {/* Compact, well-framed image preview */}
                <div className="relative h-48 overflow-hidden bg-slate-950">
                  <img 
                    src={property.image} 
                    alt={property.title}
                    className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border border-white/10">
                      {property.category === 'buy' ? 'For Sale' : 'For Rent'}
                    </span>
                    <span className="bg-emerald-600/90 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
                      {property.type}
                    </span>
                  </div>

                  {/* Favorite Button with Tap Pulse */}
                  <motion.button 
                    whileTap={{ scale: 0.8 }}
                    onClick={(e) => toggleFavorite(property.id, e)}
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors cursor-pointer ${
                      isFav ? 'bg-rose-500 text-white shadow-lg' : 'bg-slate-950/60 text-white hover:bg-slate-950'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                  </motion.button>

                  {/* Bottom Price in Indian Currency: Exactly one line */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <div className="text-lg font-bold font-serif text-white tracking-wide flex items-baseline gap-1.5">
                      <span>{formatIndianCurrency(property.price, property.category === 'rent')}</span>
                      {property.category === 'rent' && <span className="text-xs font-sans text-slate-300 font-normal">/ mo</span>}
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex flex-col flex-grow justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{property.location}</span>
                    </div>

                    <h3 className="text-lg font-serif font-bold text-white mb-1.5 group-hover:text-emerald-400 transition-colors">
                      {property.title}
                    </h3>
                    
                    <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                      {property.tagline}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <Bed className="w-4 h-4 text-emerald-400" />
                      <span>{property.beds} Beds</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Bath className="w-4 h-4 text-emerald-400" />
                      <span>{property.baths} Baths</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Square className="w-4 h-4 text-emerald-400" />
                      <span>{property.sqft.toLocaleString()} sqft</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredProperties.length === 0 && (
          <div className="text-center py-20 bg-slate-900/40 rounded-3xl border border-slate-800">
            <Home className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">No residences found</h3>
            <p className="text-xs text-slate-400 mb-4">Try clearing your filters or selecting a different location.</p>
            <button
              onClick={() => {
                setActiveTab('all');
                setSelectedLocation('All Cities');
                setSelectedType('All Types');
                setSelectedPriceRange('Any Price');
                setSearchQuery('');
              }}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-emerald-400 px-4 py-2 rounded-xl transition-colors cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* WHY LUXORA HAVEN / THE LUXORA STANDARD WITH HOVER & SCROLL ANIMATIONS     */}
      {/* ========================================================================= */}
      <section id="luxora-standard" className="py-24 bg-slate-900/50 border-t border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <span className="text-xs uppercase tracking-[0.2em] text-emerald-400 font-semibold mb-2 block">
              The Luxora Standard
            </span>
            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-white mb-4">
              Simplifying Your Real Estate Journey
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              We combine elite architectural curation, verified legal transparency, and white-glove advisory to make buying, renting, or selling effortless.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -8, transition: { duration: 0.25 } }}
              className="group bg-slate-900/80 p-8 rounded-3xl border border-slate-800 hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-950/20 transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-6 border border-emerald-500/20 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-transform duration-300">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 font-serif group-hover:text-emerald-400 transition-colors">Verified Ownership & Title</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every property undergoes rigorous legal title verification, RERA due diligence, and structural inspection before listing on Luxora Haven.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -8, transition: { duration: 0.25 } }}
              className="group bg-slate-900/80 p-8 rounded-3xl border border-slate-800 hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-950/20 transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-6 border border-emerald-500/20 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-transform duration-300">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 font-serif group-hover:text-emerald-400 transition-colors">AI Valuation & Market Insights</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Make data-backed decisions with real-time neighborhood appreciation trends, historical registry transactions, and comparative market analysis.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -8, transition: { duration: 0.25 } }}
              className="group bg-slate-900/80 p-8 rounded-3xl border border-slate-800 hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-950/20 transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-6 border border-emerald-500/20 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-transform duration-300">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 font-serif group-hover:text-emerald-400 transition-colors">White-Glove Advisory</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Work directly with dedicated senior luxury partners who manage private showings, negotiations, legal paperwork, and registry closings.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* TESTIMONIALS & TRUSTED STATS WITH SCROLL REVEALS                          */}
      {/* ========================================================================= */}
      <section className="py-24 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-slate-900/60 rounded-3xl p-8 lg:p-12 border border-slate-800">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex gap-1 text-emerald-400 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <blockquote className="text-xl lg:text-2xl font-serif text-white leading-relaxed mb-6">
              "The scroll-based architectural walkthrough let us experience our sea-facing villa in complete spatial detail before flying down. The transaction was effortless from negotiation to registry."
            </blockquote>
            <div>
              <div className="font-bold text-white text-sm">Vikram & Shweta Singhania</div>
              <div className="text-xs text-slate-400">Acquired The Horizon Glass Villa • 2026</div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { val: '₹12,500 Cr+', label: 'Total Volume Closed' },
              { val: '98.8%', label: 'Client Satisfaction' },
              { val: '192', label: '4K Virtual Tour Frames' },
              { val: '14 Days', label: 'Avg Closing Speed' },
            ].map((stat, i) => (
              <motion.div 
                key={stat.label}
                whileHover={{ scale: 1.05, borderColor: 'rgba(16, 185, 129, 0.5)' }}
                transition={{ duration: 0.2 }}
                className="bg-slate-950 p-6 rounded-2xl border border-slate-800/80 text-center transition-colors cursor-default"
              >
                <div className="text-3xl font-serif font-bold text-emerald-400 mb-1">{stat.val}</div>
                <div className="text-xs text-slate-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* FOOTER WITH SMOOTH REVEAL                                                 */}
      {/* ========================================================================= */}
      <motion.footer 
        id="resources" 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className="bg-slate-900 border-t border-slate-800 py-16 px-6 lg:px-12"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2.5 text-white font-bold text-xl mb-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/30">
                <Building2 className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="font-serif tracking-wide uppercase">Luxora</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Simplifying your real estate journey with curated architectural masterpieces, interactive scroll tours, and white-glove advisory across India and global luxury corridors.
            </p>
            <div className="text-xs text-slate-500">
              © 2026 Luxora Haven Private Ltd. All rights reserved.
            </div>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-wider text-white font-semibold mb-4">Quick Navigation</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><button onClick={() => { setActiveTab('buy'); scrollToProperties(); }} className="hover:text-emerald-400 transition-colors">Browse Properties for Buy</button></li>
              <li><button onClick={() => { setActiveTab('rent'); scrollToProperties(); }} className="hover:text-emerald-400 transition-colors">Browse Properties for Rent</button></li>
              <li><button onClick={() => setShowSellModal(true)} className="hover:text-emerald-400 transition-colors">List Your Property for Sale</button></li>
              <li><button onClick={() => setShowContactModal(true)} className="hover:text-emerald-400 transition-colors">Contact Advisory Team</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-wider text-white font-semibold mb-4">Prime Corridors</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><a href="#properties-section" className="hover:text-emerald-400 transition-colors">Worli & Malabar Hill, Mumbai</a></li>
              <li><a href="#properties-section" className="hover:text-emerald-400 transition-colors">Golf Links & Lutyens, Delhi</a></li>
              <li><a href="#properties-section" className="hover:text-emerald-400 transition-colors">Candolim & Assagao, Goa</a></li>
              <li><a href="#properties-section" className="hover:text-emerald-400 transition-colors">Indiranagar & Sadashivanagar, BLR</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-wider text-white font-semibold mb-4">Stay Updated</h4>
            <p className="text-xs text-slate-400 mb-3">Subscribe to our weekly private off-market listings digest.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-slate-950 border border-slate-800 text-xs px-3.5 py-2.5 rounded-xl text-slate-100 placeholder-slate-500 outline-none w-full focus:border-emerald-500 transition-colors"
              />
              <motion.button 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => showToast('Subscribed to Luxora Private Digest!')}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer"
              >
                Join
              </motion.button>
            </div>
          </div>
        </div>
      </motion.footer>

      {/* ========================================================================= */}
      {/* PROPERTY DETAILS MODAL: COMPACT, ELEGANT, PERFECT 1-LINE PRICE ALIGNMENT  */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedProperty && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
            onClick={() => setSelectedProperty(null)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl my-auto relative max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button Top Right */}
              <button 
                onClick={() => setSelectedProperty(null)}
                className="absolute top-3 right-3 z-20 p-2 rounded-full bg-slate-950/80 text-white hover:bg-slate-950 border border-white/10 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              {/* Compact well-proportioned image banner */}
              <div className="relative w-full h-44 sm:h-48 bg-slate-950 overflow-hidden shrink-0">
                <img 
                  src={selectedProperty.image} 
                  alt={selectedProperty.title}
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/30 pointer-events-none" />
                
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="bg-slate-950/80 backdrop-blur-md text-white text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border border-white/10">
                    {selectedProperty.category === 'buy' ? 'For Sale' : 'For Rent'}
                  </span>
                  <span className="bg-emerald-600/90 text-white text-[9px] font-semibold px-2 py-0.5 rounded-full">
                    {selectedProperty.type}
                  </span>
                </div>
              </div>

              {/* Content Body: Clean single-line price alignment & compact styling */}
              <div className="p-4 sm:p-5 space-y-3.5 overflow-y-auto">
                
                {/* Title & Price Header: Cleanly Aligned in One Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                  <div className="min-w-0">
                    <h2 className="text-lg sm:text-xl font-serif font-bold text-white mb-0.5 truncate">
                      {selectedProperty.title}
                    </h2>
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{selectedProperty.location}</span>
                    </div>
                  </div>

                  {/* Price in ONE neat single line */}
                  <div className="flex items-baseline gap-1.5 shrink-0 self-start sm:self-auto">
                    <span className="text-xl sm:text-2xl font-serif font-bold text-emerald-400 whitespace-nowrap">
                      {formatIndianCurrency(selectedProperty.price, selectedProperty.category === 'rent')}
                    </span>
                    {selectedProperty.category === 'rent' ? (
                      <span className="text-xs text-slate-400 font-sans whitespace-nowrap">/ month</span>
                    ) : (
                      <span className="text-xs text-slate-400 font-sans whitespace-nowrap font-normal">
                        (₹{selectedProperty.price.toLocaleString('en-IN')})
                      </span>
                    )}
                  </div>
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-3 gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 text-center">
                  <div>
                    <div className="text-[9px] text-slate-400 uppercase tracking-wider">Bedrooms</div>
                    <div className="text-sm font-bold text-white">{selectedProperty.beds} Beds</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-slate-400 uppercase tracking-wider">Bathrooms</div>
                    <div className="text-sm font-bold text-white">{selectedProperty.baths} Baths</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-slate-400 uppercase tracking-wider">Built-Up Area</div>
                    <div className="text-sm font-bold text-white">{selectedProperty.sqft.toLocaleString()} sqft</div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">About Residence</h4>
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                    {selectedProperty.description}
                  </p>
                </div>

                {/* Amenities */}
                {selectedProperty.amenities && (
                  <div>
                    <h4 className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1.5">Key Amenities</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedProperty.amenities.map(a => (
                        <span key={a} className="bg-slate-950 text-slate-300 border border-slate-800 text-[10px] px-2 py-0.5 rounded-lg flex items-center gap-1">
                          <Check className="w-2.5 h-2.5 text-emerald-400" /> {a}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2.5 pt-1">
                  <button 
                    onClick={() => {
                      setSelectedProperty(null);
                      showToast('Private showing requested successfully!');
                    }}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 py-2.5 px-4 rounded-xl font-bold text-xs tracking-wide transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Schedule Private Tour</span>
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedProperty(null);
                      setShowContactModal(true);
                    }}
                    className="bg-slate-800 hover:bg-slate-700 text-white py-2.5 px-4 rounded-xl font-semibold text-xs transition-colors cursor-pointer"
                  >
                    Contact Advisor
                  </button>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* LOGIN MODAL                                                               */}
      {/* ========================================================================= */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-8 shadow-2xl relative">
            <button onClick={() => setShowAuthModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <div className="text-center mb-6">
              <h3 className="text-2xl font-serif font-bold text-white mb-1">Welcome to Luxora</h3>
              <p className="text-xs text-slate-400">Sign in to save favorite properties and sync your inquiries.</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1 block">Email Address</label>
                <input type="email" defaultValue="vip@luxorahaven.com" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1 block">Password</label>
                <input type="password" defaultValue="••••••••" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-emerald-500" />
              </div>
              <button 
                onClick={() => { 
                  setShowAuthModal(false); 
                  setIsAuthenticated(true);
                  showToast('Welcome back, VIP Client!'); 
                }} 
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 py-3.5 rounded-xl font-bold text-sm transition-colors cursor-pointer"
              >
                Sign In to Luxora
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SELL MODAL (Indian Currency)                                              */}
      {/* ========================================================================= */}
      {showSellModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-8 shadow-2xl relative">
            <button onClick={() => setShowSellModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <div className="text-center mb-6">
              <h3 className="text-2xl font-serif font-bold text-white mb-1">List Your Luxury Property</h3>
              <p className="text-xs text-slate-400">Partner with Luxora Haven to reach qualified ultra-HNI buyers across India and globally.</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1 block">Property Address / City</label>
                <input type="text" placeholder="e.g. Worli Sea Face, Mumbai" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-emerald-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1 block">Property Type</label>
                  <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white outline-none">
                    <option>Luxury Villa</option>
                    <option>Sky Penthouse</option>
                    <option>Townhouse</option>
                    <option>Apartment</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1 block">Expected Price (INR)</label>
                  <input type="text" placeholder="₹4.50 Crore" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-emerald-500" />
                </div>
              </div>
              <button 
                onClick={() => { setShowSellModal(false); showToast('Listing inquiry submitted! Advisory team will contact you.'); }} 
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 py-3.5 rounded-xl font-bold text-sm transition-colors cursor-pointer"
              >
                Submit Listing for Valuation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CONTACT ADVISORY MODAL                                                    */}
      {/* ========================================================================= */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-8 shadow-2xl relative">
            <button onClick={() => setShowContactModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <div className="text-center mb-6">
              <h3 className="text-2xl font-serif font-bold text-white mb-1">Contact Advisory Team</h3>
              <p className="text-xs text-slate-400">Speak directly with our senior luxury real estate consultants.</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1 block">Full Name</label>
                <input type="text" placeholder="Rahul Mehra" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1 block">Phone / Email</label>
                <input type="text" placeholder="+91 98200 12345" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1 block">Inquiry Type</label>
                <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white outline-none">
                  <option>Private Tour Booking</option>
                  <option>Off-Market Acquisitions</option>
                  <option>Portfolio Advisory</option>
                </select>
              </div>
              <button 
                onClick={() => { setShowContactModal(false); showToast('Message received! An advisor will call you shortly.'); }} 
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 py-3.5 rounded-xl font-bold text-sm transition-colors cursor-pointer"
              >
                Send Direct Message
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SAVED PROPERTIES DRAWER (Indian Currency)                                 */}
      {/* ========================================================================= */}
      {showFavoritesDrawer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-end" onClick={() => setShowFavoritesDrawer(false)}>
          <div className="bg-slate-900 border-l border-slate-800 w-full max-w-md p-6 overflow-y-auto flex flex-col justify-between shadow-2xl animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-rose-500 fill-current" />
                  <h3 className="text-lg font-serif font-bold text-white">Saved Collection ({favorites.length})</h3>
                </div>
                <button onClick={() => setShowFavoritesDrawer(false)} className="text-slate-400 hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {favorites.map(id => {
                  const prop = PROPERTIES.find(p => p.id === id);
                  if (!prop) return null;
                  return (
                    <div key={prop.id} className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex gap-4 items-center">
                      <img src={prop.image} alt={prop.title} className="w-20 h-16 object-cover rounded-xl shrink-0" referrerPolicy="no-referrer" />
                      <div className="flex-grow min-w-0">
                        <h4 className="text-sm font-bold text-white truncate">{prop.title}</h4>
                        <div className="text-xs text-slate-400 truncate mb-1">{prop.location}</div>
                        <div className="text-xs font-bold text-emerald-400">
                          {formatIndianCurrency(prop.price, prop.category === 'rent')}
                          {prop.category === 'rent' && <span className="font-normal text-slate-400"> / mo</span>}
                        </div>
                      </div>
                      <button onClick={(e) => toggleFavorite(prop.id, e)} className="text-slate-500 hover:text-rose-400 p-2 shrink-0 cursor-pointer">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}

                {favorites.length === 0 && (
                  <div className="text-center py-20 text-slate-500">
                    <Heart className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No saved properties yet.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800">
              <button 
                onClick={() => { setShowFavoritesDrawer(false); setShowContactModal(true); }} 
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 py-3.5 rounded-xl font-bold text-sm transition-colors cursor-pointer"
              >
                Inquire About Saved Homes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE 1: MANAGE PROPERTY (OWNER & LANDLORD MANAGEMENT HUB)               */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showManageModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
            onClick={() => setShowManageModal(false)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl my-auto relative max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-5 sm:p-6 pb-4 border-b border-slate-800 flex items-start justify-between gap-4 bg-slate-950/40">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-bold text-white">Owner & Landlord Suite</h3>
                    <p className="text-xs text-slate-400">Portfolio oversight, active leases, and white-glove estate management.</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowManageModal(false)}
                  className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Tabs Bar */}
              <div className="flex border-b border-slate-800 px-6 bg-slate-950/60 gap-4 text-xs font-semibold">
                <button
                  onClick={() => setManageActiveTab('overview')}
                  className={`py-3 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
                    manageActiveTab === 'overview' ? 'border-emerald-400 text-emerald-400 font-bold' : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Portfolio Overview</span>
                </button>
                <button
                  onClick={() => setManageActiveTab('leases')}
                  className={`py-3 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
                    manageActiveTab === 'leases' ? 'border-emerald-400 text-emerald-400 font-bold' : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Active Leases (2)</span>
                </button>
                <button
                  onClick={() => setManageActiveTab('services')}
                  className={`py-3 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
                    manageActiveTab === 'services' ? 'border-emerald-400 text-emerald-400 font-bold' : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Concierge Services</span>
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
                {manageActiveTab === 'overview' && (
                  <div className="space-y-5">
                    {/* 4 Metric Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                        <div className="text-[10px] uppercase text-slate-400 font-semibold mb-1">Asset Value</div>
                        <div className="text-lg font-serif font-bold text-white">₹24.50 Cr</div>
                        <div className="text-[10px] text-emerald-400 font-medium">+14.8% YoY</div>
                      </div>
                      <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                        <div className="text-[10px] uppercase text-slate-400 font-semibold mb-1">Monthly Yield</div>
                        <div className="text-lg font-serif font-bold text-emerald-400">₹4.25 L/mo</div>
                        <div className="text-[10px] text-slate-400">Net 6.2% Return</div>
                      </div>
                      <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                        <div className="text-[10px] uppercase text-slate-400 font-semibold mb-1">Occupancy</div>
                        <div className="text-lg font-serif font-bold text-white">100%</div>
                        <div className="text-[10px] text-emerald-400">2 Active Leases</div>
                      </div>
                      <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                        <div className="text-[10px] uppercase text-slate-400 font-semibold mb-1">Client Rating</div>
                        <div className="text-lg font-serif font-bold text-white">4.9 / 5.0</div>
                        <div className="text-[10px] text-slate-400">Verified Tenants</div>
                      </div>
                    </div>

                    {/* Recent Management Ledger */}
                    <div>
                      <h4 className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2.5">Recent Activity & Rent Credits</h4>
                      <div className="space-y-2">
                        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-400" />
                            <div>
                              <div className="font-semibold text-white">Rent Received — Worli Sea Face Villa</div>
                              <div className="text-[10px] text-slate-400">Credited via Auto-Escrow • 1st Nov 2026</div>
                            </div>
                          </div>
                          <span className="font-mono font-bold text-emerald-400">+₹1,85,000</span>
                        </div>
                        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2.5">
                            <span className="w-2 h-2 rounded-full bg-sky-400" />
                            <div>
                              <div className="font-semibold text-white">Rent Received — Solstice Coastal Villa, Goa</div>
                              <div className="text-[10px] text-slate-400">Credited via NEFT • 1st Nov 2026</div>
                            </div>
                          </div>
                          <span className="font-mono font-bold text-emerald-400">+₹2,40,000</span>
                        </div>
                        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2.5">
                            <span className="w-2 h-2 rounded-full bg-amber-400" />
                            <div>
                              <div className="font-semibold text-white">Bi-Monthly HVAC & Pool Inspection Completed</div>
                              <div className="text-[10px] text-slate-400">Luxora White-Glove Care • Certified Clean</div>
                            </div>
                          </div>
                          <span className="text-[11px] text-slate-400">Completed</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => { setShowManageModal(false); setShowSellModal(true); }}
                        className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Building2 className="w-4 h-4" />
                        <span>List Another Property</span>
                      </button>
                      <button
                        onClick={() => showToast('Financial Year 2025-26 Statement downloaded!')}
                        className="bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center gap-2 cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download Yield Statement</span>
                      </button>
                    </div>
                  </div>
                )}

                {manageActiveTab === 'leases' && (
                  <div className="space-y-4">
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">Active Lease</span>
                          <h4 className="text-sm font-bold text-white">The Horizon Glass Villa</h4>
                        </div>
                        <div className="text-xs text-slate-400">Worli Sea Face, Mumbai • Lease: Nov 2025 – Oct 2027</div>
                        <div className="text-xs text-slate-300 mt-1">Tenant: Verified Consulate Diplomat • Rent: <span className="text-emerald-400 font-bold">₹1,85,000 / mo</span></div>
                      </div>
                      <button
                        onClick={() => showToast('Lease Agreement & Inventory PDF opened!')}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 text-emerald-400" />
                        <span>View Lease PDF</span>
                      </button>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">Active Lease</span>
                          <h4 className="text-sm font-bold text-white">Solstice Coastal Villa</h4>
                        </div>
                        <div className="text-xs text-slate-400">Candolim, Goa • Lease: Jan 2026 – Dec 2026</div>
                        <div className="text-xs text-slate-300 mt-1">Tenant: Verified Tech Enterprise Lease • Rent: <span className="text-emerald-400 font-bold">₹2,40,000 / mo</span></div>
                      </div>
                      <button
                        onClick={() => showToast('Lease Agreement & Inventory PDF opened!')}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 text-emerald-400" />
                        <span>View Lease PDF</span>
                      </button>
                    </div>

                    <div className="pt-2 text-center">
                      <button
                        onClick={() => { setShowManageModal(false); setShowContactModal(true); }}
                        className="text-xs text-emerald-400 hover:underline cursor-pointer inline-flex items-center gap-1"
                      >
                        <span>Need a lease renewal or tenant replacement? Contact Advisory Desk</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {manageActiveTab === 'services' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex gap-3 items-start">
                        <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-white mb-0.5">360° Tenant Due Diligence</h5>
                          <p className="text-[11px] text-slate-400 leading-relaxed">Identity verification, corporate backing, and financial credibility audits before signing.</p>
                        </div>
                      </div>
                      <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex gap-3 items-start">
                        <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-white mb-0.5">RERA Digital E-Stamping</h5>
                          <p className="text-[11px] text-slate-400 leading-relaxed">End-to-end stamp duty, registration, and legally binding digital lease execution.</p>
                        </div>
                      </div>
                      <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex gap-3 items-start">
                        <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
                          <IndianRupee className="w-4 h-4" />
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-white mb-0.5">Guaranteed Escrow Collection</h5>
                          <p className="text-[11px] text-slate-400 leading-relaxed">Automatic rent disbursement to your bank on the 1st of every month with zero delays.</p>
                        </div>
                      </div>
                      <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex gap-3 items-start">
                        <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
                          <Wrench className="w-4 h-4" />
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-white mb-0.5">24/7 Estate Concierge</h5>
                          <p className="text-[11px] text-slate-400 leading-relaxed">Emergency plumbing, HVAC, electrical, landscaping, and pool care handled on-demand.</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => {
                          setShowManageModal(false);
                          showToast('Inspection request booked! A property manager will visit within 24 hours.');
                        }}
                        className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Wrench className="w-4 h-4" />
                        <span>Schedule On-Demand Estate Inspection</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODULE 2: RESOURCES (LUXURY INTELLIGENCE & EMI CALCULATOR HUB)             */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showResourcesModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
            onClick={() => setShowResourcesModal(false)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl my-auto relative max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-5 sm:p-6 pb-4 border-b border-slate-800 flex items-start justify-between gap-4 bg-slate-950/40">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-bold text-white">Luxury Intelligence & Advisory</h3>
                    <p className="text-xs text-slate-400">Mortgage calculations, Q1 2026 market benchmarks, and tax frameworks.</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowResourcesModal(false)}
                  className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Tabs Bar */}
              <div className="flex border-b border-slate-800 px-6 bg-slate-950/60 gap-4 text-xs font-semibold">
                <button
                  onClick={() => setResourcesActiveTab('calculator')}
                  className={`py-3 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
                    resourcesActiveTab === 'calculator' ? 'border-emerald-400 text-emerald-400 font-bold' : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  <Calculator className="w-3.5 h-3.5" />
                  <span>Mortgage & Yield Calculator</span>
                </button>
                <button
                  onClick={() => setResourcesActiveTab('reports')}
                  className={`py-3 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
                    resourcesActiveTab === 'reports' ? 'border-emerald-400 text-emerald-400 font-bold' : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  <PieChart className="w-3.5 h-3.5" />
                  <span>Market Intelligence 2026</span>
                </button>
                <button
                  onClick={() => setResourcesActiveTab('advisory')}
                  className={`py-3 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
                    resourcesActiveTab === 'advisory' ? 'border-emerald-400 text-emerald-400 font-bold' : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Tax & Legal Framework</span>
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
                {resourcesActiveTab === 'calculator' && (
                  <div className="space-y-5">
                    {/* Interactive Slider Inputs */}
                    <div className="space-y-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                      <div>
                        <div className="flex justify-between items-center text-xs mb-1.5">
                          <span className="text-slate-400 font-medium">Property Valuation</span>
                          <span className="font-serif font-bold text-emerald-400 text-sm">
                            {formatIndianCurrency(calcPrice)} (₹{calcPrice.toLocaleString('en-IN')})
                          </span>
                        </div>
                        <input
                          type="range"
                          min="10000000"
                          max="250000000"
                          step="2500000"
                          value={calcPrice}
                          onChange={(e) => setCalcPrice(Number(e.target.value))}
                          className="w-full accent-emerald-500 cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                          <span>₹1.00 Cr</span>
                          <span>₹12.50 Cr</span>
                          <span>₹25.00 Cr</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                        <div>
                          <div className="flex justify-between text-[11px] mb-1">
                            <span className="text-slate-400">Down Payment</span>
                            <span className="font-bold text-white">{calcDownPaymentPercent}%</span>
                          </div>
                          <input
                            type="range"
                            min="10"
                            max="50"
                            step="5"
                            value={calcDownPaymentPercent}
                            onChange={(e) => setCalcDownPaymentPercent(Number(e.target.value))}
                            className="w-full accent-emerald-500 cursor-pointer"
                          />
                          <div className="text-[10px] text-emerald-400 font-mono mt-0.5">
                            {formatIndianCurrency(calcPrice * (calcDownPaymentPercent / 100))}
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-[11px] mb-1">
                            <span className="text-slate-400">Tenure</span>
                            <span className="font-bold text-white">{calcTenureYears} Years</span>
                          </div>
                          <input
                            type="range"
                            min="5"
                            max="30"
                            step="5"
                            value={calcTenureYears}
                            onChange={(e) => setCalcTenureYears(Number(e.target.value))}
                            className="w-full accent-emerald-500 cursor-pointer"
                          />
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                            {calcTenureYears * 12} Months
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-[11px] mb-1">
                            <span className="text-slate-400">Interest Rate</span>
                            <span className="font-bold text-white">{calcInterestRate}% p.a.</span>
                          </div>
                          <input
                            type="range"
                            min="7.0"
                            max="11.5"
                            step="0.25"
                            value={calcInterestRate}
                            onChange={(e) => setCalcInterestRate(Number(e.target.value))}
                            className="w-full accent-emerald-500 cursor-pointer"
                          />
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                            Private Wealth Rate
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Live Calculation Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="bg-emerald-950/40 p-4 rounded-2xl border border-emerald-500/40">
                        <div className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold mb-1">Estimated Monthly EMI</div>
                        <div className="text-xl font-serif font-bold text-white">
                          ₹{calculatedEmi.toLocaleString('en-IN')}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1">Direct Bank Auto-Debit</div>
                      </div>

                      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                        <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">Total Loan Principal</div>
                        <div className="text-lg font-serif font-bold text-white">
                          {formatIndianCurrency(loanPrincipal)}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1">₹{loanPrincipal.toLocaleString('en-IN')}</div>
                      </div>

                      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                        <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">5-Yr Projected Value</div>
                        <div className="text-lg font-serif font-bold text-emerald-400">
                          {formatIndianCurrency(calcPrice * 1.425)}
                        </div>
                        <div className="text-[10px] text-emerald-400 mt-1">+42.5% Historical Trend</div>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-1">
                      <button
                        onClick={() => {
                          setShowResourcesModal(false);
                          showToast('Private Wealth Home Loan desk contacted! An advisor will call within 2 hours.');
                        }}
                        className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Lock In Preferential Private Banking Rate</span>
                      </button>
                    </div>
                  </div>
                )}

                {resourcesActiveTab === 'reports' && (
                  <div className="space-y-4">
                    <div className="text-xs text-slate-400">
                      Real-time indices compiled by Luxora Advisory from verified registry transactions across India's top luxury real estate micro-markets:
                    </div>

                    <div className="space-y-3">
                      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-serif font-bold text-white text-sm">Mumbai Corridors (Worli, Malabar Hill, Bandra)</span>
                          <span className="text-emerald-400 font-bold text-xs">+14.2% YoY</span>
                        </div>
                        <div className="text-xs text-slate-400 mb-2">Average price: <span className="text-white font-medium">₹88,000 / sqft</span> • Sea-link connectivity & coastal road driving super-prime demand.</div>
                        <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full w-[84%]" />
                        </div>
                      </div>

                      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-serif font-bold text-white text-sm">Delhi NCR (Golf Links, Lutyens, Shanti Niketan)</span>
                          <span className="text-emerald-400 font-bold text-xs">+18.6% YoY</span>
                        </div>
                        <div className="text-xs text-slate-400 mb-2">Average price: <span className="text-white font-medium">₹1,15,000 / sqft</span> • Unprecedented demand for private low-rise luxury floors and multi-plot estates.</div>
                        <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full w-[92%]" />
                        </div>
                      </div>

                      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-serif font-bold text-white text-sm">Goa Coastal (Assagao, Candolim, Anjuna)</span>
                          <span className="text-emerald-400 font-bold text-xs">+22.4% YoY</span>
                        </div>
                        <div className="text-xs text-slate-400 mb-2">Average villa ticket size: <span className="text-white font-medium">₹8.5 Cr – ₹25 Cr</span> • Highest gross rental yields in India at 6.8% – 8.2%.</div>
                        <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full w-[96%]" />
                        </div>
                      </div>

                      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-serif font-bold text-white text-sm">Bengaluru (Indiranagar, Sadashivanagar)</span>
                          <span className="text-emerald-400 font-bold text-xs">+16.1% YoY</span>
                        </div>
                        <div className="text-xs text-slate-400 mb-2">Tech founder & venture partner custom penthouses driving premium absorption.</div>
                        <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full w-[78%]" />
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => showToast('Full 48-Page Q1 2026 Executive Intelligence Digest downloaded!')}
                        className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Download className="w-4 h-4 text-emerald-400" />
                        <span>Download Complete Q1 2026 Market Intelligence Report (PDF)</span>
                      </button>
                    </div>
                  </div>
                )}

                {resourcesActiveTab === 'advisory' && (
                  <div className="space-y-4">
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-emerald-400" />
                        <h4 className="text-sm font-bold text-white">Section 54 Capital Gains Tax Roll-Over</h4>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Reinvest your long-term capital gains from the sale of residential real estate into another luxury residential home within 2 years (or 3 years for construction) to claim 100% tax exemption up to ₹10 Crore under the Income Tax Act.
                      </p>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <h4 className="text-sm font-bold text-white">RERA Legal Due Diligence Standards</h4>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Every estate curated by Luxora comes with a verified 30-year search title report, non-encumbrance certificate, municipal sanction clearances, and occupancy certificate (OC) verification.
                      </p>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-emerald-400" />
                        <h4 className="text-sm font-bold text-white">Private Banking & Wealth Partners</h4>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Luxora Haven maintains pre-approved syndicated mortgage underwriting with HDFC Private Banking, ICICI Wealth Management, Kotak Private, and HSBC Premier for fast-track closing.
                      </p>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => {
                          setShowResourcesModal(false);
                          setShowContactModal(true);
                        }}
                        className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Mail className="w-4 h-4" />
                        <span>Schedule Confidential Legal & Wealth Consultation</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

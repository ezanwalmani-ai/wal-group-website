import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Activity, 
  Building2, 
  UtensilsCrossed, 
  Film, 
  Cpu, 
  Factory, 
  ShoppingCart, 
  Bot 
} from 'lucide-react';
import { IndustrySlide } from '../types';

export const IndustriesSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const industries: IndustrySlide[] = [
    {
      id: 'healthcare',
      name: 'Healthcare & Life Sciences',
      label: 'Healthcare & Life Sciences',
      icon: 'activity',
      imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1600&q=80',
      description: 'HIPAA-compliant digital marketing, medical practice growth, and patient acquisition pipelines.'
    },
    {
      id: 'bfsi',
      name: 'BFSI',
      label: 'BFSI',
      icon: 'building',
      imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
      description: 'Trust-centric financial marketing, lead qualification, and brand authority campaigns.'
    },
    {
      id: 'hospitality',
      name: 'Hospitality',
      label: 'Hospitality',
      icon: 'utensils',
      imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80',
      description: 'Luxury hotel & restaurant branding, booking conversion funnels, and experiential marketing.'
    },
    {
      id: 'entertainment',
      name: 'Entertainment',
      label: 'Entertainment',
      icon: 'film',
      imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1600&q=80',
      description: 'High-impact multimedia promotion, event marketing, and social audience scaling.'
    },
    {
      id: 'tech',
      name: 'Technology & Software',
      label: 'Technology & Software',
      icon: 'cpu',
      imageUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1600&q=80',
      description: 'B2B SaaS demand generation, developer advocacy, and product-led content strategy.'
    },
    {
      id: 'manufacturing',
      name: 'Manufacturing & Distribution',
      label: 'Manufacturing & Distribution',
      icon: 'factory',
      imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1600&q=80',
      description: 'Industrial supplier visibility, B2B procurement funnels, and global distribution marketing.'
    },
    {
      id: 'ecommerce',
      name: 'Ecommerce & Retail',
      label: 'Ecommerce & Retail',
      icon: 'cart',
      imageUrl: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=1600&q=80',
      description: 'Omnichannel growth, cart recovery automations, and ROAS-optimized ad management.'
    },
    {
      id: 'ai-startups',
      name: 'AI Startups',
      label: 'AI Startups',
      icon: 'bot',
      imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80',
      description: 'Cutting-edge AI launch marketing, community building, and technical thought leadership.'
    }
  ];

  // Preload all industry slide images for zero loading delays or blank flashes
  useEffect(() => {
    industries.forEach((ind) => {
      const img = new Image();
      img.src = ind.imageUrl;
    });
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % industries.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isPaused, industries.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + industries.length) % industries.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % industries.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current !== null) {
      const touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX.current - touchEndX;

      if (diff > 40) {
        handleNext();
      } else if (diff < -40) {
        handlePrev();
      }
      touchStartX.current = null;
    }
    setTimeout(() => {
      setIsPaused(false);
    }, 1200);
  };

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'activity': return <Activity className="w-5 h-5 text-[#ff7700]" />;
      case 'building': return <Building2 className="w-5 h-5 text-[#ff7700]" />;
      case 'utensils': return <UtensilsCrossed className="w-5 h-5 text-[#ff7700]" />;
      case 'film': return <Film className="w-5 h-5 text-[#ff7700]" />;
      case 'cpu': return <Cpu className="w-5 h-5 text-[#ff7700]" />;
      case 'factory': return <Factory className="w-5 h-5 text-[#ff7700]" />;
      case 'cart': return <ShoppingCart className="w-5 h-5 text-[#ff7700]" />;
      case 'bot': return <Bot className="w-5 h-5 text-[#ff7700]" />;
      default: return <Building2 className="w-5 h-5 text-[#ff7700]" />;
    }
  };

  const currentSlide = industries[currentIndex];

  return (
    <div 
      className="relative w-full rounded-2xl overflow-hidden shadow-2xl bg-slate-950 border border-white/10 group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Image Container with Gradient Overlay */}
      <div className="relative h-[380px] sm:h-[450px] w-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img 
            key={currentSlide.id}
            src={currentSlide.imageUrl} 
            alt={currentSlide.name} 
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        </AnimatePresence>
        {/* Dark gradient overlay (navy/black to transparent) */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-transparent pointer-events-none"></div>
        <div className="absolute inset-0 bg-black/40 pointer-events-none"></div>

        {/* Content Box */}
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 text-white z-10 max-w-3xl">
          {/* Black rounded label with custom icon */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-[#ff7700]/50 text-xs sm:text-sm font-semibold text-white mb-4 shadow-lg">
            {renderIcon(currentSlide.icon)}
            <span>{currentSlide.label}</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2 text-white">
            {currentSlide.name}
          </h3>

          <p className="text-slate-200 text-sm sm:text-base leading-relaxed line-clamp-3 max-w-2xl">
            {currentSlide.description}
          </p>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/60 hover:bg-[#ff7700] hover:text-black text-white flex items-center justify-center transition-all border border-white/20 backdrop-blur-sm shadow-lg hover:scale-110 cursor-pointer"
        aria-label="Previous Industry"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button 
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/60 hover:bg-[#ff7700] hover:text-black text-white flex items-center justify-center transition-all border border-white/20 backdrop-blur-sm shadow-lg hover:scale-110 cursor-pointer"
        aria-label="Next Industry"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 right-6 z-20 flex items-center gap-2">
        {industries.map((ind, idx) => (
          <button
            key={ind.id}
            onClick={() => setCurrentIndex(idx)}
            className={`transition-all duration-500 ease-out rounded-full cursor-pointer ${
              idx === currentIndex 
                ? 'w-8 h-2.5 bg-[#ff7700] shadow-[0_0_12px_rgba(255,119,0,0.6)]' 
                : 'w-2.5 h-2.5 bg-white/30 hover:bg-white/70'
            }`}
            aria-label={`Go to ${ind.name}`}
          />
        ))}
      </div>
    </div>
  );
};

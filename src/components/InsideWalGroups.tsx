import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Truck, 
  Sparkles, 
  Award, 
  BookOpen, 
  Building2, 
  Heart,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { soundFx } from '../utils/audio';

interface GalleryItem {
  id: string;
  category: 'Culture' | 'Operations' | 'Training' | 'Events' | 'Team';
  title: string;
  location: string;
  description: string;
  image: string;
  badge: string;
}

export const InsideWalGroups: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const galleryItems: GalleryItem[] = [
    {
      id: 'item-1',
      category: 'Operations',
      title: '24/7 Cortex Dispatch Control Center',
      location: 'Bengaluru Operations Hub',
      description: 'Our real-time dispatchers tracking over 1,200 vans concurrently across US timezones.',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
      badge: 'Live Operations'
    },
    {
      id: 'item-2',
      category: 'Team',
      title: 'Executive Strategy Summit',
      location: 'Bengaluru Headquarters',
      description: 'Quarterly review with Amazon DSP owners aligning scorecards and peak expansion strategies.',
      image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
      badge: 'Executive Team'
    },
    {
      id: 'item-3',
      category: 'Training',
      title: 'Netradyne Safety & Scorecard Bootcamp',
      location: 'Bengaluru Training Lab',
      description: 'Rigorous 2-week onboarding for new dispatchers focusing on seatbelt, speed, and distraction mitigation.',
      image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
      badge: 'Certified Training'
    },
    {
      id: 'item-4',
      category: 'Culture',
      title: 'Annual High-Performer Recognition Awards',
      location: 'Bengaluru Campus, India',
      description: 'Celebrating our top-rated Cortex dispatchers and certified payroll accountants.',
      image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80',
      badge: 'Company Culture'
    },
    {
      id: 'item-5',
      category: 'Operations',
      title: 'Automated AI Driver Onboarding Workstation',
      location: 'Bengaluru AI Dev Hub',
      description: 'Engineers tuning bilingual AI voicebots that prescreen 1,000+ driver applicants weekly.',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80',
      badge: 'AI Innovation'
    },
    {
      id: 'item-6',
      category: 'Events',
      title: 'Annual Fleet Logistics Expo & Meetup',
      location: 'Bengaluru Tech Park',
      description: 'Bringing together Linehaul AFP carriers, DSP executives, and BPO specialists.',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
      badge: 'Logistics Meetup'
    }
  ];

  const categories = ['All', 'Operations', 'Team', 'Training', 'Culture', 'Events'];

  const filteredItems = activeFilter === 'All' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeFilter);

  const handleFilterClick = (cat: string) => {
    soundFx.playClick();
    setActiveFilter(cat);
  };

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#050508] border-y border-white/10 relative overflow-hidden">
      {/* Background Soft Mesh Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#ff6600]/8 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-[#ff6600]/40 text-xs font-bold text-[#ff6600]">
            <Heart className="w-3.5 h-3.5 text-[#ff6600]" />
            <span>BEHIND THE SCENES AT WAL GROUP</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Inside <span className="gold-text italic font-serif">Wal Group</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-400 font-normal">
            A peak into our operational culture, global workstations, training bootcamps, and executive collaboration.
          </p>
        </div>

        {/* Filter Tab Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleFilterClick(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeFilter === cat
                  ? 'bg-[#ff6600] text-black shadow-[0_0_15px_#ff6600] scale-105'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                whileHover={{ y: -6 }}
                className="glass-panel rounded-3xl overflow-hidden border border-white/10 hover:border-[#ff6600]/50 transition-all group flex flex-col justify-between cursor-default shadow-xl relative bg-[#0c0c10]"
              >
                {/* Image Box */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-90 group-hover:brightness-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c10] via-transparent to-black/30" />

                  {/* Top Badge */}
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10px] font-bold text-[#ff6600]">
                    {item.badge}
                  </div>
                </div>

                {/* Content Box */}
                <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] font-bold text-[#ff6600] uppercase tracking-wider mb-1">
                      {item.location}
                    </div>
                    <h3 className="text-lg font-bold text-white group-hover:text-[#ff6600] transition-colors leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1 text-slate-400">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      Verified Culture &amp; Team
                    </span>
                    <span className="text-[#ff6600] font-bold group-hover:underline flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" /> View Story
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
};

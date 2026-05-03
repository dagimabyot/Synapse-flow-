import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import {
  BrainCircuit, Zap, ShieldCheck, BarChart2, Map, ArrowRight,
  Activity, ChevronDown, Globe, Menu, X, CheckCircle
} from 'lucide-react';

const FEATURES = [
  {
    icon: Zap,
    color: 'text-cyan-400',
    bg: 'bg-cyan-400/10',
    border: 'border-cyan-400/20',
    title: 'AI-Driven Signal Control',
    desc: 'Reinforcement learning dynamically adapts traffic light timing in real-time, reducing average wait times by up to 40%.',
  },
  {
    icon: ShieldCheck,
    color: 'text-violet-400',
    bg: 'bg-violet-400/10',
    border: 'border-violet-400/20',
    title: 'Violations & Enforcement',
    desc: 'Automatic detection of traffic violations with evidence capture, fine generation, and case management.',
  },
  {
    icon: BarChart2,
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    border: 'border-emerald-400/20',
    title: 'Deep Analytics',
    desc: 'Compare RL-based vs fixed-time performance with live charts tracking throughput, queue lengths, and wait times.',
  },
  {
    icon: Map,
    color: 'text-orange-400',
    bg: 'bg-orange-400/10',
    border: 'border-orange-400/20',
    title: 'Hotspot Mapping',
    desc: 'Real-time congestion heatmaps across intersections to identify and respond to traffic bottlenecks instantly.',
  },
];

const STATS = [
  { value: '40%', label: 'Reduction in Wait Times' },
  { value: '2.3M', label: 'Vehicles Managed Daily' },
  { value: '99.9%', label: 'System Uptime' },
  { value: '<50ms', label: 'Signal Response Time' },
];

const HOW_IT_WORKS = [
  { num: '01', title: 'Connect intersections', desc: 'Integrate via IoT API or upload historical traffic data.' },
  { num: '02', title: 'AI starts learning', desc: 'The RL engine ingests live sensor data and begins modeling traffic patterns.' },
  { num: '03', title: 'Real-time optimization', desc: 'Signal timing is adjusted automatically, every cycle, 24/7.' },
  { num: '04', title: 'Monitor & scale', desc: 'Track gains on your dashboard and expand to new intersections instantly.' },
];

export default function Landing() {
  const [scrollY, setScrollY] = useState(0);
  const [visible, setVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 80);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => { clearTimeout(timer); window.removeEventListener('scroll', handleScroll); };
  }, []);

  const handleLogin = () => base44.auth.redirectToLogin(window.location.origin + '/dashboard');
  const handleRequestAccess = () => navigate('/request-access');

  const navLinks = [
    { href: '#features', label: 'Features' },
    { href: '#how-it-works', label: 'How It Works' },
    { href: '#platform', label: 'Platform' },
  ];

  return (
    <div className="min-h-screen bg-[#020817] text-white overflow-x-hidden font-inter">

      {/* ── Navbar ── */}
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrollY > 40 || menuOpen ? 'rgba(2,8,23,0.96)' : 'transparent',
          backdropFilter: scrollY > 40 || menuOpen ? 'blur(20px)' : 'none',
          borderBottom: scrollY > 40 || menuOpen ? '1px solid rgba(255,255,255,0.06)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div className="relative w-8 h-8 sm:w-9 sm:h-9">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 blur-sm opacity-60" />
              <div className="relative w-full h-full rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center">
                <BrainCircuit className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
            </div>
            <span className="text-sm font-bold tracking-tight">Synapse<span className="text-cyan-400">Flow</span></span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7 text-sm text-white/55">
            {navLinks.map(l => (
              <a key={l.href} href={l.href} className="hover:text-white transition-colors duration-200">{l.label}</a>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={handleLogin}
              className="text-sm text-white/60 hover:text-white transition-colors px-4 py-2"
            >
              Log In
            </button>
            <button
              onClick={handleRequestAccess}
              className="flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 hover:opacity-90 transition-all shadow-lg shadow-cyan-500/25 hover:-translate-y-0.5"
            >
              Get Started <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-white/5 px-4 py-4 flex flex-col gap-1">
            {navLinks.map(l => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="py-2.5 px-3 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors"
              >
                {l.label}
              </a>
            ))}
            <div className="mt-3 pt-3 border-t border-white/5 flex flex-col gap-2">
              <button
                onClick={() => { setMenuOpen(false); handleLogin(); }}
                className="w-full py-3 px-4 rounded-xl border border-white/10 text-sm text-white/70 font-medium hover:bg-white/5 transition-colors"
              >
                Log In
              </button>
              <button
                onClick={() => { setMenuOpen(false); handleRequestAccess(); }}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20"
              >
                Get Started — Request Access
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16">
        {/* Background video */}
        <video
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-25"
          style={{ transform: `translateY(${scrollY * 0.25}px)` }}
        >
          <source src="https://videos.pexels.com/video-files/3214990/3214990-uhd_2560_1440_25fps.mp4" type="video/mp4" />
        </video>

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#020817]/70 via-[#020817]/20 to-[#020817]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#020817]/90 via-transparent to-[#020817]/90" />

        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.07]" style={{
          backgroundImage: `linear-gradient(rgba(6,182,212,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.4) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }} />

        {/* Glow orbs */}
        <div className="absolute top-1/3 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-cyan-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-violet-600/8 rounded-full blur-3xl pointer-events-none" />

        {/* Hero content */}
        <div
          className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto w-full"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(28px)',
            transition: 'opacity 0.85s ease, transform 0.85s ease',
          }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-semibold mb-7 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
            </span>
            AI-Powered Traffic Intelligence · Live
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.06] tracking-tight mb-5">
            <span className="text-white">The Intelligence</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-500">
              Behind Every Green Light
            </span>
          </h1>

          {/* Sub */}
          <p
            className="text-base sm:text-lg text-white/55 max-w-2xl mx-auto leading-relaxed mb-9"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(16px)',
              transition: 'opacity 1s ease 0.2s, transform 1s ease 0.2s',
            }}
          >
            Synapse Flow deploys reinforcement learning at every intersection — optimizing signal timing in real-time to eliminate congestion, cut emissions, and keep cities moving at scale.
          </p>

          {/* CTAs */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full"
            style={{ opacity: visible ? 1 : 0, transition: 'opacity 1s ease 0.35s' }}
          >
            <button
              onClick={handleRequestAccess}
              className="w-full sm:w-auto group flex items-center justify-center gap-3 px-7 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-semibold text-sm shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:-translate-y-0.5 transition-all duration-300"
            >
              Get Started — Free
              <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                <ArrowRight className="w-3 h-3" />
              </span>
            </button>
            <button
              onClick={handleLogin}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 sm:py-4 rounded-full border border-white/15 bg-white/5 text-white font-semibold text-sm backdrop-blur-sm hover:bg-white/10 hover:border-white/25 hover:-translate-y-0.5 transition-all duration-300"
            >
              Log In to Dashboard
            </button>
          </div>

          <p
            className="mt-7 text-xs text-white/25 tracking-wider uppercase"
            style={{ opacity: visible ? 1 : 0, transition: 'opacity 1.2s ease 0.55s' }}
          >
            Trusted by smart city operators across 14 countries
          </p>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/25 animate-bounce">
          <span className="text-[9px] uppercase tracking-widest">Scroll</span>
          <ChevronDown className="w-4 h-4" />
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section id="stats" className="py-14 sm:py-16 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {STATS.map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-2xl sm:text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500 mb-1">{s.value}</p>
              <p className="text-[10px] sm:text-xs text-white/35 uppercase tracking-wider leading-tight">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-20 sm:py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <p className="text-xs text-violet-400 uppercase tracking-widest font-semibold mb-3">Capabilities</p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">Everything you need to manage urban traffic</h2>
            <p className="mt-4 text-white/40 text-sm max-w-xl mx-auto leading-relaxed">
              One platform for AI signal optimization, violation enforcement, and real-time analytics.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className={`group rounded-2xl border ${f.border} bg-white/[0.03] p-5 sm:p-6 hover:bg-white/[0.06] transition-all duration-300 hover:-translate-y-1`}
              >
                <div className={`w-10 h-10 rounded-xl ${f.bg} border ${f.border} flex items-center justify-center mb-4`}>
                  <f.icon className={`w-5 h-5 ${f.color}`} />
                </div>
                <h3 className="text-sm font-bold text-white mb-2">{f.title}</h3>
                <p className="text-xs text-white/40 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="py-20 sm:py-24 px-4 sm:px-6 border-t border-white/5 bg-white/[0.01]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs text-cyan-400 uppercase tracking-widest font-semibold mb-3">How It Works</p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">Up and running in minutes</h2>
            <p className="mt-4 text-white/40 text-sm max-w-lg mx-auto">No complex setup — Synapse Flow is designed to deploy fast and scale faster.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            {HOW_IT_WORKS.map((s) => (
              <div key={s.num} className="flex gap-4 p-5 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center">
                  <span className="text-xs font-black text-white/25 font-mono">{s.num}</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white mb-1">{s.title}</h3>
                  <p className="text-xs text-white/40 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Dashboard Preview ── */}
      <section id="platform" className="py-20 sm:py-24 px-4 sm:px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs text-cyan-400 uppercase tracking-widest font-semibold mb-3">Platform Preview</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Command-center visibility</h2>
            <p className="mt-4 text-white/45 text-sm max-w-lg mx-auto">
              Monitor every intersection, analyze performance, and manage violations — all in one place.
            </p>
          </div>

          {/* Browser frame */}
          <div className="rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_60px_rgba(6,182,212,0.07)]">
            {/* Chrome bar */}
            <div className="bg-[#0d1117] px-3 sm:px-4 py-2.5 flex items-center gap-3 border-b border-white/5">
              <div className="flex gap-1.5 flex-shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
              </div>
              <div className="flex-1 mx-2 sm:mx-4 min-w-0">
                <div className="bg-white/5 rounded px-2 sm:px-3 py-1 flex items-center gap-1.5 max-w-xs mx-auto">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                  <span className="text-[9px] sm:text-[10px] text-white/35 font-mono truncate">app.synapseflow.ai/dashboard</span>
                </div>
              </div>
            </div>

            {/* Dashboard mock */}
            <div className="bg-[#0a0f1e] p-3 sm:p-5">
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 sm:gap-2 mb-3">
                {[
                  { l: 'Avg Wait', v: '32.7s', c: 'text-cyan-400' },
                  { l: 'Vehicles', v: '50', c: 'text-white' },
                  { l: 'Queue', v: '40', c: 'text-yellow-400' },
                  { l: 'Throughput', v: '5/m', c: 'text-emerald-400' },
                  { l: 'Pedestrians', v: '17', c: 'text-white' },
                  { l: 'Crossings', v: '0', c: 'text-white/40' },
                ].map((m) => (
                  <div key={m.l} className="bg-white/[0.04] rounded-lg sm:rounded-xl p-2 sm:p-3 border border-white/[0.06]">
                    <p className="text-[8px] sm:text-[9px] text-white/35 uppercase tracking-wider mb-0.5 sm:mb-1 truncate">{m.l}</p>
                    <p className={`text-sm sm:text-lg font-black font-mono ${m.c}`}>{m.v}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                <div className="bg-white/[0.04] rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/[0.06]">
                  <p className="text-[9px] sm:text-[10px] text-white/35 font-semibold uppercase tracking-wider mb-2 sm:mb-3">Lane Status</p>
                  <div className="space-y-1.5 sm:space-y-2">
                    {[
                      { lane: 'North', green: false },
                      { lane: 'South', green: false },
                      { lane: 'East', green: true },
                      { lane: 'West', green: true },
                    ].map((l) => (
                      <div key={l.lane} className="flex items-center justify-between">
                        <span className="text-[10px] sm:text-[11px] text-white/55">{l.lane}</span>
                        <div className="flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${l.green ? 'bg-emerald-400' : 'bg-red-400'}`} />
                          <span className={`font-mono text-[9px] sm:text-[10px] font-bold ${l.green ? 'text-emerald-400' : 'text-red-400'}`}>
                            {l.green ? 'GREEN' : 'RED'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white/[0.04] rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/[0.06]">
                  <p className="text-[9px] sm:text-[10px] text-white/35 font-semibold uppercase tracking-wider mb-2 sm:mb-3">Avg Wait Comparison</p>
                  <div className="flex items-end gap-1 h-12 sm:h-16">
                    {[28,30,32,29,31,27,33,30,29,31].map((h, i) => (
                      <div key={i} className="flex-1 flex flex-col gap-0.5 items-center justify-end">
                        <div className="w-full rounded-t-sm bg-cyan-500" style={{ height: `${(h / 33) * 100}%` }} />
                        <div className="w-full rounded-t-sm bg-yellow-400 opacity-60" style={{ height: `${((h + 4) / 37) * 80}%` }} />
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3 mt-2">
                    <span className="text-[8px] sm:text-[9px] text-cyan-400">● RL-Based</span>
                    <span className="text-[8px] sm:text-[9px] text-yellow-400">● Fixed-Time</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Ticker ── */}
      <section className="py-10 border-y border-white/5 overflow-hidden">
        <div className="flex gap-10 sm:gap-14 animate-[marquee_22s_linear_infinite] whitespace-nowrap">
          {['Reinforcement Learning', 'Real-Time Optimization', 'Computer Vision', 'Edge Computing', 'Neural Networks', 'Smart City API', 'IoT Sensors', 'Predictive Modeling',
            'Reinforcement Learning', 'Real-Time Optimization', 'Computer Vision', 'Edge Computing'].map((t, i) => (
            <span key={i} className="text-[10px] sm:text-xs text-white/18 uppercase tracking-widest flex items-center gap-2.5 sm:gap-3">
              <span className="w-1 h-1 rounded-full bg-cyan-500 flex-shrink-0" /> {t}
            </span>
          ))}
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/35 via-[#020817] to-violet-950/35" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] h-[200px] sm:h-[280px] bg-cyan-500/5 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/8 bg-white/5 text-xs text-white/40 mb-7">
            <Globe className="w-3 h-3" /> Available globally · No vendor lock-in
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 leading-tight">
            Ready to optimize your<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500">city's traffic?</span>
          </h2>
          <p className="text-white/45 text-sm sm:text-base mb-9 max-w-md mx-auto">
            Join smart city operators using Synapse Flow to build faster, cleaner, smarter cities.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleRequestAccess}
              className="w-full sm:w-auto group flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-bold text-sm shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:-translate-y-0.5 transition-all duration-300"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={handleLogin}
              className="w-full sm:w-auto px-8 py-4 rounded-full border border-white/12 text-white/55 text-sm font-semibold hover:text-white hover:border-white/25 hover:-translate-y-0.5 transition-all duration-300"
            >
              Log In to Dashboard
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 py-8 sm:py-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center">
              <BrainCircuit className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-bold">Synapse<span className="text-cyan-400">Flow</span></span>
          </div>
          <p className="text-xs text-white/20">© 2026 Synapse Flow · Smart Traffic Intelligence Platform</p>
          <div className="flex items-center gap-1.5 text-xs text-white/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            All systems operational
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
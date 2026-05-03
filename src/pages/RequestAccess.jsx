import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import {
  BrainCircuit, ArrowRight, ArrowLeft, Zap, ShieldCheck, BarChart2, Map,
  CheckCircle, Clock, Globe, Cpu
} from 'lucide-react';

const FEATURES = [
  {
    icon: Zap,
    color: 'text-cyan-400',
    bg: 'bg-cyan-400/10',
    border: 'border-cyan-400/20',
    title: 'AI-Driven Signal Control',
    desc: 'Reinforcement learning adapts traffic light timing in real-time, cutting wait times by up to 40%.',
  },
  {
    icon: ShieldCheck,
    color: 'text-violet-400',
    bg: 'bg-violet-400/10',
    border: 'border-violet-400/20',
    title: 'Violations & Enforcement',
    desc: 'Automatic detection with evidence capture, fine generation, and full case management.',
  },
  {
    icon: BarChart2,
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    border: 'border-emerald-400/20',
    title: 'Deep Analytics',
    desc: 'Live charts comparing RL-based vs fixed-time signal performance across every intersection.',
  },
  {
    icon: Map,
    color: 'text-orange-400',
    bg: 'bg-orange-400/10',
    border: 'border-orange-400/20',
    title: 'Hotspot Mapping',
    desc: 'Real-time congestion heatmaps to identify and respond to bottlenecks instantly.',
  },
];

const STEPS = [
  { step: '01', title: 'Create your account', desc: 'Sign up in seconds — no credit card required.' },
  { step: '02', title: 'Connect your intersections', desc: 'Integrate via our IoT API or upload historical traffic data to get started.' },
  { step: '03', title: 'Deploy the AI', desc: 'Synapse Flow begins learning and optimizing signal timing immediately.' },
  { step: '04', title: 'Monitor & improve', desc: 'Track performance gains in real-time via your unified dashboard.' },
];

export default function RequestAccess() {
  const handleSignUp = () => base44.auth.redirectToLogin(window.location.origin + '/dashboard');

  return (
    <div className="min-h-screen bg-[#020817] text-white font-inter overflow-x-hidden">

      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#020817]/90 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center">
              <BrainCircuit className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold text-white">Synapse<span className="text-cyan-400">Flow</span></span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link to="/" className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </Link>
            <button
              onClick={handleSignUp}
              className="flex items-center gap-2 text-sm font-semibold px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 hover:opacity-90 transition-all shadow-lg shadow-cyan-500/20"
            >
              Sign Up <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative py-20 sm:py-28 px-4 sm:px-6 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `linear-gradient(rgba(6,182,212,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.3) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-cyan-500/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-semibold mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
            </span>
            Now available · Smart City Platform
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight mb-5">
            Transform how your city<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500">manages traffic flow</span>
          </h1>

          <p className="text-base sm:text-lg text-white/55 max-w-xl mx-auto leading-relaxed mb-10">
            Synapse Flow uses reinforcement learning to optimize every traffic signal in real-time — eliminating congestion, cutting emissions, and keeping your city moving.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleSignUp}
              className="w-full sm:w-auto group flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-semibold text-sm shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:-translate-y-0.5 transition-all duration-300"
            >
              Continue to Sign Up
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <Link
              to="/"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-white/15 text-white/60 text-sm font-semibold hover:text-white hover:border-white/30 transition-all duration-300"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs text-cyan-400 uppercase tracking-widest font-semibold mb-3">Platform Capabilities</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Everything in one platform</h2>
            <p className="mt-3 text-white/45 text-sm max-w-lg mx-auto">
              AI signal optimization, violation enforcement, and real-time analytics — unified.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className={`rounded-2xl border ${f.border} bg-white/[0.03] p-6 hover:bg-white/[0.05] transition-all duration-300`}
              >
                <div className={`w-10 h-10 rounded-xl ${f.bg} border ${f.border} flex items-center justify-center mb-4`}>
                  <f.icon className={`w-5 h-5 ${f.color}`} />
                </div>
                <h3 className="text-sm font-bold text-white mb-1.5">{f.title}</h3>
                <p className="text-xs text-white/40 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 sm:px-6 border-t border-white/5 bg-white/[0.01]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs text-violet-400 uppercase tracking-widest font-semibold mb-3">How It Works</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Up and running in minutes</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {STEPS.map((s) => (
              <div key={s.step} className="flex gap-5">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <span className="text-xs font-black text-white/30 font-mono">{s.step}</span>
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

      {/* Benefits strip */}
      <section className="py-14 px-4 sm:px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { Icon: Clock, label: 'Setup in minutes', color: 'text-cyan-400' },
            { Icon: Globe, label: 'Global deployment', color: 'text-violet-400' },
            { Icon: Cpu, label: 'Edge AI processing', color: 'text-emerald-400' },
            { Icon: CheckCircle, label: 'No vendor lock-in', color: 'text-orange-400' },
          ].map(({ Icon, label, color }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <Icon className={`w-5 h-5 ${color}`} />
              <span className="text-xs text-white/50 leading-tight">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6 border-t border-white/5 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-4">Ready to get started?</h2>
          <p className="text-white/45 text-sm mb-8">Create your account and start optimizing traffic today.</p>
          <button
            onClick={handleSignUp}
            className="w-full sm:w-auto group inline-flex items-center justify-center gap-3 px-10 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-bold text-sm shadow-2xl shadow-cyan-500/30 hover:-translate-y-0.5 hover:shadow-cyan-500/50 transition-all duration-300"
          >
            Create Free Account
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center">
              <BrainCircuit className="w-3 h-3 text-white" />
            </div>
            <span className="text-xs font-bold text-white">Synapse<span className="text-cyan-400">Flow</span></span>
          </div>
          <p className="text-xs text-white/20">© 2026 Synapse Flow · Smart Traffic Intelligence</p>
          <div className="flex items-center gap-1.5 text-xs text-white/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            All systems operational
          </div>
        </div>
      </footer>
    </div>
  );
}
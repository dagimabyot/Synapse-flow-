import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useSimulation } from '@/lib/SimulationContext';
import { Activity, Zap, BrainCircuit } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Topbar() {
  const { state, appMode } = useSimulation();
  const isAdmin = appMode === 'admin';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-950/95 backdrop-blur supports-[backdrop-filter]:bg-slate-950/90">
      <div className="flex h-14 items-center px-4 md:px-6 gap-3">
        {/* Logo */}
        <div className="flex items-center gap-2.5 mr-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center shadow-lg flex-shrink-0">
            <BrainCircuit className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-sm font-bold text-white tracking-tight">Synapse Flow</span>
            <span className="text-[9px] text-slate-400 font-mono hidden sm:block">Smart Traffic Intelligence</span>
          </div>
        </div>

        <div className="h-5 w-px bg-slate-700 hidden md:block" />

        {/* Sim Status */}
        <div className="hidden md:flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${state.running ? 'bg-green-400 animate-pulse' : 'bg-slate-500'}`} />
          <span className="text-xs text-slate-400 font-mono">
            Tick {state.tick} · {state.running ? 'Running' : 'Paused'}
          </span>
        </div>

        <Badge
          variant={state.mode === 'rl' ? 'default' : 'secondary'}
          className="text-[10px] font-mono hidden md:flex items-center gap-1"
        >
          <Zap className="w-3 h-3" />
          {state.mode === 'rl' ? 'RL Adaptive' : 'Fixed-Time'}
        </Badge>

        <div className="flex-1" />

        {/* Emergency */}
        {state.emergency && (
          <Badge variant="destructive" className="animate-pulse text-xs">
            🚨 {state.emergency}
          </Badge>
        )}

        {/* Alerts */}
        {state.alerts.length > 0 && (
          <Badge variant="outline" className="border-yellow-500 text-yellow-400 text-xs hidden md:flex">
            ⚠ {state.alerts.length}
          </Badge>
        )}

        {/* Mode Label */}
        <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold ${isAdmin ? 'border-blue-500/40 bg-blue-500/10 text-blue-300' : 'border-violet-500/40 bg-violet-500/10 text-violet-300'}`}>
          <Activity className="w-3 h-3" />
          {isAdmin ? 'Admin' : 'Dev'}
        </div>

        {/* Theme Toggle */}
        <ThemeToggle />
      </div>
    </header>
  );
}
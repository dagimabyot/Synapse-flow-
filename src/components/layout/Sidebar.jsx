import React from 'react';
import { cn } from '@/lib/utils';
import { useSimulation } from '@/lib/SimulationContext';
import {
  LayoutDashboard, TrafficCone, AlertTriangle, Camera,
  BarChart2, Map, Settings, HelpCircle, Brain, TrendingUp,
  RotateCcw, SlidersHorizontal, FlaskConical, ScrollText,
  GitCompare, Shield, Code2, Activity, ChevronRight, ChevronsLeft, ChevronsRight
} from 'lucide-react';

const ADMIN_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'live-traffic', label: 'Live Traffic Control', icon: TrafficCone },
  { id: 'violations', label: 'Violations Center', icon: AlertTriangle },
  { id: 'evidence', label: 'Evidence Panel', icon: Camera },
  { id: 'violation-enforcement', label: 'Violation & Enforcement', icon: Shield },
  { id: 'analytics', label: 'Analytics', icon: BarChart2 },
  { id: 'hotspot', label: 'Hotspot Map', icon: Map },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'help', label: 'Help', icon: HelpCircle },
];

const DEV_ITEMS = [
  { id: 'ai-lab', label: 'AI Simulation Lab', icon: Brain },
  { id: 'reward-analytics', label: 'Reward Analytics', icon: TrendingUp },
  { id: 'scenario-replay', label: 'Scenario Replay', icon: RotateCcw },
  { id: 'param-control', label: 'Parameter Control', icon: SlidersHorizontal },
  { id: 'experiment', label: 'Experiment Mode', icon: FlaskConical },
  { id: 'system-logs', label: 'System Logs', icon: ScrollText },
  { id: 'perf-comparison', label: 'Perf. Comparison', icon: GitCompare },
  { id: 'hotspot', label: 'Hotspot Map', icon: Map },
  { id: 'help', label: 'Help', icon: HelpCircle },
];

export default function Sidebar({ activePage, onNavigate }) {
  const { appMode, setAppMode, state, sidebarCollapsed, setSidebarCollapsed } = useSimulation();
  const isAdmin = appMode === 'admin';
  const items = isAdmin ? ADMIN_ITEMS : DEV_ITEMS;
  const col = sidebarCollapsed;

  return (
    <aside className={cn(
      'min-h-[calc(100vh-56px)] border-r border-white/10 flex flex-col transition-all duration-300 relative',
      col ? 'w-[58px]' : 'w-60',
      isAdmin ? 'bg-slate-950' : 'bg-[#0f172a]'
    )}>
      {/* Collapse Toggle */}
      <button
        onClick={() => setSidebarCollapsed(!col)}
        className="absolute -right-3 top-4 z-10 w-6 h-6 rounded-full bg-slate-800 border border-white/20 flex items-center justify-center hover:bg-slate-700 transition-colors shadow-lg"
        title={col ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {col
          ? <ChevronsRight className="w-3 h-3 text-white/60" />
          : <ChevronsLeft className="w-3 h-3 text-white/60" />}
      </button>

      {/* Role Badge */}
      <div className="px-3 py-3 border-b border-white/10">
        <div className={cn(
          'flex items-center rounded-lg px-2 py-2 overflow-hidden transition-all',
          isAdmin ? 'bg-blue-600/20 border border-blue-500/30' : 'bg-violet-600/20 border border-violet-500/30',
          col ? 'justify-center' : 'gap-2'
        )}>
          {isAdmin
            ? <Shield className="w-4 h-4 text-blue-400 flex-shrink-0" />
            : <Code2 className="w-4 h-4 text-violet-400 flex-shrink-0" />}
          {!col && (
            <div>
              <p className={cn('text-xs font-bold', isAdmin ? 'text-blue-300' : 'text-violet-300')}>
                {isAdmin ? 'Admin Mode' : 'Developer Mode'}
              </p>
              <p className="text-[9px] text-white/40">{isAdmin ? 'Operational Control' : 'RL Analysis System'}</p>
            </div>
          )}
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-2 px-2 overflow-y-auto overflow-x-hidden space-y-0.5">
        {items.map(item => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              title={col ? item.label : undefined}
              className={cn(
                'w-full flex items-center rounded-lg transition-all group relative',
                col ? 'justify-center px-0 py-2.5' : 'gap-3 px-3 py-2.5',
                isActive
                  ? isAdmin ? 'bg-blue-600 text-white' : 'bg-violet-600 text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/8'
              )}
            >
              <Icon className={cn('w-4 h-4 flex-shrink-0', isActive ? 'text-white' : 'text-white/40 group-hover:text-white/70')} />
              {!col && <span className="text-xs font-medium truncate">{item.label}</span>}
              {!col && isActive && <ChevronRight className="w-3 h-3 ml-auto text-white/60 flex-shrink-0" />}

              {/* Tooltip when collapsed */}
              {col && (
                <span className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 border border-white/10 shadow-lg transition-opacity">
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Mode Switcher */}
      <div className={cn('p-3 border-t border-white/10', col ? 'px-2' : '')}>
        {!col && <p className="text-[9px] text-white/30 uppercase tracking-wider mb-2 px-1">Switch Mode</p>}
        <div className={cn('gap-1.5', col ? 'flex flex-col' : 'grid grid-cols-2')}>
          <button
            onClick={() => { setAppMode('admin'); onNavigate('dashboard'); }}
            title={col ? 'Admin Mode' : undefined}
            className={cn(
              'flex items-center justify-center gap-1.5 py-2 rounded-lg text-[10px] font-semibold transition-all',
              col ? 'px-0' : '',
              isAdmin ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
            )}
          >
            <Shield className="w-3.5 h-3.5" />
            {!col && 'Admin'}
          </button>
          <button
            onClick={() => { setAppMode('developer'); onNavigate('ai-lab'); }}
            title={col ? 'Developer Mode' : undefined}
            className={cn(
              'flex items-center justify-center gap-1.5 py-2 rounded-lg text-[10px] font-semibold transition-all',
              col ? 'px-0' : '',
              !isAdmin ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/40' : 'bg-violet-500/20 text-violet-300 hover:bg-violet-600 hover:text-white'
            )}
          >
            <Code2 className="w-3.5 h-3.5" />
            {!col && 'Dev'}
          </button>
        </div>
      </div>

      {/* Status */}
      {!col && (
        <div className="px-3 pb-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/5">
            <Activity className="w-3 h-3 text-white/30 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[9px] text-white/30">Sim Tick</p>
              <p className="text-[10px] font-mono text-white/60">{state.tick} · {state.running ? '▶ Live' : '⏸ Paused'}</p>
            </div>
            <div className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', state.running ? 'bg-green-400 animate-pulse' : 'bg-white/20')} />
          </div>
        </div>
      )}

      {col && (
        <div className="px-2 pb-3">
          <div className="flex justify-center">
            <div className={cn('w-2 h-2 rounded-full', state.running ? 'bg-green-400 animate-pulse' : 'bg-white/20')} />
          </div>
        </div>
      )}
    </aside>
  );
}
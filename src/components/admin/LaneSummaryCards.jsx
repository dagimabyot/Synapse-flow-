import React from 'react';
import { useSimulation } from '@/lib/SimulationContext';
import { LANES } from '@/lib/simulationEngine';
import { cn } from '@/lib/utils';
import { Clock, Car, ArrowUpDown, Activity } from 'lucide-react';

const SIGNAL_DOT = {
  green: 'bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.7)]',
  yellow: 'bg-yellow-400 shadow-[0_0_6px_rgba(234,179,8,0.7)]',
  red: 'bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.7)]',
};

const SIGNAL_TEXT = {
  green: 'text-green-600 dark:text-green-400',
  yellow: 'text-yellow-600 dark:text-yellow-400',
  red: 'text-red-600 dark:text-red-400',
};

const WAIT_COLOR = (wait) =>
  wait > 30 ? 'text-red-500' : wait > 15 ? 'text-yellow-500' : 'text-green-500';

export default function LaneSummaryCards() {
  const { state } = useSimulation();

  return (
    <div>
      <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        Real-Time Lane Summary
      </h2>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {LANES.map(lane => {
          const data = state.lanes[lane];
          const sig = state.signals[lane];
          const queuePct = Math.min((data.queue / 20) * 100, 100);
          const isEmergency = state.emergency === lane;

          return (
            <div
              key={lane}
              className={cn(
                'rounded-xl border p-4 bg-card transition-all duration-300 hover:shadow-md',
                isEmergency
                  ? 'border-red-500/60 bg-red-500/5 shadow-[0_0_12px_rgba(239,68,68,0.15)]'
                  : 'border-border'
              )}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={cn('w-2.5 h-2.5 rounded-full flex-shrink-0', SIGNAL_DOT[sig])} />
                  <span className="text-sm font-bold text-foreground">{lane}</span>
                  {isEmergency && (
                    <span className="text-[9px] bg-red-500 text-white px-1 py-0.5 rounded font-bold">EMRG</span>
                  )}
                </div>
                <span className={cn('text-[10px] font-mono font-bold uppercase', SIGNAL_TEXT[sig])}>
                  {sig}
                </span>
              </div>

              {/* Stats */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span className="text-[10px]">Wait Time</span>
                  </div>
                  <span className={cn('text-sm font-bold font-mono', WAIT_COLOR(data.waitTime))}>
                    {data.waitTime}s
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Car className="w-3 h-3" />
                    <span className="text-[10px]">Vehicles</span>
                  </div>
                  <span className="text-sm font-bold font-mono text-foreground">{data.vehicles}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <ArrowUpDown className="w-3 h-3" />
                    <span className="text-[10px]">Queue</span>
                  </div>
                  <span className="text-sm font-bold font-mono text-foreground">{data.queue}</span>
                </div>

                {/* Queue Bar */}
                <div className="pt-1">
                  <div className="flex justify-between text-[9px] text-muted-foreground mb-1">
                    <span>Queue Load</span>
                    <span>{Math.round(queuePct)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all duration-700',
                        queuePct > 70 ? 'bg-red-500' : queuePct > 40 ? 'bg-yellow-500' : 'bg-green-500'
                      )}
                      style={{ width: `${queuePct}%` }}
                    />
                  </div>
                </div>

                {/* Throughput */}
                <div className="flex items-center justify-between pt-1 border-t border-border">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Activity className="w-3 h-3" />
                    <span className="text-[10px]">Throughput</span>
                  </div>
                  <span className="text-[11px] font-mono font-semibold text-primary">{data.throughput} veh</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
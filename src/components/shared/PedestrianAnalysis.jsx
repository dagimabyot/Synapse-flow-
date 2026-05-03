import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSimulation } from '@/lib/SimulationContext';
import { LANES } from '@/lib/simulationEngine';
import { cn } from '@/lib/utils';

const LANE_DIRS = { North: '↑', South: '↓', East: '→', West: '←' };

export default function PedestrianAnalysis() {
  const { state } = useSimulation();

  // Derive pedestrian data per lane from simulation state
  const laneData = LANES.map(lane => {
    const sig = state.signals[lane];
    const waiting = Math.max(0, Math.round(state.lanes[lane].queue * 0.6 + Math.sin(state.tick * 0.2 + LANES.indexOf(lane)) * 3));
    const crossing = sig === 'green' ? Math.max(0, Math.round(waiting * 0.4)) : 0;
    const avgWait = parseFloat((state.lanes[lane].waitTime * 1.1).toFixed(1));
    return { lane, waiting, crossing, avgWait, sig };
  });

  const totalWaiting = laneData.reduce((s, d) => s + d.waiting, 0);
  const totalCrossing = laneData.reduce((s, d) => s + d.crossing, 0);
  const overallAvgWait = (laneData.reduce((s, d) => s + d.avgWait, 0) / 4).toFixed(1);
  const maxWaiting = Math.max(...laneData.map(d => d.waiting), 1);

  return (
    <Card>
      <CardHeader className="pb-2 pt-4 px-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <span className="text-lg">🚶</span> Pedestrian Analysis
          </CardTitle>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-violet-500 inline-block" />
              <span className="text-muted-foreground font-mono font-semibold">{totalWaiting} waiting</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
              <span className="text-muted-foreground font-mono font-semibold">{totalCrossing} crossing</span>
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4 space-y-3">
        {/* Summary KPIs */}
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-lg bg-muted/50 p-2.5 text-center">
            <p className="text-[9px] text-muted-foreground uppercase tracking-wide mb-0.5">Total Waiting</p>
            <p className="text-lg font-bold text-blue-600 font-mono">{totalWaiting}</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-2.5 text-center">
            <p className="text-[9px] text-muted-foreground uppercase tracking-wide mb-0.5">Active Crossings</p>
            <p className="text-lg font-bold text-green-600 font-mono">{totalCrossing}</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-2.5 text-center">
            <p className="text-[9px] text-muted-foreground uppercase tracking-wide mb-0.5">Avg Wait (s)</p>
            <p className="text-lg font-bold text-orange-500 font-mono">{overallAvgWait}</p>
          </div>
        </div>

        {/* Per-lane breakdown */}
        <div className="space-y-2">
          {laneData.map(({ lane, waiting, crossing, avgWait, sig }) => {
            const ratio = waiting / maxWaiting;
            const barColor = sig === 'green' ? 'bg-green-500' : sig === 'yellow' ? 'bg-yellow-400' : 'bg-red-400';
            const dotColor = sig === 'green' ? 'bg-green-500' : sig === 'yellow' ? 'bg-yellow-400' : 'bg-red-500';
            return (
              <div key={lane} className="flex items-center gap-3">
                <span className="text-[11px] text-muted-foreground w-4 text-center">{LANE_DIRS[lane]}</span>
                <span className="text-[11px] font-medium w-10">{lane}</span>
                <div className={cn('w-2 h-2 rounded-full flex-shrink-0', dotColor)} />
                <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={cn('h-full rounded-full transition-all duration-500', barColor, 'opacity-70')}
                    style={{ width: `${Math.max(ratio * 100, 4)}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono text-muted-foreground w-4 text-right">{waiting}</span>
                <span className="text-[10px] text-muted-foreground w-16 text-right">{avgWait}s wait</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
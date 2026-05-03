import React, { useEffect, useRef } from 'react';
import { useSimulation } from '@/lib/SimulationContext';
import { LANES } from '@/lib/simulationEngine';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const CAR_COLORS = ['#3b82f6', '#f97316', '#8b5cf6', '#ec4899', '#14b8a6', '#f43f5e', '#84cc16', '#06b6d4'];

const SIGNAL_COLORS_CSS = { green: '#22c55e', yellow: '#eab308', red: '#ef4444' };

function LaneVisual({ lane, signal, vehicles, queue, waitTime }) {
  const isGreen = signal === 'green';
  const isYellow = signal === 'yellow';
  const displayCars = Math.min(vehicles, 8);
  const carList = Array.from({ length: displayCars });

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Lane Label */}
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{lane}</p>

      {/* Traffic Light */}
      <div className="flex flex-col items-center gap-1 bg-slate-800 rounded-xl p-1.5 border border-slate-700 shadow-lg">
        {['red', 'yellow', 'green'].map(color => (
          <div
            key={color}
            className="w-4 h-4 rounded-full transition-all duration-500"
            style={{
              backgroundColor: signal === color ? SIGNAL_COLORS_CSS[color] : '#374151',
              boxShadow: signal === color ? `0 0 10px 3px ${SIGNAL_COLORS_CSS[color]}80` : 'none',
            }}
          />
        ))}
      </div>

      {/* Signal Text */}
      <span className={cn(
        'text-[9px] font-mono font-bold uppercase',
        signal === 'green' ? 'text-green-500' : signal === 'yellow' ? 'text-yellow-500' : 'text-red-500'
      )}>{signal}</span>

      {/* Car Queue */}
      <div className="flex flex-col-reverse items-center gap-1 min-h-[120px] justify-end">
        {carList.map((_, i) => {
          const isMoving = isGreen && i === displayCars - 1;
          return (
            <div
              key={i}
              className={cn(
                'rounded-sm transition-all duration-700',
                isMoving ? 'opacity-40 -translate-y-1' : 'opacity-100'
              )}
              style={{
                width: 18,
                height: 28,
                backgroundColor: CAR_COLORS[i % CAR_COLORS.length],
                boxShadow: `0 2px 4px rgba(0,0,0,0.3)`,
                borderRadius: 4,
                position: 'relative',
              }}
            >
              {/* Windshield */}
              <div style={{
                position: 'absolute',
                top: 5, left: 3, right: 3, height: 8,
                backgroundColor: 'rgba(255,255,255,0.35)',
                borderRadius: 2,
              }} />
            </div>
          );
        })}
        {displayCars === 0 && (
          <p className="text-[9px] text-muted-foreground italic">Empty</p>
        )}
      </div>

      {/* Stats */}
      <div className="text-center">
        <p className={cn(
          'text-xs font-bold font-mono',
          waitTime > 30 ? 'text-red-500' : waitTime > 15 ? 'text-yellow-500' : 'text-green-500'
        )}>{waitTime}s</p>
        <p className="text-[9px] text-muted-foreground">{queue} queued</p>
      </div>
    </div>
  );
}

export default function TrafficLightVisual() {
  const { state } = useSimulation();

  return (
    <Card>
      <CardHeader className="pb-2 pt-4 px-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold">Live Intersection — Vehicle Simulation</CardTitle>
          <span className="text-[10px] text-muted-foreground font-mono">Tick {state.tick}</span>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-5">
        <div className="grid grid-cols-4 gap-4">
          {LANES.map(lane => (
            <LaneVisual
              key={lane}
              lane={lane}
              signal={state.signals[lane]}
              vehicles={state.lanes[lane].vehicles}
              queue={state.lanes[lane].queue}
              waitTime={state.lanes[lane].waitTime}
            />
          ))}
        </div>

        {/* Road divider visual */}
        <div className="mt-4 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="mt-3 flex justify-between items-center text-[10px] text-muted-foreground">
          <span>🚦 Each column = one lane</span>
          <span>Cars = vehicles in queue</span>
          <span>Time = avg wait</span>
        </div>
      </CardContent>
    </Card>
  );
}
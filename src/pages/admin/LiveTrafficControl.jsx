import React from 'react';
import { useSimulation } from '@/lib/SimulationContext';
import IntersectionCanvas from '@/components/intersection/IntersectionCanvas';
import AdminControls from '@/components/admin/AdminControls';
import LaneSummaryCards from '@/components/admin/LaneSummaryCards';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrafficCone, Zap } from 'lucide-react';
import { LANES } from '@/lib/simulationEngine';

const SIGNAL_COLORS = { green: 'bg-green-500', yellow: 'bg-yellow-400', red: 'bg-red-500' };
const SIGNAL_TEXT = { green: 'text-green-600', yellow: 'text-yellow-600', red: 'text-red-600' };

export default function LiveTrafficControl() {
  const { state } = useSimulation();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 flex-wrap">
        <TrafficCone className="w-5 h-5 text-orange-500" />
        <h1 className="text-xl font-bold text-foreground">Live Traffic Control</h1>
        <Badge variant={state.running ? 'default' : 'secondary'} className="text-[10px]">
          {state.running ? '● Live' : '⏸ Paused'}
        </Badge>
        <Badge variant="outline" className="text-[10px]">
          {state.mode === 'rl'
            ? <><Zap className="w-3 h-3 mr-1 inline" />RL Adaptive</>
            : 'Fixed-Time'}
        </Badge>
      </div>

      {/* Lane Summary Cards */}
      <LaneSummaryCards />

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Intersection canvas — bigger */}
        <div className="lg:col-span-3 flex flex-col items-center gap-3">
          <Card className="w-full">
            <CardHeader className="pb-2 pt-4 px-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">4-Way Intersection</CardTitle>
                <span className="text-[10px] font-mono text-muted-foreground">
                  Phase {state.currentPhase + 1}/2 · T={state.phaseTimer}s
                </span>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4 flex justify-center">
              <IntersectionCanvas />
            </CardContent>
          </Card>

          {/* Signal Status */}
          <Card className="w-full">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm font-semibold">Signal Status</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="grid grid-cols-4 gap-2">
                {LANES.map(lane => {
                  const sig = state.signals[lane];
                  return (
                    <div key={lane} className="flex items-center gap-2 p-2 rounded-lg bg-muted/40">
                      <div className={`w-3 h-3 rounded-full ${SIGNAL_COLORS[sig]}`} />
                      <span className="text-xs font-medium">{lane}</span>
                      <span className={`text-[10px] font-mono ml-auto ${SIGNAL_TEXT[sig]}`}>{sig.toUpperCase()}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Controls */}
        <div className="lg:col-span-2">
          <AdminControls />
        </div>
      </div>


    </div>
  );
}
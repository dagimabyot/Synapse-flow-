import React from 'react';
import { useSimulation } from '@/lib/SimulationContext';
import { WaitTimeChart, QueueLengthChart, ThroughputChart, RewardTrendChart } from '@/components/shared/SimulationChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart2, TrendingUp, TrendingDown, Zap, Clock } from 'lucide-react';
import { LANES } from '@/lib/simulationEngine';
import PedestrianAnalytics from '@/components/shared/PedestrianAnalytics';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  LineChart, Line, ReferenceLine,
} from 'recharts';

export default function Analytics() {
  const { state } = useSimulation();

  const laneData = LANES.map(lane => ({
    lane,
    vehicles: state.lanes[lane].vehicles,
    queue: state.lanes[lane].queue,
    wait: parseFloat(state.lanes[lane].waitTime.toFixed(1)),
    throughput: state.lanes[lane].throughput,
  }));

  const radarData = LANES.map(lane => ({
    lane,
    Pressure: Math.round(
      (state.lanes[lane].vehicles * 0.4 + state.lanes[lane].queue * 0.35 + state.lanes[lane].waitTime * 0.25) * 10
    ) / 10,
  }));

  const avgWait = (LANES.reduce((s, l) => s + state.lanes[l].waitTime, 0) / 4).toFixed(1);
  const efficiency = state.metrics.rewardHistory.length > 0
    ? Math.max(0, Math.min(100, 50 + state.metrics.totalReward * 0.5)).toFixed(1)
    : '—';

  // Build AI vs Standard wait time comparison data
  const comparisonData = state.metrics.waitHistory.map((rl, i) => ({
    tick: i + 1,
    'AI (RL)': parseFloat(rl?.toFixed(1)),
    'Standard': parseFloat((state.metrics.fixedWaitHistory[i] ?? rl)?.toFixed(1)),
  }));

  // Show last 20 ticks max
  const comparisonSlice = comparisonData.slice(-20);

  // Summary: avg of last 5 ticks
  const last5 = (arr) => arr.slice(-5);
  const avgOf = (arr) => arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1) : '—';
  const rlAvg5 = avgOf(last5(state.metrics.waitHistory));
  const fixedAvg5 = avgOf(last5(state.metrics.fixedWaitHistory));
  const improvement = state.metrics.fixedWaitHistory.length > 0 && rlAvg5 !== '—' && fixedAvg5 !== '—'
    ? (((parseFloat(fixedAvg5) - parseFloat(rlAvg5)) / parseFloat(fixedAvg5)) * 100).toFixed(1)
    : null;

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center gap-2 flex-wrap">
        <BarChart2 className="w-5 h-5 text-blue-500" />
        <h1 className="text-xl font-bold">Traffic Analytics</h1>
        <Badge variant="outline" className="text-[10px]">Tick {state.tick}</Badge>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Avg Wait', value: `${avgWait}s`, trend: 'down', icon: Clock },
          { label: 'System Efficiency', value: `${efficiency}%`, trend: 'up', icon: TrendingUp },
          { label: 'Total Throughput', value: LANES.reduce((s, l) => s + state.lanes[l].throughput, 0), trend: 'up', icon: TrendingUp },
          { label: 'Total Reward', value: state.metrics.totalReward.toFixed(1), trend: 'up', icon: Zap },
        ].map(item => (
          <Card key={item.label}>
            <CardContent className="pt-4 pb-3 px-4">
              <div className="flex items-center justify-between mb-1">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{item.label}</p>
                {item.trend === 'up'
                  ? <TrendingUp className="w-3.5 h-3.5 text-green-500" />
                  : <TrendingDown className="w-3.5 h-3.5 text-red-500" />}
              </div>
              <p className="text-2xl font-bold font-mono text-foreground">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ★ AI vs Standard Wait Time Comparison */}
      <Card className="border-primary/30">
        <CardHeader className="pb-2 pt-4 px-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                AI-Driven vs Standard Traffic Lights — Wait Time
              </CardTitle>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                Comparing RL-adaptive signal control against fixed-time scheduling
              </p>
            </div>
            {improvement && (
              <div className="flex gap-2">
                <Badge className="bg-primary/10 text-primary border border-primary/30 text-[10px]">
                  AI avg: {rlAvg5}s
                </Badge>
                <Badge variant="outline" className="text-[10px]">
                  Standard avg: {fixedAvg5}s
                </Badge>
                <Badge className={`text-[10px] ${parseFloat(improvement) > 0 ? 'bg-green-500/10 text-green-600 border border-green-500/30' : 'bg-red-500/10 text-red-500 border border-red-500/30'}`}>
                  {parseFloat(improvement) > 0 ? `↓ ${improvement}% better` : `↑ ${Math.abs(improvement)}% worse`}
                </Badge>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="px-2 pb-4">
          {comparisonSlice.length < 2 ? (
            <div className="h-48 flex items-center justify-center text-muted-foreground text-xs">
              Start the simulation to see comparison data…
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={comparisonSlice} margin={{ top: 5, right: 16, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="rlGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="tick"
                  tick={{ fontSize: 9 }}
                  stroke="hsl(var(--muted-foreground))"
                  label={{ value: 'Tick', position: 'insideBottomRight', offset: -5, fontSize: 9 }}
                />
                <YAxis
                  tick={{ fontSize: 9 }}
                  stroke="hsl(var(--muted-foreground))"
                  label={{ value: 'Wait (s)', angle: -90, position: 'insideLeft', fontSize: 9 }}
                />
                <Tooltip
                  contentStyle={{
                    fontSize: 11,
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 8,
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}
                  formatter={(val, name) => [`${val}s`, name]}
                />
                <Legend
                  wrapperStyle={{ fontSize: 11 }}
                  formatter={(val) => val === 'AI (RL)' ? '🤖 AI (RL Adaptive)' : '⏱ Standard Fixed-Time'}
                />
                <Line
                  type="monotone"
                  dataKey="AI (RL)"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="Standard"
                  stroke="hsl(var(--chart-3))"
                  strokeWidth={2}
                  strokeDasharray="5 3"
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Lane Comparison Bar */}
        <Card>
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm font-semibold">Lane Vehicle & Queue Comparison</CardTitle>
          </CardHeader>
          <CardContent className="px-2 pb-3">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={laneData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="lane" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 9 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ fontSize: 11, backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="vehicles" fill="hsl(var(--chart-1))" name="Vehicles" radius={[3, 3, 0, 0]} />
                <Bar dataKey="queue" fill="hsl(var(--chart-4))" name="Queue" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Radar */}
        <Card>
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm font-semibold">Lane Pressure (RL State)</CardTitle>
          </CardHeader>
          <CardContent className="px-2 pb-3 flex justify-center">
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="lane" tick={{ fontSize: 10 }} />
                <PolarRadiusAxis tick={{ fontSize: 8 }} />
                <Radar name="Pressure" dataKey="Pressure" stroke="hsl(var(--chart-1))" fill="hsl(var(--chart-1))" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <WaitTimeChart />
        <QueueLengthChart />
        <ThroughputChart />
        <RewardTrendChart />
      </div>

      <PedestrianAnalytics />
    </div>
  );
}
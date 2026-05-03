import React, { useState, useEffect } from 'react';
import { useSimulation } from '@/lib/SimulationContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DollarSign, CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react';

const VIOLATION_TYPES = ['Red Light Run', 'Speeding', 'Wrong Lane', 'Blocked Box'];
const FINES = { 'Red Light Run': 500, 'Speeding': 350, 'Wrong Lane': 200, 'Blocked Box': 150 };
const LANES = ['North', 'South', 'East', 'West'];
const STATUSES = ['Pending', 'Paid', 'Disputed', 'Overdue'];

function genFine(id, tick) {
  const type = VIOLATION_TYPES[Math.floor(Math.random() * VIOLATION_TYPES.length)];
  return {
    id,
    type,
    amount: FINES[type] + Math.floor(Math.random() * 100),
    status: STATUSES[Math.floor(Math.random() * STATUSES.length)],
    plate: `${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}-${Math.floor(1000 + Math.random() * 9000)}`,
    lane: LANES[Math.floor(Math.random() * LANES.length)],
    issuedAt: new Date(Date.now() - Math.random() * 86400000).toLocaleDateString(),
    dueDate: new Date(Date.now() + Math.random() * 1296000000).toLocaleDateString(),
    tick,
  };
}

export default function PunishmentSystem() {
  const { state } = useSimulation();
  const [fines, setFines] = useState(() => Array.from({ length: 15 }, (_, i) => genFine(i + 1, i + 1)));
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    if (state.running && state.tick % 7 === 0 && state.tick > 0) {
      setFines(f => [genFine(Date.now(), state.tick), ...f].slice(0, 60));
    }
  }, [state.tick]);

  const updateStatus = (id, newStatus) => setFines(f => f.map(fi => fi.id === id ? { ...fi, status: newStatus } : fi));

  const filtered = fines.filter(f => filter === 'All' || f.status === filter);
  const totalCollected = fines.filter(f => f.status === 'Paid').reduce((s, f) => s + f.amount, 0);
  const totalPending = fines.filter(f => f.status === 'Pending').reduce((s, f) => s + f.amount, 0);
  const totalOverdue = fines.filter(f => f.status === 'Overdue').length;

  const statusColor = { Pending: 'bg-yellow-100 text-yellow-700', Paid: 'bg-green-100 text-green-700', Disputed: 'bg-blue-100 text-blue-700', Overdue: 'bg-red-100 text-red-700' };

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center gap-2">
        <DollarSign className="w-5 h-5 text-green-500" />
        <h1 className="text-xl font-bold">Punishment System</h1>
        <Badge className="text-[10px] bg-green-600">Auto Fine Engine</Badge>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card><CardContent className="pt-4 pb-3 px-4">
          <p className="text-[10px] text-muted-foreground uppercase">Total Fines</p>
          <p className="text-2xl font-bold font-mono">{fines.length}</p>
        </CardContent></Card>
        <Card><CardContent className="pt-4 pb-3 px-4">
          <p className="text-[10px] text-muted-foreground uppercase">Collected</p>
          <p className="text-2xl font-bold font-mono text-green-600">RM {totalCollected.toLocaleString()}</p>
        </CardContent></Card>
        <Card><CardContent className="pt-4 pb-3 px-4">
          <p className="text-[10px] text-muted-foreground uppercase">Pending</p>
          <p className="text-2xl font-bold font-mono text-yellow-600">RM {totalPending.toLocaleString()}</p>
        </CardContent></Card>
        <Card><CardContent className="pt-4 pb-3 px-4">
          <p className="text-[10px] text-muted-foreground uppercase">Overdue</p>
          <p className="text-2xl font-bold font-mono text-red-600">{totalOverdue}</p>
        </CardContent></Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs text-muted-foreground">Filter:</span>
        {['All', ...STATUSES].map(s => (
          <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1 rounded-full text-[10px] font-semibold transition-all ${filter === s ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>{s}</button>
        ))}
        <Button size="sm" variant="outline" className="ml-auto h-7 text-xs" onClick={() => setFines(f => [genFine(Date.now(), state.tick), ...f].slice(0, 60))}>
          + Issue Fine
        </Button>
      </div>

      {/* Fines Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  {['Plate', 'Violation', 'Lane', 'Amount', 'Status', 'Issued', 'Due', 'Action'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[10px] text-muted-foreground font-semibold uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((fine, i) => (
                  <tr key={fine.id} className={`border-b border-border/50 hover:bg-muted/20 ${i % 2 === 0 ? '' : 'bg-muted/10'}`}>
                    <td className="px-4 py-2.5 font-mono font-bold">{fine.plate}</td>
                    <td className="px-4 py-2.5">{fine.type}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{fine.lane}</td>
                    <td className="px-4 py-2.5 font-mono font-semibold text-foreground">RM {fine.amount}</td>
                    <td className="px-4 py-2.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColor[fine.status]}`}>{fine.status}</span>
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground font-mono text-[10px]">{fine.issuedAt}</td>
                    <td className="px-4 py-2.5 text-muted-foreground font-mono text-[10px]">{fine.dueDate}</td>
                    <td className="px-4 py-2.5">
                      <div className="flex gap-1">
                        {fine.status === 'Pending' && (
                          <button onClick={() => updateStatus(fine.id, 'Paid')} className="p-1 rounded hover:bg-green-100 text-green-600 transition-colors">
                            <CheckCircle className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {fine.status !== 'Dismissed' && (
                          <button onClick={() => updateStatus(fine.id, 'Disputed')} className="p-1 rounded hover:bg-blue-100 text-blue-600 transition-colors">
                            <Clock className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
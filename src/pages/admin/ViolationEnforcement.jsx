import React, { useState, useEffect } from 'react';
import { useSimulation } from '@/lib/SimulationContext';
import { Shield, Search, Filter, Eye, CheckCircle, XCircle, RotateCcw, Send, TrendingUp, Clock, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const VIOLATION_TYPES = ['Red Light Run', 'Speeding', 'Wrong Lane', 'Blocked Box', 'Illegal U-Turn', 'Pedestrian Zone Violation'];
const INTERSECTIONS = ['Central Ave', 'Harbor Blvd', 'Oak & 5th', 'Main St', 'Tech Park'];
const SIGNALS = ['RED', 'YELLOW', 'GREEN'];

function genViolation(id) {
  const type = VIOLATION_TYPES[Math.floor(Math.random() * VIOLATION_TYPES.length)];
  const isPedestrian = type === 'Pedestrian Zone Violation';
  const plate = isPedestrian ? 'Pedestrian' : `${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}-${Math.floor(1000 + Math.random() * 9000)}`;
  const confidence = Math.floor(55 + Math.random() * 45);
  const h = Math.floor(10 + Math.random() * 2);
  const m = Math.floor(Math.random() * 60);
  const s = Math.floor(Math.random() * 60);
  const timeStr = `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  const signal = SIGNALS[Math.floor(Math.random() * SIGNALS.length)];
  const phase = `${Math.floor(1 + Math.random() * 3)}/${Math.floor(3 + Math.random() * 2)}`;
  return {
    id,
    type,
    plate,
    intersection: INTERSECTIONS[Math.floor(Math.random() * INTERSECTIONS.length)],
    confidence,
    time: timeStr,
    signal,
    phase,
    status: 'Pending',
    isPedestrian,
  };
}

const CONFIDENCE_COLOR = (c) => {
  if (c >= 80) return 'bg-green-500';
  if (c >= 60) return 'bg-yellow-500';
  return 'bg-red-500';
};

const STATUS_STYLE = {
  Pending: 'bg-yellow-100 text-yellow-700 border border-yellow-300',
  Confirmed: 'bg-green-100 text-green-700 border border-green-300',
  Rejected: 'bg-red-100 text-red-700 border border-red-300',
  Sent: 'bg-blue-100 text-blue-700 border border-blue-300',
};

function QuickReviewModal({ violation, onClose, onConfirm, onReject }) {
  if (!violation) return null;
  const signalColor = { RED: '#ef4444', YELLOW: '#eab308', GREEN: '#22c55e' };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-blue-500" />
            <span className="font-bold text-sm text-gray-800">Quick Review — Violation #{String(violation.id).slice(-4)}</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        {/* Video frame mock */}
        <div className="relative bg-[#0a0f1e] mx-5 mt-4 rounded-xl overflow-hidden h-36">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-10 bg-gray-600 rounded-full opacity-40" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="px-4 py-1 bg-red-500/90 rounded-full text-white text-[10px] font-bold">{violation.type}</div>
          </div>
          {/* corner brackets */}
          <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-yellow-400 rounded-tl" />
          <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-yellow-400 rounded-tr" />
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-yellow-400 rounded-bl" />
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-yellow-400 rounded-br" />
          {/* AI badge */}
          <div className="absolute top-2 right-8 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">AI: {violation.confidence}%</div>
          {/* timestamp */}
          <div className="absolute bottom-2 left-2 text-[9px] text-white/50 font-mono">{violation.time} · CAM-VAR</div>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-3 px-5 py-4">
          <div>
            <p className="text-[9px] text-gray-400 uppercase tracking-wider flex items-center gap-1 mb-1">
              <span className="w-3 h-3 text-gray-400">🚗</span> Plate
            </p>
            <p className="text-sm font-bold text-gray-800 font-mono">{violation.plate}</p>
          </div>
          <div>
            <p className="text-[9px] text-gray-400 uppercase tracking-wider flex items-center gap-1 mb-1">
              📍 Intersection
            </p>
            <p className="text-sm font-semibold text-gray-800">{violation.intersection}</p>
          </div>
          <div>
            <p className="text-[9px] text-gray-400 uppercase tracking-wider flex items-center gap-1 mb-1">
              🕐 Time
            </p>
            <p className="text-sm font-semibold text-gray-800">{violation.time}</p>
          </div>
          <div>
            <p className="text-[9px] text-gray-400 uppercase tracking-wider flex items-center gap-1 mb-1">
              🔖 Violation Type
            </p>
            <p className="text-sm font-semibold text-gray-800">{violation.type}</p>
          </div>
        </div>

        {/* Signal info */}
        <div className="px-5 pb-4 flex items-center gap-2 text-sm text-gray-600">
          <AlertTriangle className="w-4 h-4 text-yellow-500" />
          <span className="text-xs">Signal at time of violation:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: signalColor[violation.signal] }} />
            <span className="font-bold text-xs" style={{ color: signalColor[violation.signal] }}>{violation.signal}</span>
          </div>
          <span className="ml-auto text-xs text-gray-400">Phase {violation.phase}</span>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 px-5 pb-5">
          <button
            onClick={() => { onConfirm(violation.id); onClose(); }}
            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold text-sm transition-colors"
          >
            <CheckCircle className="w-4 h-4" /> Confirm Violation
          </button>
          <button
            onClick={() => { onReject(violation.id); onClose(); }}
            className="flex items-center justify-center gap-2 py-3 rounded-xl border border-red-300 text-red-500 hover:bg-red-50 font-semibold text-sm transition-colors"
          >
            <XCircle className="w-4 h-4" /> Reject
          </button>
        </div>
      </div>
    </div>
  );
}

function MiniAnalytics({ violations }) {
  const byIntersection = INTERSECTIONS.map(name => ({
    name: name.split(' ')[0],
    count: violations.filter(v => v.intersection === name).length,
  }));

  const byType = VIOLATION_TYPES.map(type => ({
    type,
    short: type.split(' ').slice(0, 2).join(' '),
    count: violations.filter(v => v.type === type).length,
  })).sort((a, b) => b.count - a.count);

  // Fake time series
  const timeData = Array.from({ length: 7 }, (_, i) => ({
    time: `${10 + i}:00`,
    count: Math.floor(5 + Math.random() * 35),
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border p-5">
          <h3 className="text-sm font-bold text-gray-800 mb-4">Violations by Intersection</h3>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={byIntersection}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl border p-5">
          <h3 className="text-sm font-bold text-gray-800 mb-4">Violations Over Time</h3>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={timeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="time" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4, fill: '#3b82f6' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl border p-5">
        <h3 className="text-sm font-bold text-gray-800 mb-4">Violation Type Breakdown</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {byType.map(({ type, count }) => {
            const total = violations.length || 1;
            const pct = Math.round((count / total) * 100);
            return (
              <div key={type}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-700 font-medium truncate">{type}</span>
                  <span className="text-sm font-bold text-gray-900 ml-2">{count}</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full">
                  <div className="h-1.5 bg-blue-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
                <p className="text-[10px] text-gray-400 mt-0.5">{pct}%</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function ViolationEnforcement() {
  const { state } = useSimulation();
  const [violations, setViolations] = useState(() => Array.from({ length: 14 }, (_, i) => genViolation(i + 1)));
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [intersectionFilter, setIntersectionFilter] = useState('All Intersections');
  const [activeTab, setActiveTab] = useState('live');
  const [reviewViolation, setReviewViolation] = useState(null);
  const [sentCount, setSentCount] = useState(0);

  useEffect(() => {
    if (state.running && state.tick % 5 === 0 && state.tick > 0) {
      setViolations(v => [genViolation(Date.now()), ...v].slice(0, 80));
    }
  }, [state.tick]);

  const updateStatus = (id, newStatus) => {
    setViolations(v => v.map(vi => vi.id === id ? { ...vi, status: newStatus } : vi));
    if (newStatus === 'Sent') setSentCount(s => s + 1);
  };

  const simulateDetection = () => {
    setViolations(v => [genViolation(Date.now()), ...v].slice(0, 80));
  };

  const syncConfirmed = () => {
    const confirmed = violations.filter(v => v.status === 'Confirmed');
    confirmed.forEach(v => updateStatus(v.id, 'Sent'));
  };

  const counts = {
    total: violations.length,
    pending: violations.filter(v => v.status === 'Pending').length,
    confirmed: violations.filter(v => v.status === 'Confirmed').length,
    rejected: violations.filter(v => v.status === 'Rejected').length,
    sent: violations.filter(v => v.status === 'Sent').length,
  };

  const filtered = violations.filter(v => {
    const matchSearch = !search || v.plate.toLowerCase().includes(search.toLowerCase()) || v.type.toLowerCase().includes(search.toLowerCase()) || v.intersection.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || v.status === statusFilter;
    const matchIntersection = intersectionFilter === 'All Intersections' || v.intersection === intersectionFilter;
    return matchSearch && matchStatus && matchIntersection;
  });

  const statCards = [
    { label: 'TOTAL TODAY', value: counts.total, color: 'text-gray-900', icon: null, bg: 'bg-white' },
    { label: 'PENDING REVIEW', value: counts.pending, color: 'text-yellow-500', icon: <Clock className="w-4 h-4 text-yellow-400" />, bg: 'bg-yellow-50' },
    { label: 'CONFIRMED', value: counts.confirmed, color: 'text-green-600', icon: <CheckCircle className="w-4 h-4 text-green-500" />, bg: 'bg-green-50' },
    { label: 'REJECTED', value: counts.rejected, color: 'text-red-500', icon: <XCircle className="w-4 h-4 text-red-400" />, bg: 'bg-red-50' },
    { label: 'SENT TO SYSTEM', value: counts.sent, icon: <Send className="w-4 h-4 text-blue-400" />, color: 'text-blue-500', bg: 'bg-blue-50' },
  ];

  return (
    <div className="min-h-full bg-gray-50">
      <QuickReviewModal
        violation={reviewViolation}
        onClose={() => setReviewViolation(null)}
        onConfirm={(id) => updateStatus(id, 'Confirmed')}
        onReject={(id) => updateStatus(id, 'Rejected')}
      />

      <div className="p-4 sm:p-6 space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-blue-500" />
            <h1 className="text-xl font-bold text-gray-900">Violation & Enforcement</h1>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 border border-red-200 text-red-600 text-[10px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              Live Detection
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={simulateDetection}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 text-xs font-semibold hover:bg-gray-50 transition-colors shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Simulate Detection
            </button>
            <button
              onClick={syncConfirmed}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white text-xs font-semibold hover:bg-blue-600 transition-colors shadow-sm"
            >
              <Send className="w-3.5 h-3.5" /> Sync Confirmed ({counts.confirmed})
            </button>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {statCards.map((s) => (
            <div key={s.label} className={`${s.bg} rounded-xl border border-gray-200 p-4 shadow-sm`}>
              <div className="flex items-center justify-between mb-1">
                <p className="text-[9px] text-gray-400 uppercase tracking-wider font-semibold">{s.label}</p>
                {s.icon}
              </div>
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('live')}
            className={`flex items-center gap-2 pb-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'live' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
          >
            <Shield className="w-3.5 h-3.5" /> Live Violations
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 pb-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'analytics' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
          >
            <TrendingUp className="w-3.5 h-3.5" /> Mini Analytics
          </button>
        </div>

        {activeTab === 'live' ? (
          <>
            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search plate, type, intersection..."
                  className="w-full pl-9 pr-4 py-2.5 text-xs rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                {['All', 'Pending', 'Confirmed', 'Rejected', 'Sent'].map(s => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-3 py-2 rounded-lg text-[11px] font-semibold transition-colors ${statusFilter === s ? 'bg-blue-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                  >
                    {s}
                  </button>
                ))}
                <select
                  value={intersectionFilter}
                  onChange={e => setIntersectionFilter(e.target.value)}
                  className="pl-2 pr-6 py-2 text-[11px] rounded-lg border border-gray-200 bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                >
                  <option>All Intersections</option>
                  {INTERSECTIONS.map(i => <option key={i}>{i}</option>)}
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      {['TIME', 'INTERSECTION', 'TYPE', 'PLATE / ENTITY', 'AI CONFIDENCE', 'STATUS', 'ACTIONS'].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-[10px] text-gray-400 font-semibold uppercase tracking-wider whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filtered.slice(0, 25).map((v) => (
                      <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-mono text-[11px] text-gray-600 whitespace-nowrap">{v.time}</td>
                        <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{v.intersection}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px]">{v.isPedestrian ? '🚶' : '🚗'}</span>
                            <span className="text-gray-700">{v.type}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`font-mono font-bold ${v.isPedestrian ? 'text-gray-400 italic' : 'text-gray-900'}`}>{v.plate}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2 min-w-[80px]">
                            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${CONFIDENCE_COLOR(v.confidence)}`} style={{ width: `${v.confidence}%` }} />
                            </div>
                            <span className="text-[10px] text-gray-500 font-mono w-7">{v.confidence}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${STATUS_STYLE[v.status] || ''}`}>{v.status}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setReviewViolation(v)}
                              className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-400 hover:text-blue-600 transition-colors"
                              title="Review"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => updateStatus(v.id, 'Confirmed')}
                              className="p-1.5 rounded-lg hover:bg-green-50 text-green-400 hover:text-green-600 transition-colors"
                              title="Confirm"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => updateStatus(v.id, 'Rejected')}
                              className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors"
                              title="Reject"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filtered.length === 0 && (
                  <div className="py-12 text-center text-sm text-gray-400">No violations match your filters.</div>
                )}
              </div>
            </div>
          </>
        ) : (
          <MiniAnalytics violations={violations} />
        )}
      </div>
    </div>
  );
}
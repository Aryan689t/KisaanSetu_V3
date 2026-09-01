import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { BarChart3, TrendingUp, Clock, CheckCircle2 } from 'lucide-react';

const centreLoadData = [
  { name: 'Sonipat', queue: 12, capacity: 58, waitMin: 24 },
  { name: 'Karnal', queue: 38, capacity: 91, waitMin: 75 },
  { name: 'Panipat', queue: 22, capacity: 76, waitMin: 45 },
  { name: 'Rohtak', queue: 10, capacity: 40, waitMin: 20 }
];

const dailyVolumeData = [
  { date: 'Aug 24', Paddy: 3200, Wheat: 1400 },
  { date: 'Aug 25', Paddy: 4100, Wheat: 1800 },
  { date: 'Aug 26', Paddy: 3800, Wheat: 2100 },
  { date: 'Aug 27', Paddy: 5200, Wheat: 2400 },
  { date: 'Aug 28', Paddy: 6100, Wheat: 2900 },
  { date: 'Aug 29 (Today)', Paddy: 7400, Wheat: 3200 }
];

export const AnalyticsCharts = () => {
  return (
    <div className="space-y-6">
      
      {/* Procurement Performance Summary Strip */}
      <div className="paper-surface rounded-2xl p-4 border border-agri-ivory-muted shadow-agri-sm grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div className="p-3 bg-agri-ivory/50 rounded-xl border border-agri-ivory-muted">
          <span className="text-[10px] uppercase font-bold text-agri-text-muted">Today's Completions</span>
          <div className="font-heading font-extrabold text-lg text-agri-text mt-0.5">
            1,420 <span className="text-xs font-normal text-agri-text-muted">/ 1,840 booked</span>
          </div>
        </div>

        <div className="p-3 bg-agri-ivory/50 rounded-xl border border-agri-ivory-muted">
          <span className="text-[10px] uppercase font-bold text-agri-text-muted">Avg Processing Time</span>
          <div className="font-heading font-extrabold text-lg text-agri-green mt-0.5 flex items-center gap-1">
            <Clock className="w-4 h-4 text-agri-green shrink-0" />
            18.5 <span className="text-xs font-normal text-agri-text-muted">min / farmer</span>
          </div>
        </div>

        <div className="p-3 bg-agri-ivory/50 rounded-xl border border-agri-ivory-muted">
          <span className="text-[10px] uppercase font-bold text-agri-text-muted">Peak Clearance Rate</span>
          <div className="font-heading font-extrabold text-lg text-agri-text mt-0.5">
            142 Qtl <span className="text-xs font-normal text-agri-text-muted">/ hr / centre</span>
          </div>
        </div>

        <div className="p-3 bg-agri-ivory/50 rounded-xl border border-agri-ivory-muted">
          <span className="text-[10px] uppercase font-bold text-agri-text-muted">Direct Benefit Disbursal Rate</span>
          <div className="font-heading font-extrabold text-lg text-agri-green mt-0.5 flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-agri-green shrink-0" />
            94.8% <span className="text-xs font-normal text-agri-text-muted">within 24 hrs</span>
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Centre Load Comparison Chart */}
        <div className="paper-surface rounded-2xl p-6 border border-agri-ivory-muted shadow-agri-sm">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-agri-ivory-muted">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-agri-green" />
              <h4 className="font-heading font-bold text-sm text-agri-text">
                Mandi Capacity Load vs. Est. Waiting Time
              </h4>
            </div>
            <span className="text-[10px] font-bold text-agri-green bg-agri-green-soft px-2 py-0.5 rounded border border-agri-green-border">
              Yard Load Telemetry
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={centreLoadData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E0D5" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#243126' }} />
                <YAxis tick={{ fontSize: 11, fill: '#243126' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFDF7', borderColor: '#E5E0D5', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="capacity" name="Yard Capacity (%)" fill="#245C3A" radius={[4, 4, 0, 0]} />
                <Bar dataKey="waitMin" name="Est. Wait (Min)" fill="#D89B32" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Procurement Volume Chart */}
        <div className="paper-surface rounded-2xl p-6 border border-agri-ivory-muted shadow-agri-sm">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-agri-ivory-muted">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-agri-gold-dark" />
              <h4 className="font-heading font-bold text-sm text-agri-text">
                State Daily Procurement Volume Trend (Quintals)
              </h4>
            </div>
            <span className="text-[10px] text-agri-text-muted">Kharif Season 2026</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyVolumeData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E0D5" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#243126' }} />
                <YAxis tick={{ fontSize: 11, fill: '#243126' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFDF7', borderColor: '#E5E0D5', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line type="monotone" dataKey="Paddy" stroke="#245C3A" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Wheat" stroke="#D89B32" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

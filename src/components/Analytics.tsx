import React, { useState } from 'react';
import { Card, Badge, Button } from './ui';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  LineChart, 
  Line 
} from 'recharts';
import { HISTORICAL_INFLATION_DATA, FUEL_BASELINE } from '../constants';
import { TrendingUp, Activity, PieChart, Globe } from 'lucide-react';

const fuelTrendData = [
  { month: 'Jan', petrol: 270, diesel: 280, ho: 290 },
  { month: 'Feb', petrol: 272, diesel: 282, ho: 295 },
  { month: 'Mar', petrol: 275, diesel: 285, ho: 300 },
  { month: 'Apr', petrol: 280, diesel: 290, ho: 310 },
  { month: 'May', petrol: 285, diesel: 295, ho: 320 },
];

const projectionData = [
  { month: 'Jun (Proj)', inflation: 24.2 },
  { month: 'Jul (Proj)', inflation: 25.8 },
  { month: 'Aug (Proj)', inflation: 26.5 },
];

export const Analytics = () => {
  return (
    <div className="space-y-8 pb-10">
      {/* Hero Header */}
      <div className="relative h-48 md:h-64 w-full rounded-[32px] overflow-hidden border border-slate-200 mb-2 group bg-white">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
        <img 
          src="https://res.cloudinary.com/dybzcwykm/image/upload/v1777828130/feature2_aengm2.png" 
          alt="Market Analytics Map" 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-50"
        />
        <div className="absolute bottom-8 left-8 z-20">
          <div className="flex items-center gap-2 mb-2">
             <div className="h-1 w-8 bg-black rounded-full" />
             <span className="text-[11px] font-black uppercase tracking-[0.3em] text-black">Granular Market Datasets</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Market Analytics</h1>
          <p className="text-slate-600 font-medium text-sm mt-1">Deep-dive into economic indicators and projections.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-black" />
              <h3 className="text-lg font-bold">Fuel Price Trajectory</h3>
            </div>
            <Badge variant="default">Q1-Q2 2026</Badge>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={fuelTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="month" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #334155', borderRadius: '8px' }}
                />
                <Legend iconType="circle" />
                <Line type="monotone" dataKey="petrol" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="diesel" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="ho" stroke="#F59E0B" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-black flex-shrink-0" />
              <h3 className="text-lg font-bold">Inflation Projection Engine</h3>
            </div>
            <Badge variant="error">High Risk</Badge>
          </div>
          <div className="h-[350px]">
             <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[...HISTORICAL_INFLATION_DATA.slice(-3), ...projectionData]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="month" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #334155', borderRadius: '8px' }}
                />
                <Bar dataKey="inflation" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="md:col-span-2">
           <div className="flex items-center gap-2 mb-6">
              <Globe className="w-5 h-5 text-black" />
              <h3 className="text-lg font-bold">Policy Trade-off Matrix</h3>
           </div>
           <div className="relative overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-[10px] font-black uppercase text-slate-500 tracking-widest border-b border-slate-200">
                  <tr>
                    <th className="pb-4">Strategy</th>
                    <th className="pb-4">Fiscal Buffer</th>
                    <th className="pb-4">Public Sentiment</th>
                    <th className="pb-4">Growth Impact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr className="text-sm">
                    <td className="py-4 font-bold text-slate-700">Subsidy Push</td>
                    <td className="py-4 text-rose-500">- High</td>
                    <td className="py-4 text-emerald-500">+ Positive</td>
                    <td className="py-4 font-medium">Moderate</td>
                  </tr>
                  <tr className="text-sm">
                    <td className="py-4 font-bold text-slate-700">Fiscal Tightening</td>
                    <td className="py-4 text-emerald-500">+ High</td>
                    <td className="py-4 text-rose-500">- Negative</td>
                    <td className="py-4 font-medium">Contractionary</td>
                  </tr>
                  <tr className="text-sm">
                    <td className="py-4 font-bold text-slate-700">Balanced Realism</td>
                    <td className="py-4 text-amber-500">Neutral</td>
                    <td className="py-4 text-amber-500">Mixed</td>
                    <td className="py-4 font-medium">Sustainable</td>
                  </tr>
                </tbody>
              </table>
           </div>
        </Card>

        <Card className="bg-white flex flex-col items-center justify-center text-center p-10 border-slate-200 shadow-[0_0_30px_rgba(0,0,0,0.04)]">
          <PieChart className="w-12 h-12 text-black mb-6" />
            <h4 className="text-xl font-bold mb-2">Confidence Score</h4>
          <p className="text-5xl font-black text-black">92.4%</p>
            <p className="mt-4 text-xs text-slate-500 font-medium leading-relaxed">Derived from multiple regression models against PIDE and SBP baselines.</p>
        </Card>
      </div>
    </div>
  );
};

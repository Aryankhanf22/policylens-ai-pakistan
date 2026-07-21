import React, { useEffect, useState } from 'react';
import { Card, Badge, Button } from './ui';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  Zap, 
  Users, 
  Building2,
  ArrowUpRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { HISTORICAL_INFLATION_DATA, BASE_INFLATION } from '../constants';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../hooks/useAuth';
import { Simulation } from '../types';

export const Dashboard = () => {
  const { user } = useAuth();
  const [recentSims, setRecentSims] = useState<Simulation[]>([]);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'simulations'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc'),
      limit(3)
    );
    return onSnapshot(q, (snapshot) => {
      setRecentSims(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Simulation)));
    });
  }, [user]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Hero Header */}
      <div className="relative h-48 md:h-64 w-full rounded-[32px] overflow-hidden border border-white/5 mb-2 group">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />
        <img 
          src="https://res.cloudinary.com/dybzcwykm/image/upload/v1777827762/iamge_dwison.png" 
          alt="Pakistan Economic Map" 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60"
        />
        <div className="absolute bottom-8 left-8 z-20">
          <div className="flex items-center gap-2 mb-2">
             <div className="h-1 w-8 bg-black rounded-full" />
             <span className="text-[11px] font-black uppercase tracking-[0.3em] text-black">Policy Intelligence Hub</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Command Overview</h1>
          <p className="text-slate-600 font-medium text-sm mt-1">Monitoring Pakistan's macro-economic pulse.</p>
        </div>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Baseline Inflation" 
          value={`${BASE_INFLATION}%`} 
          trend="+1.2%" 
          trendType="up"
          icon={TrendingUp}
          color="text-black"
        />
        <MetricCard 
          title="Avg Fuel Index" 
          value="286.7" 
          trend="-2.4" 
          trendType="down"
          icon={Zap}
          color="text-black"
        />
        <MetricCard 
          title="Policy Confidence" 
          value="94.2%" 
          trend="Stable" 
          trendType="neutral"
          icon={AlertCircle}
          color="text-black"
        />
        <MetricCard 
          title="Simulations Run" 
          value={recentSims.length.toString()} 
          trend="Active" 
          trendType="neutral"
          icon={Users}
          color="text-black"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <Card className="lg:col-span-2 min-h-[400px]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold">Historical Inflation Trend</h3>
              <p className="text-xs text-slate-500 font-medium">CPI trajectory over the last 5 years.</p>
            </div>
            <Badge variant="default">Pakistan Aggregate</Badge>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={HISTORICAL_INFLATION_DATA}>
                <defs>
                  <linearGradient id="colorInf" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="year" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: '#F8FAFC' }}
                />
                <Area type="monotone" dataKey="inflation" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorInf)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Recent */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">Recent Lab Runs</h3>
            <Button variant="ghost" size="sm" className="text-[10px] uppercase font-bold tracking-wider">View All</Button>
          </div>
          <div className="space-y-4">
            {recentSims.length > 0 ? recentSims.map((sim, i) => (
              <div key={i} className="group p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-black/30 transition-all cursor-pointer">
                <div className="flex items-start justify-between mb-2">
                  <p className="font-bold text-sm truncate">{sim.name}</p>
                  <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-black transition-colors" />
                </div>
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-tighter">Inflation</p>
                    <p className={`text-sm font-black ${sim.inflation > 25 ? 'text-rose-500' : 'text-black'}`}>{sim.inflation.toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-tighter">Risk</p>
                    <Badge variant={sim.riskLevel === 'Severe' ? 'severe' : sim.riskLevel === 'High' ? 'error' : 'success'}>{sim.riskLevel}</Badge>
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-12">
                <p className="text-xs text-slate-500 font-medium italic">No simulations yet.<br/>Head to the Lab to start.</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Market Segments */}
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="flex items-center gap-6 group hover:bg-slate-50 transition-colors cursor-pointer">
          <Building2 className="w-10 h-10 text-black group-hover:scale-110 transition-transform flex-shrink-0" />
          <div>
            <h4 className="font-bold">Business Sector Exposure</h4>
            <p className="text-xs text-slate-500 mt-1 font-medium">84% of manufacturing units are at fuel-shock risk.</p>
          </div>
        </Card>
        <Card className="flex items-center gap-6 group hover:bg-slate-50 transition-colors cursor-pointer">
          <Users className="w-10 h-10 text-black group-hover:scale-110 transition-transform flex-shrink-0" />
          <div>
            <h4 className="font-bold">Household Burn Index</h4>
            <p className="text-xs text-slate-500 mt-1 font-medium">Middle-income families spend 22% more on fuel YoY.</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, trend, trendType, icon: Icon, color }: any) => (
  <Card className="relative group overflow-hidden">
    <div className="absolute top-0 right-0 w-24 h-24 bg-black/5 blur-3xl -z-10 group-hover:bg-black/10 transition-colors" />
    <div className="flex items-start justify-between mb-4">
      <Icon className={`w-6 h-6 ${color}`} />
      {trend && (
        <span className={`text-[10px] font-bold uppercase tracking-widest ${
          trendType === 'up' ? 'text-rose-500' : 
          trendType === 'down' ? 'text-emerald-500' : 'text-slate-400'
        }`}>
          {trend}
        </span>
      )}
    </div>
    <h3 className="text-xs text-slate-500 uppercase font-black tracking-widest mb-1">{title}</h3>
    <p className="text-3xl font-black tracking-tighter text-slate-900">{value}</p>
  </Card>
);

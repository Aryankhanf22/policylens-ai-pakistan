import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from './ui';
import { Calendar, Plus, Fuel, Info, Trash2, PieChart, Sparkles } from 'lucide-react';
import { collection, query, where, orderBy, getDocs, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../hooks/useAuth';
import { HabitLog as HabitType } from '../types';
import { getHabitSummary } from '../services/gemini';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';

export const HabitLog = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState<HabitType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  
  // Form state
  const [fuelType, setFuelType] = useState('Petrol');
  const [amount, setAmount] = useState<number>(2000);
  const [liters, setLiters] = useState<number>(7);

  const [summary, setSummary] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, [user]);

  const fetchLogs = async () => {
    if (!user) return;
    setIsLoading(true);
    const q = query(
      collection(db, 'habitLogs'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    setLogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as HabitType)));
    setIsLoading(false);
  };

  const handleAdd = async () => {
    if (!user) return;
    setIsAdding(true);
    try {
      await addDoc(collection(db, 'habitLogs'), {
        userId: user.uid,
        fuelType,
        amountPKR: amount,
        liters,
        createdAt: serverTimestamp()
      });
      fetchLogs();
      setAmount(2000);
      setLiters(7);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, 'habitLogs', id));
    fetchLogs();
  };

  const handleAnalyze = async () => {
    if (logs.length === 0) return;
    setIsAnalyzing(true);
    const res = await getHabitSummary(logs.slice(0, 10)); // Analyze last 10 logs
    setSummary(res || '');
    setIsAnalyzing(false);
  };

  const totalSpent = logs.reduce((acc, log) => acc + log.amountPKR, 0);

  return (
    <div className="space-y-8 max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Hero Header */}
      <div className="relative h-48 md:h-60 w-full rounded-[32px] overflow-hidden border border-white/5 mb-2 group">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
        <img 
          src="https://res.cloudinary.com/dybzcwykm/image/upload/v1777828130/feature2_aengm2.png" 
          alt="Habit Log Banner" 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-40"
        />
        <div className="absolute bottom-8 left-8 right-8 z-20 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
               <div className="h-1 w-8 bg-black rounded-full" />
               <span className="text-[11px] font-black uppercase tracking-[0.3em] text-black">Personal Mobility Ledger</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Habit Log</h1>
            <p className="text-slate-600 font-medium text-sm mt-1">Tracking personal mobility expenses and optimization.</p>
          </div>
          <Button onClick={handleAnalyze} variant="primary" size="sm" className="h-10 px-6 backdrop-blur-md" disabled={isAnalyzing || logs.length === 0}>
            <Sparkles className="w-4 h-4 mr-2" /> {isAnalyzing ? 'Analyzing...' : 'AI Insights'}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Plus className="w-5 h-5 text-black" /> New Entry
            </h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Fuel Type</label>
                <select 
                  value={fuelType}
                  onChange={(e) => setFuelType(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-sm text-slate-900"
                >
                  <option>Petrol</option>
                  <option>Diesel</option>
                  <option>HOBC</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Amount (PKR)</label>
                <input 
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-sm text-slate-900"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Liters (Est)</label>
                <input 
                  type="number"
                  value={liters}
                  onChange={(e) => setLiters(parseFloat(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-sm text-slate-900"
                />
              </div>
              <Button onClick={handleAdd} className="w-full" disabled={isAdding}>
                {isAdding ? 'Adding...' : 'Log Expense'}
              </Button>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-slate-100 to-slate-50 border-slate-200">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Total Logging</h4>
            <p className="text-4xl font-black text-slate-900 tracking-tighter">PKR {totalSpent.toLocaleString()}</p>
            <p className="text-[10px] text-black font-bold mt-2 uppercase tracking-tight">Across {logs.length} sessions</p>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {summary && (
             <Card className="border-l-4 border-l-black">
                <h3 className="text-sm font-black uppercase tracking-widest text-black mb-4 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> Weekly AI Optimization
                </h3>
                <div className="prose prose-invert prose-sm max-w-none">
                    <div className="markdown-body">
                        <Markdown>{summary}</Markdown>
                    </div>
                </div>
                <Button variant="ghost" size="sm" className="mt-4" onClick={() => setSummary('')}>Dismiss</Button>
             </Card>
          )}

          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Date</th>
                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Refuel</th>
                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Amount</th>
                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {logs.map((log) => (
                    <tr key={log.id} className="group hover:bg-slate-50 transition-colors">
                      <td className="py-4 text-xs font-medium text-slate-400">
                        {log.createdAt ? new Date(log.createdAt.toDate()).toLocaleDateString() : 'Pending'}
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <Fuel className="w-4 h-4 text-black" />
                          <span className="text-sm font-bold">{log.fuelType}</span>
                          <span className="text-[10px] text-slate-500">{log.liters}L</span>
                        </div>
                      </td>
                      <td className="py-4 text-sm font-bold text-right">PKR {log.amountPKR.toLocaleString()}</td>
                      <td className="py-4 text-right">
                        <button 
                          onClick={() => log.id && handleDelete(log.id)}
                          className="p-2 text-slate-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {!isLoading && logs.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-20 text-center text-slate-500 italic text-sm">
                        No logs found. Start by adding your first fuel entry.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

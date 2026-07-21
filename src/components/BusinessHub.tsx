import React, { useState } from 'react';
import { Card, Button, Badge } from './ui';
import { Building2, TrendingUp, HelpCircle, History, Calculator, Sparkles } from 'lucide-react';
import { FUEL_BASELINE } from '../constants';
import { getBusinessAdvice } from '../services/gemini';
import { useAuth } from '../hooks/useAuth';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';

export const BusinessHub = () => {
  const { user } = useAuth();
  const [businessType, setBusinessType] = useState('Distribution Service');
  const [dailyFuel, setDailyFuel] = useState(15);
  const [oldPrice, setOldPrice] = useState(FUEL_BASELINE.petrol);
  const [newPrice, setNewPrice] = useState(FUEL_BASELINE.petrol + 20);
  
  const [advice, setAdvice] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const costIncrease = (newPrice - oldPrice) * dailyFuel;
  const monthlyImpact = costIncrease * 30;

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    const result = await getBusinessAdvice(businessType, dailyFuel, newPrice - oldPrice);
    setAdvice(result || '');
    
    if (user) {
      await addDoc(collection(db, 'businessLogs'), {
        userId: user.uid,
        businessType,
        dailyFuelUsage: dailyFuel,
        oldPrice,
        newPrice,
        costIncrease: monthlyImpact,
        aiAdvice: result,
        createdAt: serverTimestamp()
      });
    }
    setIsAnalyzing(false);
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Hero Header */}
      <div className="relative h-48 md:h-64 w-full rounded-[32px] overflow-hidden border border-white/5 mb-2 group">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
        <img 
          src="https://res.cloudinary.com/dybzcwykm/image/upload/v1777828129/feature1_l42w6o.png" 
          alt="Business Impact Hub" 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-50"
        />
        <div className="absolute bottom-8 left-8 z-20">
          <div className="flex items-center gap-2 mb-2">
             <div className="h-1 w-8 bg-black rounded-full" />
             <span className="text-[11px] font-black uppercase tracking-[0.3em] text-black">Enterprise Resilience Matrix</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Business Impact Hub</h1>
          <p className="text-slate-600 font-medium text-sm mt-1">Quantify and mitigate fuel-shocks for your enterprise.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <div className="flex items-center gap-3 mb-8">
            <Calculator className="w-6 h-6 text-black flex-shrink-0" />
            <h3 className="text-lg font-bold uppercase tracking-tight">Calculation Engine</h3>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Business Category</label>
              <select 
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:border-black transition-colors outline-none text-slate-900"
              >
                <option>Distribution Service</option>
                <option>Manufacturing Unit</option>
                <option>Retail Store</option>
                <option>Agricultural Farm</option>
                <option>Ride Hailing Service</option>
                <option>Milk Shop / Dairy</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Daily Fuel Usage (Liters)</label>
              <input 
                type="number"
                value={dailyFuel}
                onChange={(e) => setDailyFuel(parseFloat(e.target.value))}
                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:border-black transition-colors outline-none text-slate-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Old Price (PKR)</label>
                <input 
                  type="number"
                  value={oldPrice}
                  onChange={(e) => setOldPrice(parseFloat(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:border-black transition-colors outline-none text-slate-900"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">New Price (PKR)</label>
                <input 
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(parseFloat(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:border-black transition-colors outline-none text-slate-900"
                />
              </div>
            </div>

            <Button onClick={handleAnalyze} className="w-full h-12" disabled={isAnalyzing}>
              {isAnalyzing ? 'Running AI Engine...' : 'Run Analysis & Get Advice'}
            </Button>
          </div>
        </Card>

        <Card className="flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp className="w-6 h-6 text-black flex-shrink-0" />
            <h3 className="text-lg font-bold uppercase tracking-tight">Projected Loss Invariance</h3>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center space-y-8 text-center py-8">
            <div className="space-y-1">
              <p className="text-xs text-slate-500 uppercase font-black tracking-widest">Monthly Cost Increase</p>
              <p className="text-5xl font-black text-rose-500 tracking-tighter">PKR {monthlyImpact.toLocaleString()}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-8 w-full">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Daily Delta</p>
                <p className="text-xl font-bold">PKR {costIncrease.toLocaleString()}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Annual Exposure</p>
                <p className="text-xl font-bold">PKR {(monthlyImpact * 12).toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-slate-200 flex items-center gap-3">
            <Badge variant="warning">Alert</Badge>
            <p className="text-[10px] text-slate-500 font-medium">This calculation assumes static daily usage. Volatility may apply.</p>
          </div>
        </Card>
      </div>

      <AnimatePresence>
        {advice && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-l-4 border-l-black">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-6 h-6 text-black flex-shrink-0" />
                <h3 className="text-lg font-bold uppercase tracking-widest">AI Strategy Report</h3>
              </div>
              <div className="prose prose-invert prose-sm max-w-none">
                <div className="markdown-body">
                    <Markdown>{advice}</Markdown>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

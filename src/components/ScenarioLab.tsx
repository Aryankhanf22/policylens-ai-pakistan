import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from './ui';
import { 
  Fuel, 
  Percent, 
  HelpCircle, 
  Save, 
  RotateCcw, 
  Sparkles,
  ArrowRightLeft,
  XCircle,
  Play
} from 'lucide-react';
import { BASE_INFLATION, FUEL_BASELINE } from '../constants';
import { 
  calculateInflation, 
  getRiskLevel, 
  calculateHouseholdImpact, 
  calculateConfidence 
} from '../services/simulation';
import { getPolicyAnalysis } from '../services/gemini';
import { useAuth } from '../hooks/useAuth';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../services/firebase';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';

export const ScenarioLab = () => {
  const { user } = useAuth();
  const [name, setName] = useState('New Simulation');
  const [baselines, setBaselines] = useState(FUEL_BASELINE);
  const [selectedFuelForBase, setSelectedFuelForBase] = useState<'petrol' | 'diesel' | 'highOctane'>('petrol');
  const [petrol, setPetrol] = useState(FUEL_BASELINE.petrol);
  const [diesel, setDiesel] = useState(FUEL_BASELINE.diesel);
  const [ho, setHo] = useState(FUEL_BASELINE.highOctane);
  const [tax, setTax] = useState(0);
  const [subsidy, setSubsidy] = useState(0);

  const [simulation, setSimulation] = useState<any>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const runSimulation = () => {
    setIsSimulating(true);
    const inflation = calculateInflation(petrol, diesel, ho, tax, subsidy, baselines);
    const risk = getRiskLevel(inflation);
    const impact = calculateHouseholdImpact(inflation, BASE_INFLATION);
    const confidence = calculateConfidence(inflation);

    setSimulation({
      inflation,
      risk,
      impact,
      confidence,
      fuelShock: (((petrol - baselines.petrol) / baselines.petrol) * 100)
    });
    setIsSimulating(false);
  };

  useEffect(() => {
    runSimulation();
  }, [petrol, diesel, ho, tax, subsidy]);

  const handleAiAnalysis = async () => {
    if (!simulation) return;
    setIsAnalyzing(true);
    const report = await getPolicyAnalysis(
      FUEL_BASELINE,
      { petrol, diesel, highOctane: ho },
      tax,
      subsidy
    );
    setAiAnalysis(report || '');
    setIsAnalyzing(false);
  };

  const saveSimulation = async () => {
    if (!user || !simulation) return;
    setIsSaving(true);
    try {
      await addDoc(collection(db, 'simulations'), {
        userId: user.uid,
        name: name || 'Simulation',
        petrolPrice: petrol,
        dieselPrice: diesel,
        highOctanePrice: ho,
        taxRateChange: tax,
        subsidyChange: subsidy,
        inflation: simulation.inflation,
        householdImpact: simulation.impact,
        riskLevel: simulation.risk,
        confidence: simulation.confidence,
        aiInsights: aiAnalysis,
        createdAt: serverTimestamp()
      });
      alert('Simulation saved to project history.');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'simulations');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Hero Header */}
      <div className="relative h-48 md:h-64 w-full rounded-[32px] overflow-hidden border border-white/5 mb-2 group">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
        <img 
          src="https://res.cloudinary.com/dybzcwykm/image/upload/v1777827762/iamge_dwison.png" 
          alt="Scenario Lab Map" 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-50"
        />
        <div className="absolute bottom-8 left-8 right-8 z-20 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
               <div className="h-1 w-8 bg-black rounded-full" />
               <span className="text-[11px] font-black uppercase tracking-[0.3em] text-black">Advanced Simulation Engine</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Scenario Lab</h1>
            <p className="text-slate-600 font-medium text-sm mt-1">Engineer and stress-test national policy frameworks.</p>
          </div>
          <div className="flex items-center gap-3">
            <input 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-white backdrop-blur-md border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium w-48 md:w-64 focus:outline-none focus:border-black transition-colors text-slate-900"
              placeholder="Scenario Name..."
            />
            <Button onClick={saveSimulation} disabled={isSaving || !simulation} variant="primary" size="sm" className="h-10">
              <Save className="w-4 h-4 mr-2" /> {isSaving ? 'Saving...' : 'Save Draft'}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls */}
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <div className="flex items-center gap-2 mb-6">
              <Fuel className="w-5 h-5 text-black" />
              <h3 className="text-lg font-bold">Fuel Price Levers</h3>
            </div>
            <div className="space-y-8">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 mb-4 overflow-hidden">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Set Current Base Price (PKR)</label>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <select 
                      value={selectedFuelForBase}
                      onChange={(e) => setSelectedFuelForBase(e.target.value as any)}
                      className="bg-white border border-slate-200 rounded-lg px-2 py-2 text-xs text-slate-600 focus:outline-none focus:border-black transition-colors w-full sm:w-auto"
                    >
                      <option value="petrol">Petrol (92 RON)</option>
                      <option value="diesel">Diesel (HSD)</option>
                      <option value="highOctane">High Octane (97 RON)</option>
                    </select>
                    <input 
                      type="number"
                      value={baselines[selectedFuelForBase]}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        setBaselines(prev => ({ ...prev, [selectedFuelForBase]: val }));
                      }}
                      className="flex-1 min-w-0 bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-bold text-sm"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" className="flex-1 h-9 text-xs" onClick={() => {
                      setPetrol(baselines.petrol);
                      setDiesel(baselines.diesel);
                      setHo(baselines.highOctane);
                    }}>Done</Button>
                    <Button variant="ghost" size="sm" className="flex-1 h-9 text-xs" onClick={() => {
                      setBaselines(FUEL_BASELINE);
                      setPetrol(FUEL_BASELINE.petrol);
                      setDiesel(FUEL_BASELINE.diesel);
                      setHo(FUEL_BASELINE.highOctane);
                    }}>Reset All</Button>
                  </div>
                </div>
              </div>
              <SliderInput 
                label="Petrol (92 RON)" 
                symbol="PKR" 
                min={Math.max(0, baselines.petrol - 500)} 
                max={baselines.petrol + 500} 
                step={0.5} 
                value={petrol} 
                onChange={setPetrol} 
                baseline={baselines.petrol}
              />
              <SliderInput 
                label="Diesel (HSD)" 
                symbol="PKR" 
                min={Math.max(0, baselines.diesel - 500)} 
                max={baselines.diesel + 500} 
                step={0.5} 
                value={diesel} 
                onChange={setDiesel} 
                baseline={baselines.diesel}
              />
              <SliderInput 
                label="High Octane (97 RON)" 
                symbol="PKR" 
                min={Math.max(0, baselines.highOctane - 500)} 
                max={baselines.highOctane + 500} 
                step={0.5} 
                value={ho} 
                onChange={setHo} 
                baseline={baselines.highOctane}
              />
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-2 mb-6">
              <Percent className="w-5 h-5 text-indigo-500" />
              <h3 className="text-lg font-bold">Fiscal Adjustment</h3>
            </div>
            <div className="space-y-8">
              <SliderInput 
                label="Tax Net Expansion" 
                symbol="%" 
                min={-30} 
                max={30} 
                step={1} 
                value={tax} 
                onChange={setTax} 
                baseline={0}
              />
              <SliderInput 
                label="Subsidy Buffer" 
                symbol="%" 
                min={-50} 
                max={50} 
                step={1} 
                value={subsidy} 
                onChange={setSubsidy} 
                baseline={0}
              />
            </div>
          </Card>
          
          <Button variant="ghost" className="w-full text-slate-500 hover:text-black" onClick={() => {
            setPetrol(FUEL_BASELINE.petrol);
            setDiesel(FUEL_BASELINE.diesel);
            setHo(FUEL_BASELINE.highOctane);
            setTax(0);
            setSubsidy(0);
          }}>
            <RotateCcw className="w-4 h-4 mr-2" /> Reset to Market Baseline
          </Button>
        </div>

        {/* Results */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="relative border-l-4 border-l-black">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-xl font-bold">Simulated Projection</h3>
                <p className="text-xs text-slate-500 font-medium">Real-time projection based on weighted economic modeling.</p>
              </div>
              <Badge variant={simulation?.risk === 'Severe' ? 'severe' : simulation?.risk === 'High' ? 'error' : 'success'}>
                {simulation?.risk} RISK LEVEL
              </Badge>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
              <ResultMetric label="Est. Inflation" value={`${simulation?.inflation.toFixed(2)}%`} sub="CPI Growth" />
              <ResultMetric label="Household Burn" value={`PKR ${simulation?.impact.toLocaleString()}`} sub="Additional Expense" />
              <ResultMetric label="Engine Confidence" value={`${simulation?.confidence.toFixed(1)}%`} sub="Model Trust" />
            </div>

            <div className="grid grid-cols-1 gap-4 mb-10">
               <div className={`p-6 rounded-2xl border ${simulation?.impact >= 0 ? 'bg-rose-500/5 border-rose-500/20' : 'bg-emerald-500/5 border-emerald-500/20'}`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">
                        {simulation?.impact >= 0 ? 'Household Burn' : 'Household Savings'}
                      </p>
                      <p className={`text-3xl font-black ${simulation?.impact >= 0 ? 'text-slate-900' : 'text-emerald-600'}`}>
                        PKR {Math.abs(simulation?.impact || 0).toLocaleString()}
                      </p>
                      <p className="text-[10px] text-slate-500 font-medium mt-1">
                        {simulation?.impact >= 0 ? 'Additional monthly expense for average family' : 'Monthly savings for average family'}
                      </p>
                    </div>
                    {simulation?.impact >= 0 ? <XCircle className="w-8 h-8 text-rose-400 flex-shrink-0" /> : <Sparkles className="w-8 h-8 text-emerald-400 flex-shrink-0" />}
                  </div>
               </div>
            </div>

            <div className="border-t border-slate-200 pt-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-black" />
                  <span className="font-black text-sm uppercase tracking-widest">AI Policy Insights</span>
                </div>
                {!aiAnalysis && (
                  <Button onClick={handleAiAnalysis} disabled={isAnalyzing} size="sm" variant="outline">
                    {isAnalyzing ? 'Processing Engine...' : 'Generate Analysis'}
                  </Button>
                )}
              </div>
              
              <AnimatePresence>
                {aiAnalysis && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="prose prose-sm max-w-none bg-slate-50 rounded-xl p-6 border border-slate-200"
                  >
                    <div className="markdown-body">
                        <Markdown>{aiAnalysis}</Markdown>
                    </div>
                    <Button variant="ghost" size="sm" className="mt-4" onClick={() => setAiAnalysis('')}>
                        Clear Insights
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Card>

          {/* Business Impact Matrix */}
          <Card>
            <h4 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
               Sector Sensitivity Matrix
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <SensitivityItem label="Transport" val={simulation?.fuelShock > 10 ? 'High' : 'Low'} color={simulation?.fuelShock > 10 ? 'text-rose-500' : 'text-emerald-500'} />
              <SensitivityItem label="Food" val={simulation?.fuelShock > 15 ? 'Severe' : 'Moderate'} color={simulation?.fuelShock > 15 ? 'text-rose-500' : 'text-amber-500'} />
              <SensitivityItem label="Agri" val={simulation?.fuelShock > 5 ? 'Medium' : 'Low'} color={simulation?.fuelShock > 5 ? 'text-amber-500' : 'text-emerald-500'} />
              <SensitivityItem label="Retail" val={simulation?.fuelShock > 10 ? 'High' : 'Low'} color={simulation?.fuelShock > 10 ? 'text-rose-500' : 'text-emerald-500'} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const SliderInput = ({ label, symbol, min, max, step, value, onChange, baseline }: any) => {
  const diff = value - baseline;
  const isUp = diff > 0;
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center text-sm font-medium">
        <span className="text-slate-400">{label}</span>
        <div className="flex items-center gap-2">
          {diff !== 0 && (
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isUp ? 'text-rose-400 bg-rose-400/10' : 'text-emerald-400 bg-emerald-400/10'}`}>
              {isUp ? '+' : ''}{diff.toFixed(1)}{symbol}
            </span>
          )}
          <span className="text-slate-900 font-black">{value.toFixed(1)} <span className="text-slate-500 text-[10px]">{symbol}</span></span>
        </div>
      </div>
      <input 
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-black"
      />
    </div>
  );
};

const ResultMetric = ({ label, value, sub }: any) => (
  <div>
    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">{label}</p>
    <p className="text-2xl lg:text-3xl font-black tracking-tighter text-slate-900">{value}</p>
    <p className="text-[10px] text-black font-medium">{sub}</p>
  </div>
);

const SensitivityItem = ({ label, val, color }: any) => (
  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
    <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">{label}</p>
    <p className={`text-xs font-black uppercase ${color}`}>{val}</p>
  </div>
);

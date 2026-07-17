export interface Simulation {
  id?: string;
  userId: string;
  name: string;
  petrolPrice: number;
  dieselPrice: number;
  highOctanePrice: number;
  taxRateChange: number; // e.g. 5 for +5%
  subsidyChange: number; // e.g. -10 for -10%
  inflation: number;
  householdImpact: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Severe';
  confidence: number;
  createdAt: any;
  aiInsights?: string;
}

export interface BusinessLog {
  id?: string;
  userId: string;
  businessType: string;
  dailyFuelUsage: number;
  oldPrice: number;
  newPrice: number;
  costIncrease: number;
  aiAdvice?: string;
  createdAt: any;
}

export interface HabitLog {
  id?: string;
  userId: string;
  fuelType: string;
  amountPKR: number;
  liters: number;
  createdAt: any;
}

import { FUEL_BASELINE, BASE_INFLATION } from '../constants';

export const calculateInflation = (
  petrol: number,
  diesel: number,
  highOctane: number,
  taxChange: number,
  subsidyChange: number,
  baseline = FUEL_BASELINE
) => {
  // 1. Fuel Shock (% change from baseline)
  const petrolShock = ((petrol - baseline.petrol) / baseline.petrol) * 100;
  const dieselShock = ((diesel - baseline.diesel) / baseline.diesel) * 100;
  const hoShock = ((highOctane - baseline.highOctane) / baseline.highOctane) * 100;

  // Weighted fuel shock (Diesel has high impact on transport/food)
  const fuelShock = (petrolShock * 0.45) + (dieselShock * 0.45) + (hoShock * 0.10);

  // 2. Inflation Model
  const simulatedInflation = BASE_INFLATION + (fuelShock * 0.35) + (taxChange * 0.25) - (subsidyChange * 0.20);

  return Math.max(0, simulatedInflation);
};

export const getRiskLevel = (inflation: number) => {
  if (inflation < 15) return 'Low';
  if (inflation <= 25) return 'Medium';
  if (inflation <= 35) return 'High';
  return 'Severe';
};

export const calculateHouseholdImpact = (simulatedInflation: number, baseInflation: number) => {
  const avgMonthlyExpense = 65000; // PKR
  const diff = simulatedInflation - baseInflation;
  return avgMonthlyExpense * (diff / 100);
};

export const calculateConfidence = (simulated: number) => {
  const historicalAvg = 18.5; // Average over last few normal years
  const diff = Math.abs(simulated - historicalAvg);
  return Math.max(0, Math.min(100, 100 - diff));
};

export const calculateBusinessImpactRating = (fuelShock: number) => {
  if (fuelShock < 5) return 'Low';
  if (fuelShock <= 15) return 'Medium';
  if (fuelShock <= 25) return 'High';
  return 'Severe';
};

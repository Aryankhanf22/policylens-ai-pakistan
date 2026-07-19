import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const getPolicyAnalysis = async (
  oldPrices: { petrol: number, diesel: number, highOctane: number },
  newPrices: { petrol: number, diesel: number, highOctane: number },
  taxChange: number,
  subsidyChange: number
) => {
  const prompt = `
Analyze this Pakistan policy scenario:
Fuel prices changed:
- Petrol: ${oldPrices.petrol} → ${newPrices.petrol} PKR
- Diesel: ${oldPrices.diesel} → ${newPrices.diesel} PKR
- HOBC: ${oldPrices.highOctane} → ${newPrices.highOctane} PKR
Tax change: ${taxChange}%
Subsidy change: ${subsidyChange}%

Provide a structured analysis for a government policymaker.
Return your response in Markdown with these sections:
1. Inflation Impact Explanation: A deep dive into how these changes affect the national CPI.
2. Household Impact (PKR): Estimated monthly impact on a middle-class family.
3. Business Impact: Analysis of transport and manufacturing cost escalations.
4. Risks: Strategic and social risks associated with this policy.
5. Policy Improvement Suggestions: Actionable ways to mitigate negative impacts.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error('Gemini error:', error);
    return "Failed to generate AI insights. Please check your API key and connection.";
  }
};

export const getBusinessAdvice = async (
  businessType: string,
  dailyFuel: number,
  priceIncrease: number
) => {
  const monthlyIncrease = dailyFuel * priceIncrease * 30;
  const prompt = `
A small business in Pakistan (Type: ${businessType}) is facing a fuel price increase of ${priceIncrease} PKR per liter.
They use ${dailyFuel} liters per day.
Their monthly cost increase is approximately ${monthlyIncrease} PKR.

Explain:
1. Short-term and long-term implications for this specific business type.
2. 3-5 Actionable cost reduction or mitigation strategies (specific to Pakistan's current economic climate).
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error('Gemini error:', error);
    return "Could not retrieve business advice.";
  }
};

export const getHabitSummary = async (logs: any[]) => {
  const logsText = logs.map(l => `- Date: ${new Date(l.createdAt.toDate()).toLocaleDateString()}, Fuel: ${l.fuelType}, Amount: ${l.amountPKR} PKR`).join('\n');
  const prompt = `
Analyze these daily fuel logs for a user in Pakistan:
${logsText}

Provide:
1. A weekly summary of spending patterns.
2. 3 AI-driven cost optimization tips to help them save money on fuel.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error('Gemini error:', error);
    return "Could not generate habit summary.";
  }
};

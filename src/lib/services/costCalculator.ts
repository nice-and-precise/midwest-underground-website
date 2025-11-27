/**
 * Cost Calculator Service
 * Provides calculations for HDD project estimating
 */

export interface CostBreakdown {
  laborCost: number;
  equipmentCost: number;
  materialCost: number;
  subtotal: number;
  markup: number;
  total: number;
}

export interface EstimateLineInput {
  quantity: number;
  unitCost: number;
  laborRate?: number;
  equipmentRate?: number;
  materialCost?: number;
  markupPercent?: number;
}

export interface EstimateTotals {
  subtotal: number;
  markupAmount: number;
  taxAmount: number;
  total: number;
  lineCount: number;
  totalQuantity: number;
}

/**
 * Calculate costs for a single line item
 */
export function calculateLineCost(input: EstimateLineInput): CostBreakdown {
  const {
    quantity,
    unitCost,
    laborRate = 0,
    equipmentRate = 0,
    materialCost = 0,
    markupPercent = 0.15
  } = input;

  // Calculate individual cost components
  const laborCost = laborRate * quantity;
  const equipmentCostTotal = equipmentRate * quantity;
  const materialCostTotal = materialCost * quantity;

  // Subtotal is the total before markup
  const subtotal = (unitCost * quantity) || (laborCost + equipmentCostTotal + materialCostTotal);

  // Apply markup
  const markup = subtotal * markupPercent;
  const total = subtotal + markup;

  return {
    laborCost,
    equipmentCost: equipmentCostTotal,
    materialCost: materialCostTotal,
    subtotal,
    markup,
    total
  };
}

/**
 * Calculate estimate totals from line items
 */
export function calculateEstimateTotals(
  lines: Array<{ subtotal: number; quantity: number; markup?: number }>,
  markupPercent: number = 0.15,
  taxPercent: number = 0
): EstimateTotals {
  // Sum up all line subtotals
  const subtotal = lines.reduce((sum, line) => sum + line.subtotal, 0);
  const totalQuantity = lines.reduce((sum, line) => sum + line.quantity, 0);

  // Calculate markup (if not already applied per line)
  const markupAmount = subtotal * markupPercent;

  // Calculate tax on subtotal + markup
  const taxableAmount = subtotal + markupAmount;
  const taxAmount = taxableAmount * taxPercent;

  // Grand total
  const total = taxableAmount + taxAmount;

  return {
    subtotal,
    markupAmount,
    taxAmount,
    total,
    lineCount: lines.length,
    totalQuantity
  };
}

/**
 * Calculate labor hours from production rate
 * @param quantity Total units to complete
 * @param productionRate Units per hour
 * @returns Total labor hours needed
 */
export function calculateLaborHours(quantity: number, productionRate: number): number {
  if (productionRate <= 0) return 0;
  return quantity / productionRate;
}

/**
 * Calculate labor cost from hours and rate
 */
export function calculateLaborCost(hours: number, hourlyRate: number): number {
  return hours * hourlyRate;
}

/**
 * Calculate equipment cost from hours and rate
 */
export function calculateEquipmentCost(hours: number, hourlyRate: number): number {
  return hours * hourlyRate;
}

/**
 * Standard HDD production rates (feet per hour)
 * These are defaults that can be overridden per cost item
 */
export const HDD_PRODUCTION_RATES = {
  // Pilot bore rates by diameter
  PILOT_2_INCH: 150, // 2" pilot hole
  PILOT_4_INCH: 120, // 4" pilot hole
  PILOT_6_INCH: 100, // 6" pilot hole

  // Reaming rates by diameter
  REAM_6_INCH: 80,
  REAM_8_INCH: 60,
  REAM_10_INCH: 50,
  REAM_12_INCH: 40,

  // Pullback rates
  PULLBACK_HDPE: 200,
  PULLBACK_STEEL: 100,
  PULLBACK_CONDUIT: 250,

  // Trenching rates (feet per hour)
  TRENCH_STANDARD: 30,
  TRENCH_ROCK: 10,

  // Fiber installation
  FIBER_PLACEMENT: 500,
  FIBER_SPLICE: 2, // splices per hour
} as const;

/**
 * Standard labor rates (hourly)
 */
export const LABOR_RATES = {
  OPERATOR: 85,
  LOCATOR: 65,
  LABORER: 55,
  FOREMAN: 95,
  SUPERINTENDENT: 110,
} as const;

/**
 * Standard equipment rates (hourly)
 */
export const EQUIPMENT_RATES = {
  DRILL_RIG_SMALL: 150,   // JT20/30 class
  DRILL_RIG_MEDIUM: 250,  // JT60/100 class
  DRILL_RIG_LARGE: 400,   // D24x40 and up
  EXCAVATOR_MINI: 75,
  EXCAVATOR_STANDARD: 125,
  VACUUM_TRUCK: 175,
  FLUID_SYSTEM: 50,
  TRACKER: 25,
} as const;

/**
 * Calculate a complete HDD bore estimate
 */
export interface HDDBoreEstimate {
  boreLength: number;
  diameter: number;
  passCount: number; // pilot + reams
  soilCondition: 'easy' | 'moderate' | 'difficult';
}

export function calculateHDDBoreEstimate(
  bore: HDDBoreEstimate,
  laborRate: number = LABOR_RATES.OPERATOR,
  equipmentRate: number = EQUIPMENT_RATES.DRILL_RIG_MEDIUM
): CostBreakdown {
  // Adjust production rate based on diameter and soil condition
  let baseRate = 100; // default LF/hour

  if (bore.diameter <= 4) baseRate = 120;
  else if (bore.diameter <= 8) baseRate = 80;
  else if (bore.diameter <= 12) baseRate = 50;
  else baseRate = 30;

  // Soil condition multiplier
  const soilMultiplier = {
    easy: 1.2,
    moderate: 1.0,
    difficult: 0.6
  }[bore.soilCondition];

  const adjustedRate = baseRate * soilMultiplier;

  // Calculate hours per pass
  const hoursPerPass = bore.boreLength / adjustedRate;
  const totalHours = hoursPerPass * bore.passCount;

  // Calculate costs
  const laborCost = totalHours * laborRate;
  const equipmentCost = totalHours * equipmentRate;
  const materialCost = bore.boreLength * 2; // $2/LF for drilling fluid average

  const subtotal = laborCost + equipmentCost + materialCost;
  const markup = subtotal * 0.15;
  const total = subtotal + markup;

  return {
    laborCost,
    equipmentCost,
    materialCost,
    subtotal,
    markup,
    total
  };
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

/**
 * Round to nearest cent
 */
export function roundToCents(amount: number): number {
  return Math.round(amount * 100) / 100;
}

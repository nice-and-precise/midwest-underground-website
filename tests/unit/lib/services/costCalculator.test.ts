import { describe, it, expect } from 'vitest'
import {
  calculateLineCost,
  calculateEstimateTotals,
  calculateLaborHours,
  calculateLaborCost,
  calculateEquipmentCost,
  calculateHDDBoreEstimate,
  formatCurrency,
  roundToCents,
  HDD_PRODUCTION_RATES,
  LABOR_RATES,
  EQUIPMENT_RATES,
  CostBreakdown,
  EstimateLineInput,
  EstimateTotals,
  HDDBoreEstimate
} from '@/lib/services/costCalculator'

describe('Cost Calculator Service', () => {
  describe('calculateLineCost', () => {
    it('should calculate basic line cost with unitCost', () => {
      const input: EstimateLineInput = {
        quantity: 100,
        unitCost: 10
      }

      const result = calculateLineCost(input)

      expect(result.subtotal).toBe(1000)
      expect(result.markup).toBe(150) // default 15%
      expect(result.total).toBe(1150)
    })

    it('should calculate labor cost from laborRate', () => {
      const input: EstimateLineInput = {
        quantity: 10,
        unitCost: 0,
        laborRate: 50
      }

      const result = calculateLineCost(input)

      expect(result.laborCost).toBe(500)
    })

    it('should calculate equipment cost from equipmentRate', () => {
      const input: EstimateLineInput = {
        quantity: 8,
        unitCost: 0,
        equipmentRate: 100
      }

      const result = calculateLineCost(input)

      expect(result.equipmentCost).toBe(800)
    })

    it('should calculate material cost from materialCost', () => {
      const input: EstimateLineInput = {
        quantity: 5,
        unitCost: 0,
        materialCost: 20
      }

      const result = calculateLineCost(input)

      expect(result.materialCost).toBe(100)
    })

    it('should use custom markup percent', () => {
      const input: EstimateLineInput = {
        quantity: 100,
        unitCost: 10,
        markupPercent: 0.25
      }

      const result = calculateLineCost(input)

      expect(result.subtotal).toBe(1000)
      expect(result.markup).toBe(250) // 25%
      expect(result.total).toBe(1250)
    })

    it('should combine all cost components when unitCost is zero', () => {
      const input: EstimateLineInput = {
        quantity: 10,
        unitCost: 0,
        laborRate: 50,
        equipmentRate: 30,
        materialCost: 5,
        markupPercent: 0.10
      }

      const result = calculateLineCost(input)

      // Labor: 10 * 50 = 500
      // Equipment: 10 * 30 = 300
      // Material: 10 * 5 = 50
      // Subtotal: 850
      expect(result.laborCost).toBe(500)
      expect(result.equipmentCost).toBe(300)
      expect(result.materialCost).toBe(50)
      expect(result.subtotal).toBe(850)
      expect(result.markup).toBe(85) // 10%
      expect(result.total).toBe(935)
    })

    it('should prioritize unitCost over component costs', () => {
      const input: EstimateLineInput = {
        quantity: 10,
        unitCost: 100,
        laborRate: 50,
        equipmentRate: 30,
        materialCost: 5
      }

      const result = calculateLineCost(input)

      // unitCost takes precedence
      expect(result.subtotal).toBe(1000)
    })
  })

  describe('calculateEstimateTotals', () => {
    it('should calculate totals from line items', () => {
      const lines = [
        { subtotal: 1000, quantity: 10 },
        { subtotal: 2000, quantity: 20 },
        { subtotal: 500, quantity: 5 }
      ]

      const result = calculateEstimateTotals(lines)

      expect(result.subtotal).toBe(3500)
      expect(result.totalQuantity).toBe(35)
      expect(result.lineCount).toBe(3)
      expect(result.markupAmount).toBe(525) // 15%
      expect(result.total).toBe(4025)
    })

    it('should apply custom markup percent', () => {
      const lines = [{ subtotal: 1000, quantity: 10 }]

      const result = calculateEstimateTotals(lines, 0.20)

      expect(result.markupAmount).toBe(200)
      expect(result.total).toBe(1200)
    })

    it('should apply tax on subtotal + markup', () => {
      const lines = [{ subtotal: 1000, quantity: 10 }]

      const result = calculateEstimateTotals(lines, 0.15, 0.07)

      // Subtotal: 1000
      // Markup: 150 (15%)
      // Taxable: 1150
      // Tax: 80.50 (7%)
      expect(result.subtotal).toBe(1000)
      expect(result.markupAmount).toBe(150)
      expect(result.taxAmount).toBeCloseTo(80.5, 2)
      expect(result.total).toBeCloseTo(1230.5, 2)
    })

    it('should handle empty lines array', () => {
      const result = calculateEstimateTotals([])

      expect(result.subtotal).toBe(0)
      expect(result.totalQuantity).toBe(0)
      expect(result.lineCount).toBe(0)
      expect(result.total).toBe(0)
    })
  })

  describe('calculateLaborHours', () => {
    it('should calculate hours from quantity and rate', () => {
      const hours = calculateLaborHours(1000, 100)
      expect(hours).toBe(10)
    })

    it('should handle fractional hours', () => {
      const hours = calculateLaborHours(500, 120)
      expect(hours).toBeCloseTo(4.167, 2)
    })

    it('should return 0 for zero production rate', () => {
      const hours = calculateLaborHours(1000, 0)
      expect(hours).toBe(0)
    })

    it('should return 0 for negative production rate', () => {
      const hours = calculateLaborHours(1000, -50)
      expect(hours).toBe(0)
    })
  })

  describe('calculateLaborCost', () => {
    it('should calculate labor cost from hours and rate', () => {
      const cost = calculateLaborCost(8, 85)
      expect(cost).toBe(680)
    })

    it('should handle fractional hours', () => {
      const cost = calculateLaborCost(7.5, 65)
      expect(cost).toBe(487.5)
    })
  })

  describe('calculateEquipmentCost', () => {
    it('should calculate equipment cost from hours and rate', () => {
      const cost = calculateEquipmentCost(8, 250)
      expect(cost).toBe(2000)
    })

    it('should handle fractional hours', () => {
      const cost = calculateEquipmentCost(6.5, 150)
      expect(cost).toBe(975)
    })
  })

  describe('calculateHDDBoreEstimate', () => {
    it('should calculate small diameter bore in easy soil', () => {
      const bore: HDDBoreEstimate = {
        boreLength: 500,
        diameter: 4,
        passCount: 2,
        soilCondition: 'easy'
      }

      const result = calculateHDDBoreEstimate(bore)

      // Diameter 4 = 120 LF/hr base rate
      // Easy soil = 1.2 multiplier
      // Adjusted rate = 144 LF/hr
      // Hours per pass = 500/144 = 3.47 hours
      // Total hours = 6.94 hours
      expect(result.laborCost).toBeGreaterThan(0)
      expect(result.equipmentCost).toBeGreaterThan(0)
      expect(result.materialCost).toBe(1000) // $2/LF
      expect(result.total).toBeGreaterThan(result.subtotal)
    })

    it('should calculate large diameter bore in difficult soil', () => {
      const bore: HDDBoreEstimate = {
        boreLength: 1000,
        diameter: 12,
        passCount: 4,
        soilCondition: 'difficult'
      }

      const result = calculateHDDBoreEstimate(bore)

      // Diameter 12 = 50 LF/hr base rate
      // Difficult soil = 0.6 multiplier
      // Adjusted rate = 30 LF/hr
      // Hours per pass = 1000/30 = 33.33 hours
      // Total hours = 133.33 hours
      expect(result.laborCost).toBeGreaterThan(10000)
      expect(result.equipmentCost).toBeGreaterThan(30000)
    })

    it('should use default rates', () => {
      const bore: HDDBoreEstimate = {
        boreLength: 100,
        diameter: 6,
        passCount: 1,
        soilCondition: 'moderate'
      }

      const result = calculateHDDBoreEstimate(bore)

      // Default labor rate = 85 (OPERATOR)
      // Default equipment rate = 250 (DRILL_RIG_MEDIUM)
      expect(result).toHaveProperty('laborCost')
      expect(result).toHaveProperty('equipmentCost')
    })

    it('should use custom labor and equipment rates', () => {
      const bore: HDDBoreEstimate = {
        boreLength: 100,
        diameter: 6,
        passCount: 1,
        soilCondition: 'moderate'
      }

      const result = calculateHDDBoreEstimate(bore, 100, 300)

      // Labor and equipment should reflect custom rates
      expect(result.laborCost).toBeGreaterThan(0)
      expect(result.equipmentCost).toBeGreaterThan(0)
    })

    it('should apply 15% markup', () => {
      const bore: HDDBoreEstimate = {
        boreLength: 100,
        diameter: 4,
        passCount: 1,
        soilCondition: 'easy'
      }

      const result = calculateHDDBoreEstimate(bore)

      expect(result.markup).toBeCloseTo(result.subtotal * 0.15, 2)
      expect(result.total).toBeCloseTo(result.subtotal + result.markup, 2)
    })

    it('should handle very large diameter (>12)', () => {
      const bore: HDDBoreEstimate = {
        boreLength: 500,
        diameter: 18,
        passCount: 3,
        soilCondition: 'moderate'
      }

      const result = calculateHDDBoreEstimate(bore)

      // Should use 30 LF/hr base rate for >12" diameter
      expect(result.laborCost).toBeGreaterThan(0)
    })
  })

  describe('formatCurrency', () => {
    it('should format positive amounts', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56')
    })

    it('should format whole numbers with cents', () => {
      expect(formatCurrency(1000)).toBe('$1,000.00')
    })

    it('should format zero', () => {
      expect(formatCurrency(0)).toBe('$0.00')
    })

    it('should format negative amounts', () => {
      expect(formatCurrency(-500.25)).toBe('-$500.25')
    })

    it('should format large amounts with commas', () => {
      expect(formatCurrency(1234567.89)).toBe('$1,234,567.89')
    })

    it('should round to two decimal places', () => {
      expect(formatCurrency(10.999)).toBe('$11.00')
    })
  })

  describe('roundToCents', () => {
    it('should round down to nearest cent', () => {
      expect(roundToCents(10.1234)).toBe(10.12)
    })

    it('should round up to nearest cent', () => {
      expect(roundToCents(10.1267)).toBe(10.13)
    })

    it('should handle exact cents', () => {
      expect(roundToCents(10.50)).toBe(10.50)
    })

    it('should handle standard rounding (.5)', () => {
      expect(roundToCents(10.125)).toBe(10.13)
    })
  })

  describe('Constants', () => {
    describe('HDD_PRODUCTION_RATES', () => {
      it('should have pilot bore rates', () => {
        expect(HDD_PRODUCTION_RATES.PILOT_2_INCH).toBe(150)
        expect(HDD_PRODUCTION_RATES.PILOT_4_INCH).toBe(120)
        expect(HDD_PRODUCTION_RATES.PILOT_6_INCH).toBe(100)
      })

      it('should have reaming rates', () => {
        expect(HDD_PRODUCTION_RATES.REAM_6_INCH).toBe(80)
        expect(HDD_PRODUCTION_RATES.REAM_8_INCH).toBe(60)
        expect(HDD_PRODUCTION_RATES.REAM_10_INCH).toBe(50)
        expect(HDD_PRODUCTION_RATES.REAM_12_INCH).toBe(40)
      })

      it('should have pullback rates', () => {
        expect(HDD_PRODUCTION_RATES.PULLBACK_HDPE).toBe(200)
        expect(HDD_PRODUCTION_RATES.PULLBACK_STEEL).toBe(100)
        expect(HDD_PRODUCTION_RATES.PULLBACK_CONDUIT).toBe(250)
      })
    })

    describe('LABOR_RATES', () => {
      it('should have all labor positions', () => {
        expect(LABOR_RATES.OPERATOR).toBe(85)
        expect(LABOR_RATES.LOCATOR).toBe(65)
        expect(LABOR_RATES.LABORER).toBe(55)
        expect(LABOR_RATES.FOREMAN).toBe(95)
        expect(LABOR_RATES.SUPERINTENDENT).toBe(110)
      })
    })

    describe('EQUIPMENT_RATES', () => {
      it('should have drill rig rates', () => {
        expect(EQUIPMENT_RATES.DRILL_RIG_SMALL).toBe(150)
        expect(EQUIPMENT_RATES.DRILL_RIG_MEDIUM).toBe(250)
        expect(EQUIPMENT_RATES.DRILL_RIG_LARGE).toBe(400)
      })

      it('should have support equipment rates', () => {
        expect(EQUIPMENT_RATES.EXCAVATOR_MINI).toBe(75)
        expect(EQUIPMENT_RATES.EXCAVATOR_STANDARD).toBe(125)
        expect(EQUIPMENT_RATES.VACUUM_TRUCK).toBe(175)
        expect(EQUIPMENT_RATES.FLUID_SYSTEM).toBe(50)
        expect(EQUIPMENT_RATES.TRACKER).toBe(25)
      })
    })
  })
})

import { prisma } from '@/lib/prisma'

export interface ProjectKPIs {
  feetPerCrewHour: number
  feetPerCrewHourTrend: number
  costPerLF: number
  budgetPerLF: number
  boresPerDay: number
  complianceRate: number
  ticketsActive: number
  onTimeReports: number
  totalLF: number
  totalCosts: number
  rfiCycleTime: number
}

export async function calculateProjectKPIs(
  projectId: string,
  startDate?: Date,
  endDate?: Date
): Promise<ProjectKPIs> {
  // Default to last 30 days
  const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  const end = endDate || new Date()

  try {
    // Get daily reports for the period
    const reports = await prisma.dailyReport.findMany({
      where: {
        projectId,
        reportDate: {
          gte: start,
          lte: end
        },
        status: 'SUBMITTED'
      },
      select: {
        production: true,
        labor: true,
        equipment: true,
        materials: true,
        reportDate: true,
        createdAt: true
      }
    })

    // Calculate total production and hours
    let totalLF = 0
    let totalHours = 0
    let totalCosts = 0

    reports.forEach(report => {
      const production = Array.isArray(report.production) ? report.production : []
      const labor = Array.isArray(report.labor) ? report.labor : []
      const equipment = Array.isArray(report.equipment) ? report.equipment : []
      const materials = Array.isArray(report.materials) ? report.materials : []

      production.forEach((item: any) => {
        totalLF += parseFloat(item.lf || 0)
      })

      labor.forEach((item: any) => {
        const hours = parseFloat(item.hours || 0)
        const rate = parseFloat(item.rate || 0)
        totalHours += hours
        totalCosts += hours * rate
      })

      equipment.forEach((item: any) => {
        const hours = parseFloat(item.hours || 0)
        const rate = parseFloat(item.rate || 0)
        totalCosts += hours * rate
      })

      materials.forEach((item: any) => {
        const qty = parseFloat(item.qty || 0)
        const cost = parseFloat(item.cost || 0)
        totalCosts += qty * cost
      })
    })

    const feetPerCrewHour = totalHours > 0 ? totalLF / totalHours : 0

    // Calculate trend (compare to previous period)
    const previousStart = new Date(start.getTime() - (end.getTime() - start.getTime()))
    const previousReports = await prisma.dailyReport.findMany({
      where: {
        projectId,
        reportDate: {
          gte: previousStart,
          lte: start
        },
        status: 'SUBMITTED'
      },
      select: {
        production: true,
        labor: true
      }
    })

    let previousLF = 0
    let previousHours = 0
    previousReports.forEach(report => {
      const production = Array.isArray(report.production) ? report.production : []
      const labor = Array.isArray(report.labor) ? report.labor : []

      production.forEach((item: any) => {
        previousLF += parseFloat(item.lf || 0)
      })

      labor.forEach((item: any) => {
        previousHours += parseFloat(item.hours || 0)
      })
    })

    const previousFeetPerCrewHour = previousHours > 0 ? previousLF / previousHours : 0
    const feetPerCrewHourTrend = previousFeetPerCrewHour > 0
      ? ((feetPerCrewHour - previousFeetPerCrewHour) / previousFeetPerCrewHour) * 100
      : 0

    // Cost per LF
    const costPerLF = totalLF > 0 ? totalCosts / totalLF : 0

    // Budget per LF (from project data)
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { budget: true }
    })

    const budgetPerLF = project?.budget && totalLF > 0 ? project.budget / totalLF : 0

    // Bores per day
    const uniqueBores = new Set()
    const uniqueDays = new Set()
    reports.forEach(report => {
      const production = Array.isArray(report.production) ? report.production : []
      production.forEach((item: any) => {
        if (item.boreId) uniqueBores.add(item.boreId)
      })
      uniqueDays.add(report.reportDate.toDateString())
    })
    const boresPerDay = uniqueDays.size > 0 ? uniqueBores.size / uniqueDays.size : 0

    // 811 Compliance
    const tickets = await prisma.ticket811.findMany({
      where: { projectId },
      include: { responses: true }
    })

    const activeTickets = tickets.filter(t => t.status === 'ACTIVE').length
    const compliantTickets = tickets.filter(t => t.responses.length > 0).length
    const complianceRate = tickets.length > 0 ? (compliantTickets / tickets.length) * 100 : 0

    // On-time daily reports
    const onTimeCount = reports.filter(report => {
      const reportDate = new Date(report.reportDate)
      const submittedDate = new Date(report.createdAt)
      const deadlineDate = new Date(reportDate)
      deadlineDate.setHours(20, 0, 0, 0) // 8pm deadline
      return submittedDate <= deadlineDate
    }).length

    const onTimeReports = reports.length > 0 ? (onTimeCount / reports.length) * 100 : 0

    // RFI Cycle Time
    const rfis = await prisma.rFI.findMany({
      where: {
        projectId,
        status: 'ANSWERED',
        respondedAt: { not: null }
      },
      select: {
        createdAt: true,
        respondedAt: true
      }
    })

    let totalCycleTime = 0
    rfis.forEach(rfi => {
      if (rfi.respondedAt) {
        const days = (rfi.respondedAt.getTime() - rfi.createdAt.getTime()) / (1000 * 60 * 60 * 24)
        totalCycleTime += days
      }
    })
    const rfiCycleTime = rfis.length > 0 ? totalCycleTime / rfis.length : 0

    return {
      feetPerCrewHour,
      feetPerCrewHourTrend,
      costPerLF,
      budgetPerLF,
      boresPerDay,
      complianceRate,
      ticketsActive: activeTickets,
      onTimeReports,
      totalLF,
      totalCosts,
      rfiCycleTime
    }
  } catch (error) {
    console.error('Error calculating KPIs:', error)
    return {
      feetPerCrewHour: 0,
      feetPerCrewHourTrend: 0,
      costPerLF: 0,
      budgetPerLF: 0,
      boresPerDay: 0,
      complianceRate: 0,
      ticketsActive: 0,
      onTimeReports: 0,
      totalLF: 0,
      totalCosts: 0,
      rfiCycleTime: 0
    }
  }
}

export async function getDailyProductionTrend(projectId: string, days: number = 30) {
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

  const reports = await prisma.dailyReport.findMany({
    where: {
      projectId,
      reportDate: { gte: startDate },
      status: 'SUBMITTED'
    },
    select: {
      reportDate: true,
      production: true
    },
    orderBy: {
      reportDate: 'asc'
    }
  })

  return reports.map(report => {
    const production = Array.isArray(report.production) ? report.production : []
    const dailyLF = production.reduce((sum: number, item: any) => sum + parseFloat(item.lf || 0), 0)

    return {
      date: report.reportDate.toISOString().split('T')[0],
      linearFeet: dailyLF
    }
  })
}

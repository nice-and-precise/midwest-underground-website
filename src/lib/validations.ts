import { z } from 'zod'

// Auth Schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

export type LoginInput = z.infer<typeof loginSchema>

// Bore Log Schemas (Legacy - keeping for compatibility)
export const boreLogSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  project: z.string().min(1, 'Project is required'),
  location: z.string().min(1, 'Location is required'),
  totalDepth: z.string().min(1, 'Total depth is required'),
  rodCount: z.number().min(1, 'Rod count must be at least 1'),
  crew: z.string().min(1, 'Crew is required'),
  status: z.enum(['In Progress', 'Completed', 'On Hold']).default('In Progress')
})

export type BoreLogInput = z.infer<typeof boreLogSchema>

// Bore Schemas (Prisma-aligned)
export const boreSchema = z.object({
  projectId: z.string().min(1, 'Project ID is required'),
  name: z.string().min(1, 'Bore name is required'),
  alignment: z.any().optional(), // GeoJSON LineString
  depthProfile: z.any().optional(), // Array of depth readings
  diameterIn: z.number().positive().optional(),
  productMaterial: z.string().optional(),
  tracerWire: z.boolean().default(false),
  entryPitId: z.string().optional(),
  exitPitId: z.string().optional(),
  status: z.enum(['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'ABANDONED']).default('PLANNED'),
  totalLength: z.number().positive().optional()
})

export const boreUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  alignment: z.any().optional(),
  depthProfile: z.any().optional(),
  diameterIn: z.number().positive().optional(),
  productMaterial: z.string().optional(),
  tracerWire: z.boolean().optional(),
  entryPitId: z.string().optional(),
  exitPitId: z.string().optional(),
  status: z.enum(['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'ABANDONED']).optional(),
  totalLength: z.number().positive().optional()
})

export type BoreInput = z.infer<typeof boreSchema>
export type BoreUpdateInput = z.infer<typeof boreUpdateSchema>

// Project Schemas
export const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional(),
  status: z.enum(['PLANNING', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD']).default('PLANNING'),
  startDate: z.string().optional().transform(val => val ? new Date(val) : undefined),
  endDate: z.string().optional().transform(val => val ? new Date(val) : undefined),
  budget: z.number().min(0, 'Budget must be positive').optional(),
  location: z.any().optional(), // JSON field
  customerName: z.string().optional(),
  customerContact: z.string().optional(),
  createdById: z.string().min(1, 'Creator ID is required')
})

export const projectUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.enum(['PLANNING', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD']).optional(),
  startDate: z.string().optional().transform(val => val ? new Date(val) : undefined),
  endDate: z.string().optional().transform(val => val ? new Date(val) : undefined),
  budget: z.number().min(0).optional(),
  location: z.any().optional(),
  customerName: z.string().optional(),
  customerContact: z.string().optional()
})

export type ProjectInput = z.infer<typeof projectSchema>
export type ProjectUpdateInput = z.infer<typeof projectUpdateSchema>

// Customer Schemas
export const customerSchema = z.object({
  name: z.string().min(1, 'Customer name is required'),
  contactPerson: z.string().min(1, 'Contact person is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  type: z.enum(['Municipal', 'Telecom', 'Utility Cooperative', 'Electric Utility', 'Private']),
  status: z.enum(['Active', 'Inactive']).default('Active')
})

export type CustomerInput = z.infer<typeof customerSchema>

// Equipment Schemas
export const equipmentSchema = z.object({
  name: z.string().min(1, 'Equipment name is required'),
  type: z.string().min(1, 'Equipment type is required'),
  model: z.string().min(1, 'Model is required'),
  manufacturer: z.string().optional(),
  serialNumber: z.string().optional(),
  year: z.number().min(1900).max(new Date().getFullYear() + 1).optional(),
  status: z.enum(['Active', 'Maintenance', 'Retired']).default('Active'),
  location: z.string().optional(),
  assignedTo: z.string().optional()
})

export type EquipmentInput = z.infer<typeof equipmentSchema>

// Field Report Schemas
export const fieldReportSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  project: z.string().min(1, 'Project is required'),
  crew: z.string().min(1, 'Crew is required'),
  location: z.string().min(1, 'Location is required'),
  totalHours: z.number().min(0, 'Total hours must be positive'),
  workDescription: z.string().min(10, 'Work description must be at least 10 characters'),
  status: z.enum(['Draft', 'Submitted', 'Approved', 'Rejected']).default('Draft')
})

export type FieldReportInput = z.infer<typeof fieldReportSchema>

// 811 Ticket Schemas
export const ticket811Schema = z.object({
  ticketNumber: z.string().min(1, 'Ticket number is required'),
  project: z.string().min(1, 'Project is required'),
  digDate: z.string().min(1, 'Dig date is required'),
  expirationDate: z.string().optional(),
  location: z.string().min(1, 'Location is required'),
  type: z.enum(['Normal', 'Emergency', 'Routine']).default('Normal'),
  status: z.enum(['Pending', 'Active', 'Expired', 'Closed']).default('Pending')
})

export type Ticket811Input = z.infer<typeof ticket811Schema>

// Inspection Schemas
export const inspectionSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  type: z.enum(['Pre-Construction', 'Progress Inspection', 'Final Inspection', 'Follow-up']),
  project: z.string().min(1, 'Project is required'),
  inspector: z.string().min(1, 'Inspector is required'),
  location: z.string().min(1, 'Location is required'),
  status: z.enum(['Pending', 'Passed', 'Failed', 'Conditional']).default('Pending')
})

export type InspectionInput = z.infer<typeof inspectionSchema>

// Prisma-aligned 811 Ticket Schemas
export const ticket811CreateSchema = z.object({
  ticketNumber: z.string().min(1, 'Ticket number is required'),
  projectId: z.string().min(1, 'Project ID is required'),
  ticketDate: z.string().datetime().or(z.date()).transform(val => new Date(val)),
  expirationDate: z.string().datetime().or(z.date()).transform(val => new Date(val)),
  status: z.enum(['ACTIVE', 'EXPIRED', 'RENEWED']).default('ACTIVE'),
  notes: z.string().optional()
})

export const ticket811UpdateSchema = ticket811CreateSchema.partial()

export const ticket811ResponseCreateSchema = z.object({
  utilityName: z.string().min(1, 'Utility name is required'),
  responseType: z.string().optional(),
  responseDate: z.string().datetime().or(z.date()).transform(val => new Date(val)),
  locatePhotos: z.any().optional(),
  marksDescription: z.string().optional(),
  respondedById: z.string().min(1, 'Responded by ID is required')
})

export type Ticket811CreateInput = z.infer<typeof ticket811CreateSchema>
export type Ticket811UpdateInput = z.infer<typeof ticket811UpdateSchema>
export type Ticket811ResponseCreateInput = z.infer<typeof ticket811ResponseCreateSchema>

// Prisma-aligned Inspection Schemas
export const inspectionCreateSchema = z.object({
  projectId: z.string().min(1, 'Project ID is required'),
  boreId: z.string().optional(),
  templateName: z.string().optional(),
  items: z.any().default([]), // JSON field for inspection items - defaults to empty array
  assigneeId: z.string().optional(),
  dueDate: z.string().datetime().or(z.date()).optional().transform(val => val ? new Date(val) : undefined),
  completedAt: z.string().datetime().or(z.date()).optional().transform(val => val ? new Date(val) : undefined),
  status: z.enum(['OPEN', 'IN_PROGRESS', 'COMPLETED', 'FAILED']).default('OPEN'),
  location: z.any().optional(),
  createdById: z.string().min(1, 'Creator ID is required')
})

export const inspectionUpdateSchema = inspectionCreateSchema.partial()

export type InspectionCreateInput = z.infer<typeof inspectionCreateSchema>
export type InspectionUpdateInput = z.infer<typeof inspectionUpdateSchema>

// Daily Report Schemas (Prisma-aligned with actual schema)
export const dailyReportCreateSchema = z.object({
  projectId: z.string().min(1, 'Project ID is required'),
  reportDate: z.string().datetime().or(z.date()).transform(val => typeof val === 'string' ? new Date(val) : val),
  crew: z.array(z.any()).default([]), // [{name, role, hours}]
  production: z.array(z.any()).default([]), // [{boreId, activity, lf, startTime, endTime}]
  labor: z.array(z.any()).default([]), // [{name, hours, rate, total}]
  equipment: z.array(z.any()).default([]), // [{name, hours, rate, total}]
  materials: z.array(z.any()).default([]), // [{description, qty, unit, cost, total}]
  weather: z.any().optional(), // {condition, temp, impact}
  notes: z.string().optional(),
  photos: z.array(z.any()).default([]), // [{url, caption, timestamp}]
  status: z.enum(['DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED']).default('DRAFT')
})

export const dailyReportUpdateSchema = z.object({
  reportDate: z.string().datetime().or(z.date()).transform(val => typeof val === 'string' ? new Date(val) : val).optional(),
  crew: z.array(z.any()).optional(),
  production: z.array(z.any()).optional(),
  labor: z.array(z.any()).optional(),
  equipment: z.array(z.any()).optional(),
  materials: z.array(z.any()).optional(),
  weather: z.any().optional(),
  notes: z.string().optional(),
  photos: z.array(z.any()).optional(),
  status: z.enum(['DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED']).optional(),
  signedById: z.string().optional()
})

export type DailyReportCreateInput = z.infer<typeof dailyReportCreateSchema>
export type DailyReportUpdateInput = z.infer<typeof dailyReportUpdateSchema>

// Rod Pass Schemas (Prisma-aligned with actual schema)
export const rodPassCreateSchema = z.object({
  boreId: z.string().min(1, 'Bore ID is required'),
  sequence: z.number().int().positive('Sequence must be positive'),
  passNumber: z.number().int().positive('Pass number must be positive'),
  linearFeet: z.number().positive('Linear feet must be positive'),
  fluidMix: z.string().optional(),
  fluidVolumeGal: z.number().nonnegative().optional(),
  startedAt: z.string().datetime().or(z.date()).transform(val => typeof val === 'string' ? new Date(val) : val).optional(),
  completedAt: z.string().datetime().or(z.date()).transform(val => typeof val === 'string' ? new Date(val) : val).optional(),
  notes: z.string().optional()
})

export const rodPassUpdateSchema = z.object({
  sequence: z.number().int().positive().optional(),
  passNumber: z.number().int().positive().optional(),
  linearFeet: z.number().positive().optional(),
  fluidMix: z.string().optional(),
  fluidVolumeGal: z.number().nonnegative().optional(),
  startedAt: z.string().datetime().or(z.date()).transform(val => typeof val === 'string' ? new Date(val) : val).optional(),
  completedAt: z.string().datetime().or(z.date()).transform(val => typeof val === 'string' ? new Date(val) : val).optional(),
  notes: z.string().optional()
})

export type RodPassCreateInput = z.infer<typeof rodPassCreateSchema>
export type RodPassUpdateInput = z.infer<typeof rodPassUpdateSchema>

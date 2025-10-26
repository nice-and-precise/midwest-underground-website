import { z } from 'zod'

// Auth Schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

export type LoginInput = z.infer<typeof loginSchema>

// Bore Log Schemas
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

// Project Schemas
export const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  client: z.string().min(1, 'Client is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  budget: z.number().min(0, 'Budget must be positive'),
  status: z.enum(['Active', 'Completing', 'Completed', 'On Hold', 'Planned']).default('Active'),
  footage: z.string().optional()
})

export type ProjectInput = z.infer<typeof projectSchema>

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

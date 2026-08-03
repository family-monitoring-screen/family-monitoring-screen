import { z } from 'zod'

export const deviceSchema = z.object({
  name: z.string().min(2, 'Device name must be at least 2 characters').max(50),
  deviceId: z.string().optional(),
})

export const deviceApprovalSchema = z.object({
  deviceId: z.string().min(1, 'Device ID is required'),
  approved: z.boolean(),
})

export const clientLinkSchema = z.object({
  expiryHours: z.number().min(1).max(72).default(24),
})

export type DeviceFormData = z.infer<typeof deviceSchema>
export type DeviceApprovalData = z.infer<typeof deviceApprovalSchema>

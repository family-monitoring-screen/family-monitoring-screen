import { z } from 'zod'

export const monitoringSettingsSchema = z.object({
  screenshotInterval: z.number().min(10).max(300),
  locationInterval: z.number().min(30).max(600),
})

export const storageSettingsSchema = z.object({
  maxScreenshots: z.number().min(100).max(10000),
  autoDeleteDays: z.number().min(1).max(365),
})

export const notificationSettingsSchema = z.object({
  notificationsEnabled: z.boolean(),
  emailAlerts: z.boolean(),
  pushNotifications: z.boolean(),
})

export type MonitoringSettingsData = z.infer<typeof monitoringSettingsSchema>
export type StorageSettingsData = z.infer<typeof storageSettingsSchema>
export type NotificationSettingsData = z.infer<typeof notificationSettingsSchema>

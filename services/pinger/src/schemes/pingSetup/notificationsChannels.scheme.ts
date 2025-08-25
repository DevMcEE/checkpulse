import z from "zod";
import { levelScheme } from "./level.scheme";

export const emailNotificationScheme = z.object({
    email: z.string().email(),
    level: levelScheme
})

export const slackNotificationScheme = z.object({
    slack: z.string(),
    level: levelScheme
})

export const notificationChannelsScheme = z.union([emailNotificationScheme, slackNotificationScheme])
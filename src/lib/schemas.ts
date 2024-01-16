import { z } from "zod";

export const macAddress = z.object({
    mac: z.string().regex(new RegExp('^[a-fA-F0-9]{2}(:[a-fA-F0-9]{2}){5}$'), 'Please enter a valid MAC address')
});
export type MacAddress = typeof macAddress

export const ipAddress = z.object({
    ip: z.string().ip()
})
export type IpAddress = typeof ipAddress
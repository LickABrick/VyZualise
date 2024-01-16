import { z } from "zod";

export const macAddress = {
    mac: z.string().regex(new RegExp('^[a-fA-F0-9]{2}(:[a-fA-F0-9]{2}){5}$'), 'Please enter a valid MAC address')
};
export type MacAddress = typeof macAddress

export const ipAddress = {
    ip: z.string().ip()
}
export type IpAddress = typeof ipAddress

export const macGroup = z.object({
    name: z.string(),
    ...macAddress
})
export type MacGroup = typeof macGroup
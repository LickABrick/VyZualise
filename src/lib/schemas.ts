import { z } from "zod";

export const macAddress = {
    mac: z.array(z.string().length(17).regex(new RegExp('^[a-fA-F0-9]{2}(:[a-fA-F0-9]{2}){5}$'), 'Please enter a valid MAC address'))
        .refine(data => data.length > 0, {
            message: "Enter at least one mac address",
        })
};
export type MacAddress = typeof macAddress

export const ipAddress = {
    ip: z.string().ip()
}
export type IpAddress = typeof ipAddress

export const macGroup = z.object({
    name: z.string(),
    description: z.string(),
    ...macAddress
})
export type MacGroup = typeof macGroup
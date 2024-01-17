declare class Client {
    baseUrl: string;
    apiKey: string;

    constructor(baseUrl: string, apiKey: string);
    set: {
        firewall: {
            group: {
                macGroup: (groupName: string) => {
                    address: (values: string[]) => Promise<void>;
                    description: (description: string) => Promise<void>;
                    include: (values: string[]) => Promise<void>;
                };
            };
        };
    };

    request(method: string, url: string, data?: string): Promise<any>;
}

export { Client as default };
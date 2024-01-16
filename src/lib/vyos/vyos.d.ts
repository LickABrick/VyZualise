declare class Client {
    baseUrl: string;
    apiKey: string;

    constructor(baseUrl: string, apiKey: string);

    firewall: {
        group: {
            macGroup: (groupName: string) => {
                set: (value: string) => Promise<void>;
            };
        };
    };

    request(method: string, url: string, data?: any): Promise<any>;
}

export { Client as default };

class Client {
	baseUrl: string;
	apiKey: string;

	constructor(baseUrl: string, apiKey: string) {
		this.baseUrl = baseUrl;
		this.apiKey = apiKey;
	}

	set = {
		firewall: {
			group: {
				macGroup: (groupName: string) => {
					return {
						address: async (values: string[]) => {
							const operations = values.map(value => ({
								op: 'set',
								path: ['firewall', 'group', 'mac-group', groupName, 'mac-address', value],
							}));
							await this.performOperation(operations);
						},
						description: async (description: string) => {
							await this.performOperation([
								{ op: 'set', path: ['firewall', 'group', 'mac-group', groupName, 'description', description] },
							]);
						},
						include: async (values: string[]) => {
							const operations = values.map(value => ({
								op: 'set',
								path: ['firewall', 'group', 'mac-group', groupName, 'include', value],
							}))
							await this.performOperation(operations);
						},
					};
				},
			},
		},
	};

	private async performOperation(operations: { op: string; path: string[] }[]) {
		try {
			const url = `${this.baseUrl}/configure`;
			const data = JSON.stringify(operations);

			await this.request('POST', url, data);
		} catch (error) {
			console.error('Error:', error.message);
			throw error; // Propagate the error
		}
	}

	private async request(method: string, url: string, data?: string | Blob): Promise<any> {
		try {
			const form: FormData | undefined = data ? new FormData() : undefined;
			if (form) {
				form.append('data', data as string);
				form.append('key', this.apiKey);
			}

			const response = await fetch(url, { method, body: form || undefined });

			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			return await response.json();
		} catch (error) {
			console.error('Fetch error:', error);
			throw error; // Propagate the error
		}
	}
}

export { Client as default };
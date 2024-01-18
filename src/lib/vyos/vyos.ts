import { config } from '$lib/stores';

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
							const operations = values.map((value) => ({
								op: 'set',
								path: ['firewall', 'group', 'mac-group', groupName, 'mac-address', value]
							}));
							await this.performOperation(operations);
						},
						description: async (description: string) => {
							await this.performOperation([
								{
									op: 'set',
									path: ['firewall', 'group', 'mac-group', groupName, 'description', description]
								}
							]);
						},
						include: async (values: string[]) => {
							const operations = values.map((value) => ({
								op: 'set',
								path: ['firewall', 'group', 'mac-group', groupName, 'include', value]
							}));
							await this.performOperation(operations);
						}
					};
				}
			}
		}
	};
	delete = {
		firewall: {
			group: {
				macGroup: (groupName: string) => {
					return {
						any: async () => {
							console.log('hoi')
							await this.performOperation([
								{
									op: 'delete',
									path: ['firewall', 'group', 'mac-group', groupName]
								}
							]);
						},
						address: async (values: string[]) => {
							const operations = values.map((value) => ({
								op: 'delete',
								path: ['firewall', 'group', 'mac-group', groupName, 'mac-address', value]
							}));
							await this.performOperation(operations);
						},
						description: async (description: string) => {
							await this.performOperation([
								{
									op: 'delete',
									path: ['firewall', 'group', 'mac-group', groupName, 'description', description]
								}
							]);
						},
						include: async (values: string[]) => {
							const operations = values.map((value) => ({
								op: 'delete',
								path: ['firewall', 'group', 'mac-group', groupName, 'include', value]
							}));
							await this.performOperation(operations);
						}
					};
				}
			}
		}
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
			console.log({ response: response });
			if (!response.ok || response.status !== 200) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			return await response.json();
		} catch (error) {
			console.error('Fetch error:', error);
			throw error; // Propagate the error
		}
	}
}
export function fetchConfig() {
	return new Promise((resolve, reject) => {
		try {
			const form = new FormData();
			form.append('data', '{"op": "showConfig", "path": []}');
			form.append('key', `${window.sessionStorage.getItem('vyos-apikey')}`);

			fetch(`${window.localStorage.getItem('vyos-endpoint-url')}/retrieve`, {
				method: 'POST',
				body: form
			})
				.then((response) => {
					// Check if the request was successful (status code 2xx)
					if (!response.ok) {
						throw new Error(`HTTP error! Status: ${response.status}`);
					}
					// Parse the response as JSON and resolve the promise

					return response.json();
				})
				.then((configData) => {
					config.set(configData);
					resolve(configData);
				})
				.catch((error) => {
					// Handle errors and reject the promise
					console.error('Fetch error:', error);
					reject(error);
				});
		} catch (error) {
			// Handle other synchronous errors and reject the promise
			console.error('Error:', error);
			reject(error);
		}
	});
}

export { Client as default };

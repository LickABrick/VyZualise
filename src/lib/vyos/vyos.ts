import type { MacAddress } from "$lib/schemas";

class Client {
	baseUrl: string;
	apiKey: string;

	constructor(baseUrl: string, apiKey: string) {
		this.baseUrl = baseUrl;
		this.apiKey = apiKey;
	}
	// TODO: change so it will be Client.set.firewall.macGroup('name').address(['list', 'of', 'values'])
	// TODO: create Client.set.firewall.macGroup('name').description('Description')
	// TODO: create Client.set.firewall.macGroup('name').include('name of group to include')
	firewall = {
		group: {
			macGroup: (groupName: string) => {
				return {
					set: async (value: string) => {
						console.log("hoi")
						const url = `${this.baseUrl}/configure`;
						const data = `{"op": "set", "path": ["firewall", "group", "mac-group", "${groupName}", "mac-address", "${value}"]}`;
						
						try {
							const result = await this.request('POST', url, data);
							console.log('Operation successful:', result);
						} catch (error) {
							console.error('Error:', error.message);
						}
					},
				};
			},
		},
	};

	request(method: string, url: string, data?: any): Promise<any> {
		return new Promise((resolve, reject) => {
			try {
				// const form = new FormData();
				// form.append('data', data);
				// form.append('key', this.apiKey);
				const form = new FormData();
				form.append(
					'data',
					data
				);
				form.append('key', this.apiKey);

				fetch(url, {
					method,
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
}


export { Client as default };

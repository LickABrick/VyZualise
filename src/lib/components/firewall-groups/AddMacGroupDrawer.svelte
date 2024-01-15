<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Drawer from '$lib/components/ui/drawer';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { toast } from 'svelte-sonner';
	import { config } from '$lib/stores';

	let open: boolean = false;

	function create(name: string, address: string) {
		return new Promise((resolve, reject) => {
			try {
				if (name && address) {
					const form = new FormData();
					form.append(
						'data',
						`{"op": "set", "path": ["firewall", "group", "mac-group", "${name}", "mac-address", "${address}"]}`
					);
					form.append('key', `${window.sessionStorage.getItem('vyos-apikey')}`);

					fetch(`${window.localStorage.getItem('vyos-endpoint-url')}/configure`, {
						method: 'POST',
						body: form
					})
						.then((response) => {
							console.log('🚀 ~ .then ~ response:', response);
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
				} else {
					// Reject the promise if apiKey or endpoint is missing
					reject(new Error('API key and endpoint are required.'));
				}
			} catch (error) {
				// Handle other synchronous errors and reject the promise
				console.error('Error:', error);
				reject(error);
			}
		});
	}

	function fetchConfig() {
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
						$config = configData
						console.log($config)
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
</script>

<Drawer.Root bind:open>
	<Drawer.Trigger>
		<Button variant="secondary" class="!ml-auto font-semibold">Create Group</Button>
	</Drawer.Trigger>
	<Drawer.Content class="mx-auto w-[64rem]">
		<Drawer.Header>
			<Drawer.Title>Create MAC Group</Drawer.Title>
		</Drawer.Header>
		<div class="p-4 pb-0">
			<form action="POST">
				<Label for="group-name">Name</Label>
				<Input id="group-name" placeholder="my-mac-group" />
				<Label for="group-members">Addresses</Label>
				<Input id="group-name" placeholder="88:a4:c2:15:b6:4f, 4c:d5:77:c0:19:81" />
			</form>
		</div>
		<Drawer.Footer>
			<!-- <Button on:click={() => create("TEST-GROUP", "28:7F:CF:67:54:A8")}>Create</Button> -->
			<Button
				on:click={() =>
					toast.promise(create('TEST-GROUP', '28:7F:CF:67:54:A8'), {
						loading: 'Creating group..',
						success: () => {
							open = false;
							fetchConfig();
							return 'Group created';
						},
						error: 'Something went wrong!'
					})}
			>
				Create
			</Button>
			<Drawer.Close>Cancel</Drawer.Close>
		</Drawer.Footer>
	</Drawer.Content>
</Drawer.Root>

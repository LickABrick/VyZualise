<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Drawer from '$lib/components/ui/drawer';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { toast } from 'svelte-sonner';
	import { config } from '$lib/stores';
	import { Vyos } from '$lib/vyos';
	import { superForm, superValidateSync } from 'sveltekit-superforms/client';
	import { macGroup } from '$lib/schemas';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

	let open: boolean = false;
	const { form, errors, enhance, constraints, delayed, allErrors } = superForm(
		superValidateSync(macGroup),
		{
			SPA: true,
			validators: macGroup,
			taintedMessage: null,
			async onUpdate({ form }) {
				if (form.valid) {
					toast.promise(vyos.firewall.group.macGroup(form.data.name).set(form.data.mac), {
						loading: 'Creating group..',
						success: () => {
							open = false;
							$form.mac = ""
							$form.name = ""
							fetchConfig();
							return 'Group created';
						},
						error: 'Something went wrong!'
					});
				}

				console.log(form.data);
			}
		}
	);

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
						$config = configData;
						console.log($config);
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

	const vyos = new Vyos('https://172.16.20.104:8443', '31e38809-7f86-49df-8ed3-ec2278649312');
	vyos.firewall.group.macGroup('ddd').set()
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
			<form id="add-mac-group-form" method="POST" use:enhance>
				<Label for="group-name">Name</Label>
				<Input id="group-name" bind:value={$form.name} placeholder="my-mac-group" />
				<Label for="group-members">Addresses</Label>
				<Input
					id="group-name"
					bind:value={$form.mac}
					placeholder="88:a4:c2:15:b6:4f, 4c:d5:77:c0:19:81"
				/>
			</form>
			<SuperDebug data={$form} />
		</div>
		<Drawer.Footer>
			<!-- <Button on:click={() => create("TEST-GROUP", "28:7F:CF:67:54:A8")}>Create</Button> -->
			<Button form="add-mac-group-form" type="submit">Create</Button>
			<Drawer.Close>Cancel</Drawer.Close>
		</Drawer.Footer>
	</Drawer.Content>
</Drawer.Root>

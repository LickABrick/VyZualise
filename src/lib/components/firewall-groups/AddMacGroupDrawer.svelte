<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Drawer from '$lib/components/ui/drawer';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { toast } from 'svelte-sonner';
	import { config } from '$lib/stores';
	import { Vyos } from '$lib/vyos';
	import { superForm, superValidateSync } from 'sveltekit-superforms/client';
	import { macAddress, macGroup, type MacAddress } from '$lib/schemas';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
	import TagsInput from '../tags-input/tags-input.svelte';
	import { writable, type Writable } from 'svelte/store';
	
	export let groupName: any
	let tags: Writable<string[]> = writable($config.data.firewall.group['mac-group'][`${groupName}`]['mac-address'].map((value: MacAddress) => ({ id: value, value: value})))
	let open: boolean = false;
	const { form, errors, enhance, constraints, delayed, allErrors } = superForm(
		superValidateSync(macGroup),
		{
			SPA: true,
			validators: macGroup,
			taintedMessage: null,
			async onUpdate({ form }) {
				if (form.valid) {
					// TODO: Change so it will add the list of mac-addresses filled in the input-tags
					toast.promise(vyos.set.firewall.group.macGroup(form.data.name).address(['00:00:5e:00:53:a3', '00:00:5e:00:53:a4']), {
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
	// vyos.set.firewall.group.macGroup('test').address('hoi')
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
				<!-- TODO: Add a 'Recycle Bin' tags-input where deleted mac-addresses will go. This input will have a button to restore the mac-addresses -->
				<!-- TODO: Make form work with the input of the mac-address tags -->
				<TagsInput bind:tags />
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

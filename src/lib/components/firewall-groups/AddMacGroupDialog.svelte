<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import { toast } from 'svelte-sonner';
	import { config } from '$lib/stores';
	import { superForm, superValidateSync } from 'sveltekit-superforms/client';
	import { macAddress, macGroup, type MacAddress } from '$lib/schemas';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
	import TagsInput from '../tags-input/tags-input.svelte';
	import { writable, type Writable } from 'svelte/store';
	import { Value } from '../ui/select';
	import { type CreateDialogProps } from '@melt-ui/svelte';
	import { fetchConfig } from '$lib/vyos/vyos';
	import { vyos } from '$lib/client';
	import { Loader2 } from 'lucide-svelte';

	export let open: boolean = false;
	export let groupName: any;
	let group: any;
	let tags: Writable<any[]> = writable([]);
	let delayed = false;
	function setTags(groupName: string) {
		if (groupName) {
			group = $config.data.firewall.group['mac-group'][`${groupName}`];
			if (Array.isArray(group['mac-address'])) {
				tags.set(group['mac-address'].map((value: MacAddress) => ({ id: value, value: value })));
			} else {
				tags.set([{ id: group['mac-address'], value: group['mac-address'] }]);
			}
		} else {
			group = undefined;
			tags.set([]);
		}
		$form.name = groupName;
		$form.description = group?.description ? group.description : '';
	}
	$: setTags(groupName);
	$: calculateTags($tags);

	function calculateTags(tags: any) {
		if (tags) {
			const arrayOfTags = tags.map((obj) => obj.value);
			$form.mac = arrayOfTags;
		}
	}

	const { form, errors, enhance, constraints, allErrors } = superForm(superValidateSync(macGroup), {
		SPA: true,
		validators: macGroup,
		taintedMessage: null,
		async onUpdate({ form }) {
			if (form.valid) {
				const result = async () => {
					try {
						await $vyos.set.firewall.group.macGroup(form.data.name).address($form.mac);
						if($form.description) {
							await $vyos.set.firewall.group.macGroup(form.data.name).description($form.description);
						}
					} catch (error) {
						// TODO add better error based on the request that failed.
						return 'Something went wrong';
					}
				};
				delayed = true;
				toast.promise(result, {
					loading: 'Creating group..',
					success: () => {
						open = false;
						$form.mac = [];
						$form.name = '';
						fetchConfig();
						return 'Group created';
					},
					error: 'Something went wrong!'
				});
			}
		}
	});
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="max-w-2xl">
		<Dialog.Header>
			<Dialog.Title>
				{#if groupName}
					Edit MAC Group
				{:else}
					Create MAC Group
				{/if}
			</Dialog.Title>
			<Dialog.Description>
				This action cannot be undone. This will permanently delete your account and remove your data
				from our servers.
			</Dialog.Description>
		</Dialog.Header>
		<form id="add-mac-group-form" method="POST" use:enhance>
			<Label for="group-name">Name</Label>
			<Input id="group-name" bind:value={$form.name} placeholder="my-mac-group" required />
			<Label for="group-name">Description</Label>
			<Input id="group-description" bind:value={$form.description} />
			<input type="hidden" bind:value={$form.mac} />
			<Label for="group-members">Addresses</Label>
			<!-- TODO: add posibility to include other groups. -->
			<!-- TODO: Add a 'Recycle Bin' tags-input where deleted mac-addresses will go. This input will have a button to restore the mac-addresses -->
			<TagsInput bind:tags />
			{#if $errors.mac}
				<div class="text-sm font-medium text-destructive">{$errors.mac._errors}</div>
			{/if}
		</form>
		<SuperDebug data={$form} />
		<Dialog.Footer>
			<Button bind:disabled={delayed} form="add-mac-group-form" type="submit">
				{#if !delayed}
					{#if groupName}
						Save
					{:else}
						Create
					{/if}
				{:else}
					<Loader2 class="size-[1.2rem] animate-spin" />
				{/if}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

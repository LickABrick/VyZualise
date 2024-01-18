<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Component, Pen, Trash2, Loader2 } from 'lucide-svelte';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import * as Table from '$lib/components/ui/table';
	import { Badge } from '$lib/components/ui/badge';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { config } from '$lib/stores';
	import { Button } from '../ui/button';
	import AddMacGroupDialog from './AddMacGroupDialog.svelte';
	import { vyos } from '$lib/client';
	import { toast } from 'svelte-sonner';
	import { fetchConfig } from '$lib/vyos/vyos';

	let groupToEdit: string | undefined;
	let addGroupDrawerOpen: boolean;
	let deleteDialogOpen: boolean = false;
	let delayed: boolean = false;

	function deleteGroup() {
		delayed = true;
		
		toast.promise($vyos.delete.firewall.group.macGroup(groupToEdit).any(), {
			loading: 'Deleting group..',
			success: () => {
				fetchConfig();
				delayed = false;
				// Seems like we can only execute 1 API request at the same time so we have to disable the buttons and leave the dialog open until the action is completed.
				deleteDialogOpen = false;
				return 'Group deleted';
			},
			error: 'Something went wrong!'
		});
	}
</script>

<Card.Root>
	<Card.Header>
		<Card.Title tag="h1" class="flex items-center text-2xl">
			<div class="flex items-center gap-2">
				<Component />
				MAC Groups
			</div>
			<div class="!ml-auto">
				<Button
					variant="secondary"
					class="!ml-auto font-semibold"
					on:click={() => {
						addGroupDrawerOpen = true;
						groupToEdit = undefined;
					}}>Create Group</Button
				>
			</div>
		</Card.Title>
		<Card.Description>A mac group represents a collection of mac addresses.</Card.Description>
	</Card.Header>
	<Card.Content>
		<Table.Root>
			<Table.Caption>Firewall MAC groups</Table.Caption>
			<Table.Header>
				<Table.Row>
					<Table.Head>Name</Table.Head>
					<Table.Head>Description</Table.Head>
					<Table.Head class="text-right">MAC</Table.Head>
					<Table.Head></Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each Object.entries($config.data.firewall.group['mac-group']) as [name, addressItem]}
					<Table.Row>
						<Table.Cell class="font-medium">{name}</Table.Cell>
						<Table.Cell>{addressItem.description || ''}</Table.Cell>
						<Table.Cell class="overflow-auto text-right">
							{#if addressItem['mac-address']}
								{#if Array.isArray(addressItem['mac-address'])}
									{#each addressItem['mac-address'] as item}
										<Badge class="ml-2">{item}</Badge>
									{/each}
								{:else}
									<Badge class="ml-2">{addressItem['mac-address']}</Badge>
								{/if}
							{/if}
							{#if addressItem.include}
								{#each addressItem.include as item}
									<Tooltip.Root openDelay={100}>
										<Tooltip.Trigger>
											<Badge class="ml-2" variant="secondary">
												{item}
											</Badge>
										</Tooltip.Trigger>
										<Tooltip.Content>
											{#if Array.isArray($config.data.firewall.group['mac-group'][item]['mac-address'])}
												{#each $config.data.firewall.group['mac-group'][item]['mac-address'] as item}
													<div class="flex flex-col">
														{item}
													</div>
												{/each}
											{:else}
												{$config.data.firewall.group['mac-group'][item]['mac-address']}
											{/if}
										</Tooltip.Content>
									</Tooltip.Root>
								{/each}
							{/if}
						</Table.Cell>
						<Table.Cell class="w-[2rem]">
							<div class="flex gap-2">
								<Button
									variant="outline"
									size="icon"
									on:click={() => {
										groupToEdit = name;
										deleteDialogOpen = true;
									}}><Trash2 class="size-[1.2rem]" /></Button
								>
								<Button
									variant="outline"
									size="icon"
									on:click={() => {
										groupToEdit = name;
										addGroupDrawerOpen = true;
									}}
								>
									<Pen class="size-[1.2rem]" />
								</Button>
							</div>
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</Card.Content>
	<Card.Footer>
		<p>Card Footer</p>
	</Card.Footer>
</Card.Root>

<AddMacGroupDialog bind:open={addGroupDrawerOpen} bind:groupName={groupToEdit} />

<AlertDialog.Root bind:open={deleteDialogOpen}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title
				>Are you absolutely sure you want to delete <span class="text-destructive"
					>{groupToEdit}</span
				>?</AlertDialog.Title
			>
			<AlertDialog.Description>
				This action cannot be undone. This will permanently delete the MAC group from your VyOS
				server.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel bind:disabled={delayed}>Cancel</AlertDialog.Cancel>
			<Button bind:disabled={delayed} variant="destructive" on:click={() => deleteGroup()}>
				{#if !delayed}
					I'm sure
				{:else}
					<Loader2 class="size-[1.2rem] animate-spin" />
				{/if}
			</Button>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>

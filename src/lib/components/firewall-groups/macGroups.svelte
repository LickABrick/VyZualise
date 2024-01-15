<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Component, SquareStack, Plus } from 'lucide-svelte';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import * as Table from '$lib/components/ui/table';
	import { Badge } from '$lib/components/ui/badge';
	import { config } from '$lib/stores';
	import { AddMacGroupDrawer } from '$lib/components/firewall-groups';

</script>

<Card.Root>
	<Card.Header>
		<Card.Title tag="h1" class="flex items-center text-2xl">
			<div class="flex items-center gap-2">
				<Component />
				MAC Groups
			</div>
			<div class="!ml-auto">
				<AddMacGroupDrawer />
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
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</Card.Content>
	<Card.Footer>
		<p>Card Footer</p>
	</Card.Footer>
</Card.Root>

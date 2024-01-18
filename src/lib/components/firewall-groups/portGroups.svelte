<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Component } from 'lucide-svelte';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import * as Table from '$lib/components/ui/table';
	import { Badge } from '$lib/components/ui/badge';
	import { config } from '$lib/stores';
</script>

<Card.Root>
	<Card.Header>
		<Card.Title tag="h1" class="flex items-center gap-2 text-2xl">
			<Component />
			Network Groups
		</Card.Title>
		<Card.Description
			>A network group represents a collection of networks in CIDR notation.</Card.Description
		>
	</Card.Header>
	<Card.Content>
		<Table.Root>
			<Table.Caption>Firewall Network groups</Table.Caption>
			<Table.Header>
				<Table.Row>
					<Table.Head>Name</Table.Head>
					<Table.Head>Description</Table.Head>
					<Table.Head class="text-right">Network</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each Object.entries($config.data.firewall.group['network-group']) as [name, addressItem]}
					<Table.Row>
						<Table.Cell class="font-medium">{name}</Table.Cell>
						<Table.Cell>{addressItem.description || ''}</Table.Cell>
						<Table.Cell class="overflow-auto text-right">
							{#if Array.isArray(addressItem.network)}
								{#each addressItem.network.sort() as item}
									<Badge class="ml-2">{item}</Badge>
								{/each}
							{:else}
								<Badge class="ml-2">{addressItem}</Badge>
							{/if}
							<!-- TODO: fix include for port groups, probably doesn't work :) -->
							{#if addressItem.include}
								{#each addressItem.include as item}
									<Tooltip.Root openDelay={100}>
										<Tooltip.Trigger
											><Badge class="ml-2" variant="secondary">{item}</Badge></Tooltip.Trigger
										>
										<Tooltip.Content>
											{#if Array.isArray($config.data.firewall.group['network-group'][item].network)}
												{#each $config.data.firewall.group.network[item]['network-address'] as item}
													<div class="flex flex-col">
														{item}
													</div>
												{/each}
											{:else}
												{$config.data.firewall.group['network-group'][item]['mac-address']}
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

<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs';
	import { config } from '$lib/stores';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { KeySquare, Lock, Unlock } from 'lucide-svelte';
	import { Input } from '$lib/components/ui/input';
	let locked = false;
	const wg: any = $config.data.interfaces.wireguard;
</script>

<Tabs.Root value="0" class="w-full">
	<Tabs.List>
		{#each Object.entries(wg) as [name], i}
			<Tabs.Trigger value={i.toString()}>{name.toUpperCase()}</Tabs.Trigger>
		{/each}
	</Tabs.List>
	{#each Object.entries(wg) as [name, item], i}
		<Tabs.Content value={i.toString()}>
			<div class="grid grid-flow-row grid-cols-3 gap-4">
				<Card.Root class="col-span-1 row-span-1">
					<Card.Header>
						<Card.Title class="flex">
							<span class="align-bottom">{name.toUpperCase()}</span>
							<Button
								size="icon"
								variant="outline"
								class="!ml-auto"
								on:click={() => (locked = !locked)}
							>
								{#if locked}
									<Lock class="size-[1rem]" />
								{:else}
									<Unlock class="size-[1rem] text-destructive" />
								{/if}
							</Button>
						</Card.Title>
						<Card.Description>{item.description}</Card.Description>
					</Card.Header>

					<Card.Content>
						<div class="flex gap-2">
							<Card.Root class="h-auto grow">
								<Card.Header class="flex flex-row items-center justify-between pb-2 space-y-0">
									<Card.Title class="text-sm font-medium">Address</Card.Title>
								</Card.Header>
								<Card.Content>
									<Input
										type="text"
										disabled={locked}
										class="text-xl font-bold !max-w-[10rem] disabled:border-background"
										value={item.address}
									/>
								</Card.Content>
							</Card.Root>
							<Card.Root class="grow">
								<Card.Header class="flex flex-row items-center justify-between pb-2 space-y-0">
									<Card.Title class="text-sm font-medium">Port</Card.Title>
								</Card.Header>
								<Card.Content>
									<Input
										type="text"
										disabled={locked}
										class="text-xl font-bold !max-w-[6rem] disabled:border-background"
										value={item.port}
									/>
								</Card.Content>
							</Card.Root>
							<Card.Root class="grow">
								<Card.Header class="flex flex-row items-center justify-between pb-2 space-y-0">
									<Card.Title class="text-sm font-medium"># of peers</Card.Title>
								</Card.Header>
								<Card.Content>
									<div class="text-xl font-bold">{Object.keys(item.peer).length}</div>
								</Card.Content>
							</Card.Root>
						</div>
						<Button class="w-full mt-4 space-x-2 font-semibold">
							<KeySquare class="size-[1.2rem]" />
							<span>Click to reveal private key</span>
						</Button>
					</Card.Content>
				</Card.Root>
				<Card.Root class="col-span-2 row-span-12">
					<Card.Header>
						<Card.Title>Peers</Card.Title>
						<Card.Description>View and configure your wireguard peers</Card.Description>
					</Card.Header>
					<Card.Content class="flex flex-col gap-2">
						{#each Object.entries(item.peer) as [name, item]}
							<Card.Root class="grow">
								<Card.Header>
									<Card.Title>{name}</Card.Title>
								</Card.Header>
								<Card.Content>
									<div>{item['allowed-ips']}</div>
								</Card.Content>
							</Card.Root>
						{/each}
					</Card.Content>
				</Card.Root>
			</div>
		</Tabs.Content>
	{/each}
</Tabs.Root>

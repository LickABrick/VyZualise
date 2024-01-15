<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Component, SquareStack } from 'lucide-svelte';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import * as Table from '$lib/components/ui/table';
	import { Badge } from '$lib/components/ui/badge';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';

	import { config } from '$lib/stores';
</script>

<div class="flex columns-1 flex-col gap-4 lg:flex-row">
	{#each Object.entries($config.data.service['dhcp-server']['shared-network-name']) as [name, value]}
		<Card.Root class="grow">
			<Card.Header>
				<Card.Title class="flex justify-center">
					<span>{name}</span>
					<Button size="sm" disabled class="!ml-auto">Edit</Button>
				</Card.Title>
			</Card.Header>
			<Card.Content class="flex gap-2 flex-col">
				<div class="flex gap-2">
					<Card.Root class="grow">
						<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
							<Card.Title class="text-sm font-medium">Domain name</Card.Title>
						</Card.Header>
						<Card.Content>
							<div class="text-xl font-bold">{value.option['domain-name']}</div>
						</Card.Content>
					</Card.Root>
					<Card.Root class="grow">
						<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
							<Card.Title class="text-sm font-medium">Subnet</Card.Title>
						</Card.Header>
						<Card.Content>
							<div class="text-xl font-bold">{Object.keys(value.subnet)[0]}</div>
						</Card.Content>
					</Card.Root>
					<Card.Root class="grow">
						<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
							<Card.Title class="text-sm font-medium"># IP's</Card.Title>
						</Card.Header>
						<Card.Content>
							<div class="text-xl font-bold" >255</div>
						</Card.Content>
					</Card.Root>
				</div>
        <Label for="default-router">Default gateway</Label>
				<Input disabled type="text" value={value.subnet[(Object.keys(value.subnet)[0])].option['default-router']} />
        <Label for="default-router">DNS Servers</Label>
				<Input disabled type="text" value={value.subnet[(Object.keys(value.subnet)[0])].option['name-server']} />
			</Card.Content>
		</Card.Root>
	{/each}
</div>

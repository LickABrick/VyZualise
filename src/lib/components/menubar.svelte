<script lang="ts">
	import * as Menubar from '$lib/components/ui/menubar';
	import { Button } from '$lib/components/ui/button';
	import { Github } from 'lucide-svelte';
	import { goto } from '$app/navigation';
</script>

<Menubar.Root>
	<span class="ml-2 mr-8 font-semibold leading-tight">VyZualizer</span>
	<Menubar.Menu>
		<Menubar.Trigger>Firewall</Menubar.Trigger>
		<Menubar.Content>
			<Menubar.Item on:click={() => goto('/config/firewall/groups')}>Groups</Menubar.Item>
		</Menubar.Content>
	</Menubar.Menu>
	<Menubar.Menu>
		<Menubar.Trigger>Service</Menubar.Trigger>
		<Menubar.Content>
			<Menubar.Item on:click={() => goto('/config/service/dhcp')}>DHCP</Menubar.Item>
		</Menubar.Content>
	</Menubar.Menu>
	<Menubar.Menu>
		<Menubar.Trigger class="!ml-auto">
			<Github class="h-[1.2rem] w-[1.2rem]" />
		</Menubar.Trigger>
		<Menubar.Content>
			<Menubar.Item
				on:click={() => window.open('https://github.com/LickABrick/VyZualise/', '_blank')}
			>
				View on Github
			</Menubar.Item>
		</Menubar.Content>
	</Menubar.Menu>
</Menubar.Root>

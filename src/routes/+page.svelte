<script lang="ts">
	import { config } from '$lib/stores';
	import { MacGroups, NetworkGroups } from '$lib/components/firewall-groups';
	import ConfigInputCard from '$lib/components/configInputCard.svelte';
	import LightSwitch from '$lib/components/lightSwitch.svelte';
	import Menubar from '$lib/components/menubar.svelte';
	import * as Tabs from '$lib/components/ui/tabs';
	import { Button } from '$lib/components/ui/button';
	import { Github } from 'lucide-svelte';
</script>

<ConfigInputCard />
<div class="fixed bottom-4 right-4">
	<Button
		variant="outline"
		on:click={() => window.open('https://github.com/LickABrick/VyZualise/', '_blank')}
	>
		<Github class="h-[1.2rem] w-[1.2rem]" />
	</Button>
	<LightSwitch />
</div>

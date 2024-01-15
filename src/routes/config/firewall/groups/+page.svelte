<script lang="ts">
	import { config } from '$lib/stores';
	import { MacGroups, NetworkGroups } from '$lib/components/firewall-groups';
	import ConfigInputCard from '$lib/components/configInputCard.svelte';
	import LightSwitch from '$lib/components/lightSwitch.svelte';
	import * as Tabs from '$lib/components/ui/tabs';
	import { Button } from '$lib/components/ui/button';
	import { Github } from 'lucide-svelte';
</script>


<Tabs.Root value="mac" class="w-full">
	<Tabs.List>
		<Tabs.Trigger value="mac">MAC</Tabs.Trigger>
		<Tabs.Trigger value="network">Network</Tabs.Trigger>
	</Tabs.List>
	<Tabs.Content value="mac">
		<MacGroups />
		
	</Tabs.Content>
	<Tabs.Content value="network">
        <NetworkGroups />
    </Tabs.Content>
</Tabs.Root>

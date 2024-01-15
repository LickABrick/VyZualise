<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs';
    import { getConfigState } from '$lib/state.svelte';

    const config = getConfigState()
    // export let config;
</script>

<Tabs.Root value="server" class="w-full">
	<Tabs.List>
		<Tabs.Trigger value="server">Server</Tabs.Trigger>
		<Tabs.Trigger value="network">Network</Tabs.Trigger>
	</Tabs.List>
	<Tabs.Content value="server">
        {$config}
    </Tabs.Content>
	<Tabs.Content value="network"></Tabs.Content>
</Tabs.Root>

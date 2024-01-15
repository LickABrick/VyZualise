<script lang="ts">
    import { DhcpServer } from "$lib/components/service"
    	import * as Tabs from '$lib/components/ui/tabs';

</script>

<Tabs.Root value="server" class="w-full">
	<Tabs.List>
		<Tabs.Trigger value="server">Server</Tabs.Trigger>
		<Tabs.Trigger value="network">Network</Tabs.Trigger>
	</Tabs.List>
	<Tabs.Content value="server">
		<DhcpServer />
	</Tabs.Content>
	<Tabs.Content value="network">
    </Tabs.Content>
</Tabs.Root>
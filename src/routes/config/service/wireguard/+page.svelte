<script lang="ts">
	import { DhcpServer } from '$lib/components/service';
	import { Wireguard } from '$lib/components/service/wireguard';
	import * as Tabs from '$lib/components/ui/tabs';
</script>

<Tabs.Root value="server" class="w-full">
	<Tabs.List>
		<Tabs.Trigger value="server">Server</Tabs.Trigger>
		<Tabs.Trigger value="network">Network</Tabs.Trigger>
	</Tabs.List>
	<Tabs.Content value="server">
		<Wireguard />
	</Tabs.Content>
	<Tabs.Content value="network"></Tabs.Content>
</Tabs.Root>

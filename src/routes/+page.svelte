<script lang="ts">
	import { config } from '$lib/stores';
	import { MacGroups, NetworkGroups } from '$lib/components/firewall-groups';
	import ConfigInputCard from '$lib/components/configInputCard.svelte';
</script>

{#if $config}
	<MacGroups />
	<NetworkGroups />
{:else}
	<ConfigInputCard />
{/if}

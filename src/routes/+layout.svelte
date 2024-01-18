<script lang="ts">
	import '../app.pcss';
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from '$lib/components/ui/sonner';
	import { config } from '$lib/stores';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { fetchConfig } from '$lib/vyos/vyos';
	import { toast } from 'svelte-sonner';
	import { vyos } from '$lib/client';
	import { Vyos } from '$lib/vyos';
	import { onMount } from 'svelte';
    
    onMount(async () => {
        if (
		window.sessionStorage.getItem('vyos-apikey') &&
		window.localStorage.getItem('vyos-endpoint-url')
	) {
		toast.promise(fetchConfig(), {
			loading: 'Retrieving config...',
			success: (response: any) => {
				config.set(response);
				vyos.set(new Vyos(window.localStorage.getItem('vyos-endpoint-url'), window.sessionStorage.getItem('vyos-apikey')));
				goto(`${base}/config`);
				return 'Config loaded successfully';
			},
			error: 'Something went wrong! Check if the entered values are correct.'
		});
	}
    })

</script>

<ModeWatcher />
<Toaster />
<div class="flex flex-col min-h-screen gap-2 mx-4 mt-4 lg:mx-48 bg-background">
	<slot />
</div>

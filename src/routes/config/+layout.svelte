<script>
	import '../../app.pcss';
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from '$lib/components/ui/sonner';
	import { config } from '$lib/stores';
	import { goto } from '$app/navigation';
	import Menubar from '$lib/components/menubar.svelte';
	import LightSwitch from '$lib/components/lightSwitch.svelte';
	import { base } from '$app/paths';
    console.log($config)
	if (!$config) {
		goto(`${base}/`);
	}
</script>

<ModeWatcher />
<Toaster />
<div class="flex flex-col min-h-screen gap-2 mt-4 bg-background">
	<Menubar />
	<slot />
</div>

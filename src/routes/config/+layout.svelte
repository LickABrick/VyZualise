<script>
	import '../../app.pcss';
    import { ModeWatcher } from "mode-watcher";
    import { Toaster } from "$lib/components/ui/sonner";
    import { config } from "$lib/stores"
   	import { goto } from '$app/navigation';
	import Menubar from '$lib/components/menubar.svelte';
    import LightSwitch from '$lib/components/lightSwitch.svelte';
    import { Button } from '$lib/components/ui/button';
	import { Github } from 'lucide-svelte';

    if(!$config) {
        goto("/")
    }
</script>

<ModeWatcher />
<Toaster />
<div class="flex flex-col min-h-screen gap-2 mt-4 bg-background">
    <Menubar />
    <slot />
    <div class="fixed bottom-4 right-4">
	<LightSwitch />
</div>
</div>



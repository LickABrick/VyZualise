<script>
	import '../../app.pcss';
    import { ModeWatcher } from "mode-watcher";
    import { Toaster } from "$lib/components/ui/sonner";
    import { config } from "$lib/stores"
   	import { goto } from '$app/navigation';
	import Menubar from '$lib/components/menubar.svelte';

    if(!$config) {
        goto("/")
    }
</script>

<ModeWatcher />
<Toaster />
<div class="min-h-screen flex flex-col bg-background gap-2 mt-4">
    <Menubar />
    <slot />
</div>


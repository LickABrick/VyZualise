<script>
	import '../app.pcss';
    import { ModeWatcher } from "mode-watcher";
    import { Toaster } from "$lib/components/ui/sonner";
    import { config } from "$lib/stores"
	import { goto } from '$app/navigation';

    if($config) {
        goto('/config');
    }
</script>

<ModeWatcher />
<Toaster />
<div class="flex flex-col min-h-screen gap-2 mx-48 mt-4 bg-background">
    <slot />
</div>


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
<div class="min-h-screen flex flex-col bg-background mx-48 gap-2 mt-4">
    <slot />
</div>


<script>
	import '../app.pcss';
    import { ModeWatcher } from "mode-watcher";
</script>

<ModeWatcher />
<div class="min-h-screen flex flex-col bg-background mx-48 gap-2 mt-4">
    <slot />
</div>


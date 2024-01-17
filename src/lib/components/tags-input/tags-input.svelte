<script lang="ts">
	import { createTagsInput } from '@melt-ui/svelte';
	import { X } from 'lucide-svelte';
	import { writable, type Writable } from 'svelte/store';

	export let tags: Writable<any> = writable([]);
	const {
		elements: { root, input, tag, deleteTrigger, edit },
	} = createTagsInput({
		unique: true,
		tags,
		add(tag: string) {
			if(!(new RegExp('^[a-fA-F0-9]{2}(:[a-fA-F0-9]{2}){5}$')).test(tag)) {
				console.log("not a mac")
				throw new Error('value is not a mac-address')
			}
			return { id: tag, value: tag };
		},
		addOnPaste: true,
	});
</script>

<div class="flex flex-col items-start justify-center gap-2">
	<div
		{...$root}
		use:root
		class="flex w-full h-10 gap-2 px-3 py-2 text-sm bg-transparent border rounded-md border-input ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
	>
		{#each $tags as t}
			<div
				{...$tag(t)}
				use:tag
				class="inline-flex select-none items-center rounded-full border border-transparent bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
			>
				<span class="flex items-center px-1.5">{t.value}</span>
				<button {...$deleteTrigger(t)} use:deleteTrigger class="flex items-center h-full px-1">
					<X class="square-3 size-[1rem]" />
				</button>
			</div>
			<div
				{...$edit(t)}
				use:edit
				class="inline-flex select-none items-center rounded-full border border-transparent bg-primary/70 px-2.5 py-0.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
			/>
		{/each}

		<input
			{...$input}
			use:input
			type="text"
			placeholder="Enter tags..."
			class="min-w-[4.5rem] shrink grow basis-0 border-0 bg-transparent text-foreground outline-none focus:!ring-0 data-[invalid]:text-destructive"
		/>
	</div>
</div>

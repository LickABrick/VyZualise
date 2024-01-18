<script lang="ts">
	import { createTagsInput } from '@melt-ui/svelte';
	import { X } from 'lucide-svelte';
	import { writable, type Writable } from 'svelte/store';

	export let tags: Writable<any> = writable([]);
	let invalidTag = false;

	const {
		elements: { root, input, tag, deleteTrigger, edit }
	} = createTagsInput({
		unique: true,
		tags,
		add(tag: string) {
			if (!new RegExp('^[a-fA-F0-9]{2}(:[a-fA-F0-9]{2}){5}$').test(tag)) {
				invalidTag = true;
				throw new Error('value is not a mac-address');
			}
			invalidTag = false;
			return { id: tag, value: tag };
		},
		addOnPaste: true
	});
</script>

<!-- inline-flex select-none items-center rounded-full border border-transparent bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 -->
<div class="space-y-2">
	<div class="grid grid-cols-4">
		{#each $tags as t}
			<div>
				<div
					{...$tag(t)}
					use:tag
					class="inline-flex pl-2 text-sm font-semibold rounded-md bg-primary text-primary-foreground hover:bg-primary/80"
				>
					<span class="flex items-center">{t.value}</span>
					<button {...$deleteTrigger(t)} use:deleteTrigger class="px-1">
						<X class="square-3 size-[1rem]" />
					</button>
				</div>
				<div
					{...$edit(t)}
					use:edit
					class="inline-flex px-2 text-sm font-semibold rounded-md bg-secondary text-secondary-foreground"
				/>
			</div>
		{/each}
	</div>
	<div class="flex flex-col items-start justify-center gap-2">
		<div
			{...$root}
			use:root
			class="flex w-full h-10 gap-2 px-3 py-2 text-sm bg-transparent border rounded-md border-input ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
		>
			<input
				{...$input}
				use:input
				type="text"
				placeholder="Enter MAC address..."
				class="min-w-[4.5rem] shrink grow basis-0 border-0 bg-transparent text-foreground outline-none focus:!ring-0 data-[invalid]:text-destructive"
			/>
			{#if invalidTag}
				 <div class="text-sm font-medium text-destructive">Please enter a valid MAC address</div>
			{/if}
		</div>
	</div>
</div>

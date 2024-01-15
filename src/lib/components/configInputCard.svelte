<script lang="ts">
	import * as Alert from '$lib/components/ui/alert';
	import { CloudOff, HelpCircle, Rocket, Loader2 } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { buttonVariants } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import * as Card from '$lib/components/ui/card';
	import { config } from '$lib/stores';
	import { superForm, superValidateSync } from 'sveltekit-superforms/client';
	import { z } from 'zod';
    	import { goto } from '$app/navigation';

	import { toast } from 'svelte-sonner';

	onMount(async () => {
		$form.apiKey = window.sessionStorage.getItem('vyos-apikey') || '';
		$form.endpoint = window.localStorage.getItem('vyos-endpoint-url') || '';
	});

	const schema = z.object({
		apiKey: z.string(),
		endpoint: z.string()
	});

	const { form, errors, enhance, constraints, delayed, allErrors } = superForm(
		superValidateSync(schema),
		{
			SPA: true,
			validators: schema,
			taintedMessage: null,
			async onUpdate({ form }) {
				if (form.valid) {
					console.log(form.data);
					await toast.promise(fetchConfig(form.data.apiKey, form.data.endpoint), {
						loading: 'Retrieving config...',
						success: (response: any) => {
                            window.sessionStorage.setItem('vyos-apikey', form.data.apiKey)
                            window.localStorage.setItem('vyos-endpoint-url', form.data.endpoint)
							config.set(response);
                            goto("/config")
							return 'Config loaded successfully';
						},
                        error: 'Something went wrong! Check if the entered values are correct.'
					});
					
				}
			}
		}
	);

	function fetchConfig(apiKey: string, endpoint: string) {
		return new Promise((resolve, reject) => {
			try {
				if (apiKey && endpoint) {
					const form = new FormData();
					form.append('data', '{"op": "showConfig", "path": []}');
					form.append('key', apiKey);

					fetch(`${endpoint}/retrieve`, {
						method: 'POST',
						body: form
					})
						.then((response) => {
							console.log('🚀 ~ .then ~ response:', response);
							// Check if the request was successful (status code 2xx)
							if (!response.ok) {
								throw new Error(`HTTP error! Status: ${response.status}`);
							}
							// Parse the response as JSON and resolve the promise
							return response.json();
						})
						.then((configData) => {
							resolve(configData);
						})
						.catch((error) => {
							// Handle errors and reject the promise
							console.error('Fetch error:', error);
							reject(error);
						});
				} else {
					// Reject the promise if apiKey or endpoint is missing
					reject(new Error('API key and endpoint are required.'));
				}
			} catch (error) {
				// Handle other synchronous errors and reject the promise
				console.error('Error:', error);
				reject(error);
			}
		});
	}
</script>

<div class="mx-auto my-[20vh] flex w-[32rem] flex-col gap-2">
	<Card.Root>
		<Card.Header>
			<Card.Title>VyZualise</Card.Title>
			<Card.Description>
				Enter the fields below to get a visual representation of your VyOS configuration!
			</Card.Description>
		</Card.Header>
		<Card.Content>
			<form method="POST" class="space-y-2" id="config" use:enhance>
				<Label for="endpoint">VyOS API url</Label>
				<Input
					required
					id="endpoint"
					type="text"
					placeholder="e.g. https://192.168.1.254"
					class="w-full"
					bind:value={$form.endpoint}
					{...$constraints.endpoint}
				/>
				<Label for="apiKey">VyOS API Key</Label>
				<div class="flex w-full items-center space-x-2">
					<Input
						id="apiKey"
						type="text"
						class="w-full"
						bind:value={$form.apiKey}
						required
						{...$constraints.apiKey}
					/>
					<a
						href="https://docs.vyos.io/en/equuleus/configuration/service/https.html#example-configuration"
						target="_blank"
						class={buttonVariants({ variant: 'outline' })}
					>
						<HelpCircle class="size-[1.2rem]" />
					</a>
				</div>
			</form>
		</Card.Content>
		<Card.Footer>
			{#if !$delayed}
				<Button form="config" type="submit" class="ml-auto space-x-2">
					<Rocket class="size-5" />
					<span class="font-semibold">Retrieve config</span>
				</Button>
			{:else}
				<Button disabled class="w-full">
					<Loader2 class="mr-2 h-4 w-4 animate-spin" />
				</Button>
			{/if}
		</Card.Footer>
	</Card.Root>
	<Tooltip.Root openDelay={100}>
		<Tooltip.Trigger>
			<Button class="w-full" disabled>Download Desktop version</Button>
		</Tooltip.Trigger>
		<Tooltip.Content side="right">Coming soon</Tooltip.Content>
	</Tooltip.Root>
	<Alert.Root>
		<CloudOff class="h-4 w-4" />
		<Alert.Title>Notice</Alert.Title>
		<Alert.Description>
			All processing occurs locally in your browser, ensuring data privacy with no transmission of sensitive information to external servers.
		</Alert.Description>
	</Alert.Root>
</div>

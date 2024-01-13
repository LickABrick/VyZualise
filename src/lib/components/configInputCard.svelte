<script lang="ts">
	import * as Alert from '$lib/components/ui/alert';
	import { CloudOff, HelpCircle, Rocket, Github } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import { buttonVariants } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import * as Card from '$lib/components/ui/card';
	import { config } from '$lib/stores';

	let apiKey: string | undefined;
	let endpoint: string | undefined;

	onMount(async () => {
		apiKey = window.sessionStorage.getItem('vyos-apikey') || undefined;
		endpoint = window.localStorage.getItem('vyos-endpoint-url') || undefined;
	});

	async function fetchConfig(apiKey: string, endpoint: string) {
		try {
			if (apiKey && endpoint) {
				const form = new FormData();
				form.append('data', '{"op": "showConfig", "path": []}');
				form.append('key', apiKey);
				const response = await fetch(`${endpoint}/retrieve`, {
					method: 'POST',
					body: form
				});

				// Check if the request was successful (status code 2xx)
				if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`);
				}

				// Parse the response as JSON
				config.set(await response.json());
			}
		} catch (error) {
			// Handle errors
			console.error('Fetch error:', error);
		}
	}
</script>

<div class="mx-auto my-[20vh] flex w-[32rem] flex-col gap-2">
	<Card.Root>
		<Card.Header>
			<Card.Title>VyZualise</Card.Title>
			<Card.Description
				>Enter the fields below to get a visual representation of your VyOS configuration!</Card.Description
			>
		</Card.Header>
		<Card.Content>
			<form class="space-y-2" id="config">
				<Label for="endpoint">VyOS API url</Label>
				<Input
					id="endpoint"
					type="text"
					placeholder="e.g. https://192.168.1.254"
					class="w-full"
					bind:value={endpoint}
				/>
				<Label for="apiKey">VyOS API Key</Label>
				<div class="flex w-full items-center space-x-2">
					<Input id="apiKey" type="text" class="w-full" bind:value={apiKey} />
					<a
						href="https://docs.vyos.io/en/equuleus/configuration/service/https.html#example-configuration"
						target="_blank"
						class={buttonVariants({ variant: 'outline' })}
					>
						<HelpCircle class="h-5 w-5" />
					</a>
				</div>
			</form>
		</Card.Content>
		<Card.Footer>
			<Button variant="outline" class="group space-x-2" on:click={() => window.open("https://github.com/", "_blank")}>
				<Github class="size-5" /><span class="hidden group-hover:block">View on Github</span>
            </Button>
			<Button form="config" class="ml-auto space-x-2"
				><Rocket class="size-5" /><span class="font-semibold">Retrieve config</span></Button
			>
		</Card.Footer>
	</Card.Root>
	<Alert.Root>
		<CloudOff class="h-4 w-4" />
		<Alert.Title>Heads up!</Alert.Title>
		<Alert.Description
			>Everything is done from within your own browser. At no point is any information about your
			VyOS instance being sent anywhere but your own browser or the provided VyOS instance itself.</Alert.Description
		>
	</Alert.Root>
</div>

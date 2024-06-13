<script lang="ts">
	import { enhance } from '$app/forms';
	import { Alert, Button, Checkbox, Heading, Navbar, Spinner } from 'flowbite-svelte';
	import type { PageData } from './$types';
	export let data: PageData;
	let error: string | null = null;
	let population: number = 0;
	let loading: boolean = false;
</script>

<div class="container px-4">
	<Navbar>
		<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white"
			>Sök befolkning</span
		>
	</Navbar>

	<form
		class="grid gap-6 mb-6 grid-cols-2"
		method="POST"
		action="?/search"
		use:enhance={({ formElement, formData, action, cancel, submitter }) => {
			loading = true;
			// `formElement` is this `<form>` element
			// `formData` is its `FormData` object that's about to be submitted
			// `action` is the URL to which the form is posted
			// calling `cancel()` will prevent the submission
			// `submitter` is the `HTMLElement` that caused the form to be submitted
			return async ({ result, update }) => {
				loading = false;
				error = null;

				if (result.type === 'failure') {
					error = result.data.description;
				}

				population = result.data.population;

				update({
					reset: false
				});
				// `result` is an `ActionResult` object
				// `update` is a function which triggers the default logic that would be triggered if this callback wasn't set
			};
		}}
	>
		<div>
			<Heading tag="h4">Kommuner</Heading>
			<div>
				{#each data.regions as region}
					<Checkbox id={region.name} value={region.id} name="regions" type="checkbox">
						{region.name}
					</Checkbox>
				{/each}
			</div>
		</div>

		<div>
			<Heading tag="h4">Länder</Heading>

			<div>
				{#each data.countries as country}
					<Checkbox id={country.name} value={country.id} name="countries" type="checkbox">
						{country.name}
					</Checkbox>
				{/each}
			</div>
		</div>

		<div>
			<Button disabled={loading} class="w-full" type="submit" color="light">
				{#if loading}
					<Spinner color="green" />
				{:else}
					Sök
				{/if}
			</Button>
		</div>
	</form>

	{#if error}
		<Alert color="red">
			{error}
		</Alert>
	{/if}

	{#if population}
		<Alert color="green">Befolkning: {population}</Alert>
	{/if}
</div>

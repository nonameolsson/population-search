<script lang="ts">
	import { enhance } from '$app/forms';
	import { Alert, Button, Checkbox, Heading, Input, Label, Navbar, Spinner } from 'flowbite-svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let error: string | null = null;
	let population: number = 0;
	let loading: boolean = false;
	let numberOfPublishers: number = 0;
	$: publishersPerPopulation = Math.floor(population / numberOfPublishers);

	function selectAll(listName: 'regions' | 'countries') {
		const checkboxes: NodeListOf<HTMLInputElement> = document.querySelectorAll(
			`input[name="${listName}"]`
		);

		const allAreChecked = Array.from(checkboxes).every((checkbox) => checkbox.checked);
		if (allAreChecked) {
			checkboxes.forEach((checkbox) => {
				checkbox.checked = !checkbox.checked;
			});

			return;
		}

		checkboxes.forEach((checkbox) => {
			if (checkbox.checked) {
				return;
			}

			checkbox.checked = !checkbox.checked;
		});
	}
</script>

<div class="container px-4">
	<Navbar>
		<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white"
			>Sök befolkning</span
		>
	</Navbar>

	<form
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
		<div class="mb-6 grid grid-cols-2 gap-6">
			<div>
				<Heading tag="h3">Kommuner</Heading>
				<div>
					{#each data.regions as region}
						<Checkbox id={region.name} value={region.id} name="regions" type="checkbox">
							{region.name}
						</Checkbox>
					{/each}
				</div>
				<Button color="green" class="mt-4" size="sm" on:click={() => selectAll('regions')}
					>Välj alla</Button
				>
			</div>

			<div>
				<Heading tag="h3">Länder</Heading>

				<div>
					<Heading tag="h5">Spanska</Heading>
					{#each data.countries.spanish as country}
						<Checkbox id={country.name} value={country.id} name="countries" type="checkbox">
							{country.name}
						</Checkbox>
					{/each}
				</div>
				<div>
					<Heading class="mt-4" tag="h5">Portugisiska</Heading>
					{#each data.countries.portuguese as country}
						<Checkbox id={country.name} value={country.id} name="countries" type="checkbox">
							{country.name}
						</Checkbox>
					{/each}
				</div>
				<Button size="sm" class="mt-4" color="green" on:click={() => selectAll('countries')}
					>Välj alla</Button
				>
			</div>
		</div>
		<Button disabled={loading} class="mb-4 w-full" type="submit" color="light">
			{#if loading}
				<Spinner color="green" />
			{:else}
				Sök
			{/if}
		</Button>
	</form>
	<Label>Antal förkunnare</Label>
	<Input bind:value={numberOfPublishers} type="number" class="mb-4" />

	{#if error}
		<Alert color="red">
			{error}
		</Alert>
	{/if}

	{#if population}
		<Alert color="green">
			<p>Befolkning: {population}</p>
			{#if numberOfPublishers > 0}
				<p>Besök per förkunnare: {publishersPerPopulation}</p>
			{/if}
		</Alert>
	{/if}
</div>

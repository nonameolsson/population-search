<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	export let data: PageData;
	let error: string | null = null;
	let population: number = 0;
</script>

<h1>Latino Counter</h1>

{population}
<form
	method="POST"
	action="?/search"
	use:enhance={({ formElement, formData, action, cancel, submitter }) => {
		// `formElement` is this `<form>` element
		// `formData` is its `FormData` object that's about to be submitted
		// `action` is the URL to which the form is posted
		// calling `cancel()` will prevent the submission
		// `submitter` is the `HTMLElement` that caused the form to be submitted
		return async ({ result, update }) => {
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
	<fieldset>
		<legend>Kommuner</legend>
		<ul>
			{#each data.regions as region}
				<li>
					<input id={region.name} value={region.id} name="regions" type="checkbox" />
					<label for={region.name}>{region.name}</label>
				</li>
			{/each}
		</ul>
	</fieldset>

	<fieldset>
		<legend>Länder</legend>
		<ul>
			{#each data.countries as country}
				<li>
					<input id={country.name} value={country.id} name="countries" type="checkbox" />
					<label for={country.name}>{country.name}</label>
				</li>
			{/each}
		</ul>
	</fieldset>

	{#if error}
		<p>{error}</p>
	{/if}

	{#if population}
		<p>Befolkning: {population}</p>
	{/if}
	<button>Log in</button>
</form>

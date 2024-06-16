import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	const regions = [
		{ id: '1231', name: 'Burlöv' },
		{ id: '1281', name: 'Lund' },
		{ id: '1280', name: 'Malmö' },
		{ id: '1262', name: 'Lomma' },
		{ id: '1230', name: 'Staffanstorp' },
		{ id: '1263', name: 'Svedala' },
		{ id: '1233', name: 'Vellinge' },
		{ id: '1287', name: 'Trelleborg' },
		{ id: '1261', name: 'Kävlinge' }
	];

	regions.sort((a, b) => a.name.localeCompare(b.name));

	const countries = {
		spanish: [
			{ id: 'AO', name: 'Angola' },
			{ id: 'DO', name: 'Dominikanska Republiken' },
			{ id: 'GQ', name: 'Ekvatorialguinea' },
			{ id: 'CU', name: 'Kuba' },
			{ id: 'MX', name: 'Mexiko' },
			{ id: 'ES', name: 'Spanien' },
			{ id: 'AR', name: 'Argentina' },
			{ id: 'BO', name: 'Bolivia' },
			{ id: 'CL', name: 'Chile' },
			{ id: 'CO', name: 'Colombia' },
			{ id: 'CR', name: 'Costa Rica' },
			{ id: 'EC', name: 'Ecuador' },
			{ id: 'SV', name: 'El Salvador' },
			{ id: 'GT', name: 'Guatemala' },
			{ id: 'HN', name: 'Honduras' },
			{ id: 'NI', name: 'Nicaragua' },
			{ id: 'PA', name: 'Panamá' },
			{ id: 'PY', name: 'Paraguay' },
			{ id: 'PE', name: 'Perú' },
			{ id: 'UY', name: 'Uruguay' },
			{ id: 'VE', name: 'Venezuela' }
		],
		portuguese: [
			{ id: 'BR', name: 'Brasilien' },
			{ id: 'PT', name: 'Portugal' },
			{ id: 'CV', name: 'Kap Verde' }
		]
	};

	countries.spanish.sort((a, b) => a.name.localeCompare(b.name));
	countries.portuguese.sort((a, b) => a.name.localeCompare(b.name));

	return {
		regions,
		countries
	};
};

export const actions = {
	search: async ({ fetch, request }) => {
		const API_URL =
			'https://api.scb.se/OV0104/v1/doris/sv/ssd/START/BE/BE0101/BE0101E/FolkmRegFlandK';
		const data = await request.formData();
		const regions = data.getAll('regions');
		const countries = data.getAll('countries');

		if (regions.length === 0) {
			return fail(400, { description: 'Du måste välja kommun' });
		}
		if (countries.length === 0) {
			return fail(400, { description: 'Du måste välja land' });
		}

		const postData = {
			query: [
				{
					code: 'Region',
					selection: {
						filter: 'vs:RegionKommun07EjAggr',
						values: regions
					}
				},
				{
					code: 'Fodelseregion',
					selection: {
						filter: 'item',
						values: countries
					}
				},
				{
					code: 'Kon',
					selection: {
						filter: 'item',
						values: ['1+2']
					}
				},
				{
					code: 'Tid',
					selection: {
						filter: 'item',
						values: ['2023']
					}
				}
			],
			response: {
				format: 'json'
			}
		};

		const res = await fetch(API_URL, {
			method: 'POST',
			body: JSON.stringify(postData),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		const response = await res.json();

		if (!response) {
			return fail(400, { description: 'No data found' });
		}

		type Data = {
			data: InnerData[];
		};

		type InnerData = {
			key: string[];
			values: string[];
		};

		const formattedData: Data = response;

		const populationCount = formattedData.data.reduce((acc, item) => {
			if (item.values[0] !== '..') {
				acc += parseInt(item.values[0]);
			}

			return acc;
		}, 0);

		return { population: populationCount };
	}
} satisfies Actions;

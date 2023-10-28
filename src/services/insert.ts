import puppeteer from '@cloudflare/puppeteer';
import { Bindings, MealPlan } from '../type';

const insert = async (env: Bindings) => {
	const { KV, URL, BW } = env;
	try {
		const browser = await puppeteer.launch(BW);
		const page = await browser.newPage();
		await page.goto(URL);

		const selector = '#tab-ogle > div > div';
		await page.waitForSelector(selector);

		const element = await page.$$(selector);
		// const text = await page.evaluate((el) => el.textContent, element[0]);

		const arr: any = [];
		for (let el of element) {
			const text = await page.evaluate((el) => el.textContent, el);

			const obj: MealPlan = {
				day: '',
				meals: {
					'Ana Yemek': '',
					'Yan Yemek': '',
					Çorba: '',
					Aperatif: '',
					Kalori: '',
				},
			};
			const entities: Array<string> = [];

			text.split('\n').map((item: string) => {
				const valid = item.replace(/\s/g, '');
				if (item !== '' && valid !== '""' && valid !== '') {
					item = item.replace('\t', '');
					item = item.replace(/^\s+|\s+$/g, '');
					entities.push(item);
				}
			});

			if (entities.length === 7) obj.meals.Ekstra = entities[5];
			obj.day = entities[0];
			obj.meals.Çorba = entities[1];
			obj.meals['Ana Yemek'] = entities[2];
			obj.meals['Yan Yemek'] = entities[3];
			obj.meals.Aperatif = entities[4];
			obj.meals.Kalori = entities[entities.length - 1];

			arr.push(obj);
		}

		arr.map(async (item: MealPlan) => await KV.put(item.day, JSON.stringify(item.meals)));
		const month = new Date().getMonth() + 1;
		const year = new Date().getFullYear();
		const monthYear = `${month}-${year}`;
		await KV.put(monthYear, JSON.stringify(arr));

		console.log('inserted');
		return arr;
	} catch (error: any) {
		return error.message;
	}
};

export default insert;

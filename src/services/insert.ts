import puppeteer from '@cloudflare/puppeteer';
import { Bindings, MealPlan } from '../type';

/* const insert = async (env: Bindings) => {
	const { KV, URL, BW } = env;
	try {
		console.log('insert');
		const browser = await puppeteer.launch(BW);
		const page = await browser.newPage();
		const url = 'https://iuc.edu.tr/';

		await page.goto(url);
		console.log('goto');
		const selector = '#tab-ogle > div > div';
		await page.waitForSelector(selector);
		console.log('wait');
		const element = await page.$$(selector);
		// const text = await page.evaluate((el) => el.textContent, element[0]);
		console.log('evaluate', element.length);
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
}; */
type MenuItem = {
	tarih: string;
	menu: string;
	kalori: string;
};

type MenuData = {
	form: Array<{ type: string; title: string; items: any[] }>;
	schema: {
		type: string;
		properties: {
			kahvalti: object;
			ogle: object;
			aksam: object;
			kumanya: object;
			diyet: object;
			vegan: object;
			cocuk: object;
		};
	};
	kahvalti: Array<{}>;
	ogle: MenuItem[];
	aksam: MenuItem[];
	kumanya: Array<{}>;
	diyet: Array<{}>;
	vegan: Array<{}>;
	cocuk: Array<{}>;
};

const insert = async (env: Bindings) => {
	try {
		const { KV } = env;
		const url =
			'https://service-cms.iuc.edu.tr/api/webclient/f_getData?siteKey=C9C078A3C4214BBE91E6014335636C3B&EID=4E00590053005F006D004C00500035005500720059003100';
		const res = await fetch(url);
		const parsed = (await res.json()) as { Data: string };
		const stringData = parsed.Data;
		const jsonData = JSON.parse(stringData);

		const typedJsonData = jsonData as MenuData;
		console.log(typedJsonData);
		const arr = typedJsonData.ogle.map((item) => {
			const meals = item.menu.split('\t\n');
			return {
				day: item.tarih,
				'Ana Yemek': meals[1],
				'Yan Yemek': meals[2],
				Çorba: meals[0],
				Aperatif: meals[3] || '',
				Kalori: item.kalori,
			};
		});

		arr.map(async (item) => await KV.put(item.day, JSON.stringify(item)));
		const month = new Date().getMonth() + 1;
		const year = new Date().getFullYear();
		const monthYear = `${month}-${year}`;
		await KV.put(monthYear, JSON.stringify(arr));

		console.log('inserted');
		return arr;
	} catch (error) {
		console.log(error);
	}
};

export default insert;

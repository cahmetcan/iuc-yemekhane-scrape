export type MealPlan = {
	day: string;
	meals: {
		[key: string]: string;
		Çorba: string;
		'Ana Yemek': string;
		'Yan Yemek': string;
		Aperatif: string;
		Ekstra?: any;
		Kalori: string;
	};
};

export type Bindings = {
	BW: any;
	KV: KVNamespace;
	URL: string;
};

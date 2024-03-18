import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { Bindings } from '../type';

const app = new Hono<{ Bindings: Bindings }>();

app.use("/", cors());
app.get('/', async (c) => {
	const { KV } = c.env;
	const month = new Date().getMonth() + 1;
	const year = new Date().getFullYear();
	const monthYear = `${month}-${year}`;
	const data = await KV.get(monthYear, 'json');

	if (data === null) {
		return c.json({
			status: 200,
			message: 'This month there is no meal',
		});
	}

	return c.json(data);
});

app.get('/today', async (c) => {
	const { KV } = c.env;
	const date = new Date().toLocaleDateString('en-GB').replaceAll('/', '.');

	const data = await KV.get(date, 'json');
	if (data === null) {
		return c.json({
			status: 200,
			day: date,
			message: 'Today there is no meal',
		});
	}

	return c.json({
		status: 200,
		day: date,
		meal: data,
	});
});

app.get('/:date', async (c) => {
	const date = c.req.param('date');
	const { KV } = c.env;

	const data = await KV.get(date, 'json');
	if (data === null) {
		return c.json({
			status: 200,
			message: 'Today there is no meal',
		});
	}

	return c.json(data);
});

export default app;

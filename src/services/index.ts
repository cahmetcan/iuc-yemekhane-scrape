import { Hono } from 'hono';
import { Bindings } from '../type';

const app = new Hono<{ Bindings: Bindings }>();

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

	return c.json(data)
});

export default app;

import { Hono } from 'hono';
import { Bindings } from './type';
import get from './services';
import insert from './services/insert';

const app = new Hono<{ Bindings: Bindings }>();

app.get('/insert', async (c) => {
	const result = await insert(c.env);
	if (result instanceof Error || result === null) {
		return c.json({
			status: 500,
			message: 'Error inserting data',
			error: result,
		});
	}

	return c.json({
		status: 200,
		message: 'Inserting data',
		data: result,
	});
});

app.route('/', get);

export default app;

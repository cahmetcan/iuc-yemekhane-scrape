import insert from './src/services/insert';
import app from './src/worker';

export interface Env {
	KV: KVNamespace;
	BW: Fetcher;
	URL: string;
}

export default {
	async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
        console.log('scheduled');
		const result = await insert(env);
		console.log(await result);
	},

	async fetch(request: Request, env: any) {
		return await app.fetch(request, env);
	},
};

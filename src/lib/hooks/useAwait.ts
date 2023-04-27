import type { Result } from '$lib/types';

export default async function useAwait<T, E = unknown>(
	fn: () => Promise<T>
): Promise<Result<T, E>> {
	try {
		return { failed: false, data: await fn() };
	} catch (error) {
		return { failed: true, error: error as E };
	}
}

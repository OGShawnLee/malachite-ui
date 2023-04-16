export default function useCatch<T, E = unknown>(fn: () => T): Result<T, E> {
	try {
		return { failed: false, data: fn() };
	} catch (error) {
		return { failed: true, error: error as E };
	}
}

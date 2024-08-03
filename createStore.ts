type SetterSelectorFn<T extends Record<PropertyKey, unknown>> = (
	prevState: T,
) => Partial<T>;

type SetterFn<
	T extends Record<PropertyKey, unknown> = Record<PropertyKey, unknown>,
> = (partialState: Partial<T> | SetterSelectorFn<T>) => void;

const createStore = <
	T extends Record<PropertyKey, unknown> = Record<PropertyKey, unknown>,
>(
	initState: (setState: SetterFn<T>) => T,
) => {
	let state: T;

	const listeners: Set<() => void> = new Set();

	const notifyListeners = () => {
		for (const listener of listeners) {
			listener();
		}
	};

	const subscribe = (listener: () => void) => {
		listeners.add(listener);

		return () => {
			listeners.delete(listener);
		};
	};

	const setState = (partialState: Partial<T> | SetterSelectorFn<T>) => {
		const newValue =
			typeof partialState === "function" ? partialState(state) : partialState;

		state = state
			? {
					...state,
					...newValue,
				}
			: ({ ...structuredClone(newValue) } as T);

		notifyListeners();
	};

	state = initState(setState);

	return {
		setState,
		subscribe,
	};
};

export { createStore };

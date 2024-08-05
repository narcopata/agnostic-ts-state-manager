type SetterSelectorFn<T extends Record<PropertyKey, unknown>> = (
	prevState: T,
) => Partial<T>;

type SetterFn<
	T extends Record<PropertyKey, unknown> = Record<PropertyKey, unknown>,
> = (partialState: Partial<T> | SetterSelectorFn<T>) => void;

class Store<
	T extends Record<PropertyKey, unknown> = Record<PropertyKey, unknown>,
> {
	#state: T;
	#listeners: Set<() => void>;

	get state() {
		return this.#state;
	}

	constructor(initState: (setState: SetterFn<T>) => T) {
		this.#state = initState(this.setState);
		this.#listeners = new Set();
	}

	#notifyListeners = () => {
		for (const listener of this.#listeners) {
			listener();
		}
	};

	public subscribe = (listener: () => void): (() => void) => {
		this.#listeners.add(listener);

		return () => {
			this.#listeners.delete(listener);
		};
	};

	public setState = (partialState: Partial<T> | SetterSelectorFn<T>) => {
		const stateDataToAssign =
			typeof partialState === "function"
				? partialState(this.#state)
				: partialState;

		this.#state = {
			...(this.#state ?? {}),
			...stateDataToAssign,
		};

		this.#notifyListeners();
	};
}

export { Store };

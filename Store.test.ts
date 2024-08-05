import { test, expect, describe, spyOn } from "bun:test";
import { Store } from "./createStore";

describe("store", () => {
	test("should create store", () => {
		const store = new Store((set) => ({
			count: 1,
			// increment: () => set
		}));

		expect(store).toBeDefined();
		expect(store.state.count).toEqual(1);
	});

	test("should set store state", () => {
		const store = new Store(() => ({
			count: 1,
		}));

		store.setState((prev) => {
			return {
				count: prev.count + 1,
			};
		});

		expect(store.state.count).toEqual(2);
	});

	test("should update store state", () => {
		const store = new Store(() => ({
			count: 1,
		}));

		store.setState({
			count: 2,
		});

		expect(store.state.count).toEqual(2);
	});

	test("should subscribe to a store and be notified when store changes", () => {
		const store = new Store<{ count: number; increment: () => void }>(
			(set) => ({
				count: 0,
				increment: () =>
					set((previousState) => ({
						count: (previousState as { count: number }).count + 1,
					})),
			}),
		);

		const objWithListener = {
			listener: () => {},
		};

		const spyOnListener = spyOn(objWithListener, "listener");

		store.subscribe(objWithListener.listener);

		store.state.increment();

		expect(spyOnListener).toHaveBeenCalled();
	});

	test("should subscribe to a store, then unsubscribe to it and not be notified when store changes", () => {
		const store = new Store<{ count: number; increment: () => void }>(
			(set) => ({
				count: 0,
				increment: () =>
					set((previousState) => ({
						count: (previousState as { count: number }).count + 1,
					})),
			}),
		);

		const objWithListener = {
			listener: () => {},
		};

		const spyOnListener = spyOn(objWithListener, "listener");

		const unsubscribe = store.subscribe(objWithListener.listener);

		store.state.increment();

		expect(spyOnListener).toHaveBeenCalled();

		unsubscribe();

		store.state.increment();

		expect(spyOnListener).toHaveBeenCalledTimes(1);
	});
});

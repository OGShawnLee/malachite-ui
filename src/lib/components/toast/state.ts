import type { ToastObject, ToastStore } from "$lib/types";
import { writable } from "svelte/store"
import { nanoid } from "nanoid";
import { useComponentNaming, useWindowListener } from "$lib/hooks";
import { defineActionComponent } from "$lib/core";
import { useContext } from '$lib/hooks';
import { isFunction } from '$lib/predicate';

type Context = ToastStore["createToast"];

const { getContext, setContext } = useContext({
    component: 'toast-group',
    predicate: (context): context is Context => isFunction(context)
});

export { getContext }

export function createToastGroupState(toast: ToastStore) {
    const baseName = useComponentNaming("toast").baseName;

    setContext(toast.createToast);

    return function (id: string | undefined) {
        return defineActionComponent({
            id: id,
            name: baseName,
            onMount: () => useWindowListener("keydown", (event) => {
                if (event.ctrlKey && event.altKey && event.key === "k") {
                    toast.clear();
                }
            })
        })
    }
}


export function useToast<T extends ToastObject = ToastObject>(
    delay = 3_000,
    className?: { [K in ToastObject["type"]]?: string }
): ToastStore<T> {
    const queue = writable<T[]>([]);

    function clear() {
        queue.set([]);
    }

    function createToast(id: ToastObject["id"]) {
        function mount() {
            const timeout = setTimeout(() => remove(id), delay);
            return {
                destroy() {
                    clearTimeout(timeout);
                }
            };
        }

        function close() {
            remove(id);
        }

        return { mount, close };
    }

    function push(this: void, toast: Omit<T, "id">) {
        queue.update((items) => {
            items.push({ ...toast, id: nanoid(8) } as T);
            return items;
        });
    }

    function remove(id: ToastObject["id"]) {
        queue.update((items) => {
            return items.filter((item) => item.id !== id);
        });
    }

    return {
        subscribe: queue.subscribe, clear, push, createToast,
        getToastTypeClassName: useToastTypeClassNameResolver(className)
    };
}

export function useToastTypeClassNameResolver(
    className?: { [K in ToastObject["type"]]?: string }
) {
    return function (type: ToastObject["type"]) {
        if (!className) return "";
        switch (type) {
            case "error":
                return className?.error ?? "";
            case "info":
                return className?.info ?? "";
            case "success":
                return className?.success ?? "";
            case "warning":
                return className?.warning ?? "";
        }
    }
}
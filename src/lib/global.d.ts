type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

type ExtractContext<C, K extends keyof C> = OmitAllThisParameter<Pick<C, K>>;

type Nullable<T> = T | null | undefined;

type RenderElementTagName = keyof HTMLElementTagNameMap | 'slot';

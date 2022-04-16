type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

type ExtractContext<C, K extends keyof C> = OmitAllThisParameter<Pick<C, K>>;

type Nullable<T> = T | null | undefined;

type OmitAllThisParameter<T> = {
	[P in keyof T]: OmitThisParameter<T[P]>;
};

type RenderElementTagName = keyof HTMLElementTagNameMap | 'slot';

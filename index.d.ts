// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any;
type ICustomElement = {
  [prop: string]: Any;
  __initialized?: boolean;
  __released: boolean;
  __releaseCallbacks: Any[];
  __propertyChangedCallbacks: Any[];
  __updating: Record<string, Any>;
  props: Record<string, Any>;
  lookupProp(attrName: string): string | undefined;
  renderRoot: Element | Document | ShadowRoot | DocumentFragment;
  addReleaseCallback(fn: () => void): void;
  addPropertyChangedCallback(fn: (name: string, value: Any) => void): void;
};
type IEvent<T> = (e: CustomEvent<T>) => void;
type ICustomEvent<T, K extends keyof T> = T extends {
  [key in K]?: (v: infer V) => void;
}
  ? IEvent<V>
  : T extends { [key in K]?: (...args: infer Args) => void }
  ? IEvent<Args>
  : never;
type IOmit<T, Keys extends keyof T> = Omit<T, Keys> & {
  [K in Keys]?: ICustomEvent<T, K>;
};
export type StripOn<T> = T extends `on${infer R}` ? Lowercase<R> : never;
// 利用映射类型来获取对应的事件处理函数类型
type AddEventMethods<T> = {
  [K in keyof T as StripOn<K>]: IOmit<T, K>[K];
};
export type CustomElement<
  T extends Partial<ICustomElement> = ICustomElement,
  E extends keyof T = "onChange"
> = IOmit<T, E> & {
  ref?: CustomElement<T, E> | { current: CustomElement<T, E> | null };
  shadowRoot?: ShadowRoot | Element | null;
  offsetWidth?: number;
  part?: string;
  tabindex?: string | number;
  tabIndex?: string | number;
  children?: any;
  style?: any;
  classList?: any;
} & {
  onMouseDown?(this: GlobalEventHandlers, ev: MouseEvent): any;
  onMousMove?(this: GlobalEventHandlers, ev: MouseEvent): any;
  onMouseUp?(this: GlobalEventHandlers, ev: MouseEvent): any;
  onKeyDown?(this: GlobalEventHandlers, ev: KeyboardEvent): any;
  onKeyUp?(this: GlobalEventHandlers, ev: KeyboardEvent): any;
  onFocus?(this: GlobalEventHandlers, ev: FocusEvent): any;
  onBlur?(this: GlobalEventHandlers, ev: FocusEvent): any;
  onClick?(this: GlobalEventHandlers, ev: MouseEvent): any;
  onDblClick?(this: GlobalEventHandlers, ev: MouseEvent): any;
  appendChild?<T extends Node>(node: T): T;
  replaceChild?<T extends Node>(node: Node, child: T): T;
  replaceChildren?(...nodes: (Node | string)[]): void;
  replaceWith?(...nodes: (Node | string)[]): void;
  remove?(): void;
  addEventListener?<K extends keyof AddEventMethods<T>>(
    name: K,
    callback: AddEventMethods<T>[K]
  ): void;
  removeEventListener?<K extends keyof AddEventMethods<T>>(
    name: K,
    callback: AddEventMethods<T>[K]
  ): void;
  setAttribute?(qualifiedName: string, value: string): void;
  removeAttribute?(qualifiedName: string): void;
};
export type Hyphenate<T> = T extends `${infer First}${infer Rest}`
  ? Rest extends Uncapitalize<Rest>
    ? `${Lowercase<First>}${Hyphenate<Rest>}`
    : `${Lowercase<First>}-${Hyphenate<Rest>}`
  : T;
type TransformKeys<T> = {
  [K in keyof T as T[K] extends
    | symbol
    | string
    | number
    | boolean
    | undefined
    | null
    ? Hyphenate<K>
    : K]: T[K];
};
export type Transform<T> = {
  [K in keyof T]: TransformKeys<T[K]>;
};

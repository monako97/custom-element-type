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
  onMouseDown: HTMLElement['onmousedown'];
  onMousMove: HTMLElement['onmousemove'];
  onMouseUp: HTMLElement['onmouseup'];
  onKeyDown: HTMLElement['onkeydown'];
  onKeyUp: HTMLElement['onkeyup'];
  onFocus: HTMLElement['onfocus'];
  onBlur: HTMLElement['onblur'];
  onClick: HTMLElement['onclick'];
  onDblClick: HTMLElement['ondblclick'];
  appendChild: HTMLElement['appendChild'];
  replaceChild: HTMLElement['replaceChild'];
  replaceChildren: HTMLElement['replaceChildren'];
  replaceWith: HTMLElement['replaceWith'];
  remove: HTMLElement['remove'];
  addEventListener?<K extends keyof AddEventMethods<T>>(
    name: K,
    callback: AddEventMethods<T>[K]
  ): void;
  removeEventListener?<K extends keyof AddEventMethods<T>>(
    name: K,
    callback: AddEventMethods<T>[K]
  ): void;
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

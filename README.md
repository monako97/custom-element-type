# custom-element-type
将Props转换成web component对应的Props,开发时输出正确的类型提示

## 简单的示例

```tsx
import { customElement } from 'solid-element';
import type { CustomElement, Transform } from 'custom-element-type';

interface InputProps {
  onChange?(val: string): void;
  onInput?(val: string): void;
  value?: string;
  defaultValue?: string;
}

export function Input(props: InputProps) {
  return (
    <input
      onChange={(e) => props.onChange?.(e.target.value)}
      onInput={(e) => props.onInput?.(e.target.value)}
    />
  );
}

// 注册 web components
customElement(
  'n-input',
  {
    value: void 0,
    defaultValue: void 0,
  },
  (_, opt) => {
    const el = opt.element;

    return (
      <Input
        {..._}
        onChange={(val: string) => {
          // 派发事件
          el.dispatchEvent(
            new CustomEvent('change', {
              detail: val,
            }),
          );
        }}
        onInput={(val: string) => {
          // 派发事件
          el.dispatchEvent(
            new CustomEvent('input', {
              detail: val,
            }),
          );
        }}
      />
    );
  },
);

/**
 * 生成 jsx 属性语法类型提示
 * @param {T} props 原始props
 * @param {E} events 原始类型中需要转换成自定义函数的属性
 * 转换后的 InputElement 为
 * @example
 * {
 *     onChange?(val: CustomEvent<string>): void;
 *     onInput?(val: CustomEvent<string>): void;
 *     value?: string;
 *     defaultValue?: string;
 * }
 */
type InputElement = CustomElement<InputProps, 'onChange' | 'onInput'>;

/**
 * 注册自定义组件列表
 * @author monako97
 * @ignore optional
 */
interface CustomElementTags {
  /** 输入框 */
  'n-input': InputElement;
}

/**
 * 生成 html 标签属性语法类型提示
 * 在写 html 标签时将生成如下提示
 * @example
 * ```html
 * <n-input value="string" default-value="string"></n-input>
 * ```
 */
type MyElements = Transform<CustomElementTags>;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  export namespace JSX {
    export interface IntrinsicElements extends MyElements {}
  }
  interface HTMLElementTagNameMap extends MyElements {}
}
```

# printScreen

### Motivation

- create zero dep util to make printscreen of DOM elements.

### Signature

```typescript
async function printScreen(
  src: string | HTMLElement,
  params: PrintScreenParamsT
): Promise<string>;
```

```typescript
type PrintScreenParamsT = {
  scale?: number;
  fonts?: FontCfg[];
  underlayStyle?: string;
  fontFaceTemplate: FontFaceTemplate;
};
```

- `scale` is multiplyer for original image width and height
- `fonts` is config for fonts added by `<link />`

```typescript
export type FontCfg<T = unknown> = {
  uri: string;
  format: string;
  name: string;
  options?: T;
};
```

- `underlayStyle` is raw string for css. like `background-color: black;` This needed when you printscreen the element whithout background. So with this prop you can provide style for parent div.
- `fontFaceTemplate` is template function for attaching fonts listed in `fonts` by default it looks like:

```typescript
function createFontFace(fontCfg: FontCfg) {
  const { name, format, uri } = fontCfg;
  return `
        @font-face {
          font-family: "${name}";
          src: url(${uri}) format("${format}");
          font-weight: normal;
          font-style: normal;
        }
      `;
}
```

### Usage

- `npm install @builat/printscreen`

```tsx
import logo from "./logo.svg";
import "./App.css";
import { printScreen } from "@builat/printscreen";

function appendImg(src) {
  const img = document.createElement("img");
  img.src = src;
  document.getElementById("root").appendChild(img);
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <button onClick={() => printScreen("#root").then(appendImg)}>
          print screen
        </button>
      </header>
    </div>
  );
}

export default App;
```

## Ok I want to convert function output to binary image. How?

```typescript
const imageWithPrefix = await printScreen("#root");
const [prefix, base64Image] = Buffer.from(imageWithPrefix, "utf-8")
  .toString("utf-8")
  .split(",");
const binaryImage = Buffer.from(base64Image, "base64");
```

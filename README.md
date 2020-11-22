# printScreen

### Motivation

- create zero dep util to make printscreen of DOM elements.

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

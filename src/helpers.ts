import { FontCfg, FontFaceTemplate, SvgDementions } from "./types";

function fontPromiseCreator(fontCfg: FontCfg): Promise<FontCfg> {
  const { uri, ...rest } = fontCfg;
  return new Promise((resolve, reject) =>
    fetch(uri)
      .then((rawResponse) => rawResponse.blob())
      .then((blobedResponse) => {
        const reader = new FileReader();
        reader.onload = (event: Event) => {
          if (event && reader.result) {
            resolve({ uri: reader.result as string, ...rest });
          } else {
            reject("Can't load one or more fonts");
          }
        };
        return reader.readAsDataURL(blobedResponse);
      })
  );
}

export function validHTMLfromString(rawString: string): string {
  return new XMLSerializer().serializeToString(
    new DOMParser().parseFromString(rawString, "text/html")
  );
}

export async function getFontBlobs(
  fonts: FontCfg[],
  fontFaceTemplate: FontFaceTemplate
) {
  return (await Promise.all<FontCfg>(fonts.map(fontPromiseCreator)))
    .map(fontFaceTemplate)
    .join("");
}

export function extractCSS() {
  const styleValues: IterableIterator<HTMLStyleElement> = document
    .querySelectorAll("style")
    .values();

  return Array.from(styleValues)
    .map((style) => style.innerHTML)
    .join("");
}

export function createFontFace(fontCfg: FontCfg) {
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

export function getSVGString(
  { width, height }: SvgDementions,
  fonts: string,
  html: string,
  style = ""
) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
              <foreignObject width="100%" height="100%">
                <div xmlns="http://www.w3.org/1999/xhtml" style="${style}">
                  <style>
                    ${fonts}
                    ${extractCSS()}
                  </style>
                  ${html}
                </div>
              </foreignObject>
              </svg>`;
}

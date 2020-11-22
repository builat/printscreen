/**
 * @param screenTarget could be or `id` of element or Element it self even react `ref.current`
 * @param params this is configurational object
 * @returns promise with base64 encoded image or undefined in case element not found
 *
 * @example await printScreen("#root")
 * @example await printScreeen(".anotherQuerySelector")
 * @example await printScreen(document.querySelector("#root"))
 * @example await printScreen(reactRef.current)
 */

import { PrintScreenParamsT } from "./types";

import {
  createFontFace,
  validHTMLfromString,
  getFontBlobs,
  injectImageBlobs,
  finalSvgString,
} from "./helpers";
import { DATA_IMAGE, IMAGE_JPEG } from "./constants";

const staticPrintscreenParams = {
  scale: 1,
  underlayStyle: "",
  fonts: [],
  fontFaceTemplate: createFontFace,
};
export async function printScreen(
  src: string | HTMLElement,
  params: PrintScreenParamsT = staticPrintscreenParams
): Promise<string> {
  const element: HTMLElement | null =
    typeof src === "string" ? document.querySelector(src) : src;
  const {
    scale = 1,
    underlayStyle = "",
    fonts = [],
    fontFaceTemplate = createFontFace,
  } = params;
  if (!element) {
    throw new Error("No element found");
  }
  const { offsetWidth, offsetHeight } = element;

  /* 
    We using `foreignObject` approach, so no external links
    only blobed things could be used inside
   */
  const blobedFonts = await getFontBlobs(fonts, fontFaceTemplate);
  const htmlWithInlinedImages = await injectImageBlobs(element);
  const domAsSVGString = finalSvgString(
    { width: offsetWidth * scale, height: offsetHeight * scale },
    blobedFonts,
    validHTMLfromString(htmlWithInlinedImages),
    underlayStyle
  );

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = offsetWidth;
  canvas.height = offsetHeight;

  const tempImg = document.createElement("img");

  tempImg.src = `${DATA_IMAGE}, ${encodeURIComponent(domAsSVGString)}`;

  return new Promise((resolve) => {
    tempImg.onload = (e: Event) => {
      if (ctx && e.target) {
        ctx.drawImage(e.target as CanvasImageSource, 0, 0);
        resolve(
          canvas.toDataURL(IMAGE_JPEG).replace(IMAGE_JPEG, "image/octet-stream")
        );
        // Cleanup memory to make job of GC a little bit easy
        tempImg.remove();
        canvas.remove();
      }
    };
  });
}

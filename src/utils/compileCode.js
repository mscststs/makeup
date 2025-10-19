import init, { transform } from "@swc/wasm-web";

import url from "@swc/wasm-web/wasm_bg.wasm?url";

async function  initSwc() {
await init(url);

}

let initSwcPromise = null;

const initializeSwc = async () => {
  if (!initSwcPromise) {
    initSwcPromise = initSwc();
  }
  await initSwcPromise;
};

export async function compileCode(code) {
  await initializeSwc();

  const transformedCode = await transform(code, {
    "jsc": {
      "parser": {
        "syntax": "typescript",
        "tsx": true
      },
      "target": "es2020",
      "loose": false,
      "minify": {
        "compress": false,
        "mangle": false
      },
      "experimental": {
        "emitIsolatedDts": false
      }
    },
    sourceMaps:"inline",
    "module": {
      "type": "es6"
    },
    "minify": false,
    "isModule": "unknown"
  });

  return transformedCode.code;
}

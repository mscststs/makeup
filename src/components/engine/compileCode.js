import init, { transform } from "@swc/wasm-web";
import url from "@swc/wasm-web/wasm_bg.wasm?url";

async function initSwc() {
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
    jsc: {
      parser: {
        syntax: "typescript",
        tsx: true,
      },
      target: "es2022",
      loose: false,
      minify: {
        compress: false,
        mangle: false,
      },
      experimental: {
        emitIsolatedDts: false,
      },
    },
    sourceMaps: "inline",
    module: {
      type: "commonjs",
    },
    minify: false,
    isModule: true,
  });

  return transformedCode.code;
}

function adaptEsmToCjs(esModule) {
  // 如果已经是CommonJS模块，直接返回
  if (esModule?.__esModule) {
    return esModule;
  }

  // 创建CommonJS兼容的模块对象
  const cjsModule = {
    __esModule: true,
    default: esModule,
    ...esModule,
  };

  // 处理类和构造函数的特殊情况
  if (typeof esModule === "function") {
    Object.setPrototypeOf(cjsModule, esModule.prototype);
    cjsModule.prototype.constructor = cjsModule;
  }

  return cjsModule;
}

export async function runTransformedCode(transformedCode, globals = {}) {
  const module = { exports: {} };
  const exports = module.exports;

  function require(moduleId) {
    const globalMap = {
      ...globals,
    };

    // 处理默认导出
    const globalValue = globalMap[moduleId];
    if (globalValue !== undefined) {
      // 处理 ES6 Module 转换为 Commonjs
      return adaptEsmToCjs(globalValue);
    }
    throw new Error(`Module not found: ${moduleId}`);
  }

  try {
    const execute = new Function(
      "require",
      "module",
      "exports",
      transformedCode,
    );
    execute(require, module, exports);
  } catch (error) {
    console.error("Error running transformed code:", transformedCode, error);
    throw error;
  }

  return module.exports;
}

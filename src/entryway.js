import * as Clsx from "clsx";
import * as lodash from "lodash";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import * as ReactRouterDom from "react-router-dom";

/**
 * 将模块挂载到 window，自动处理“有/无默认导出”的情况
 * 确保挂载后：
 * - 具名导出可通过 window[moduleName].xxx 访问
 * - 若原模块有默认导出，可通过 window[moduleName].default 访问
 * - 若原模块无默认导出，window[moduleName].default 为 undefined（避免报错）
 * @param {string} moduleName - 挂载到 window 的属性名（如 'react'）
 * @param {object} module - 导入的模块（可能包含 default 或仅具名导出）
 */
function mountModuleToWindow(moduleName, module) {
  if (window[moduleName]) {
    console.warn(`window.${moduleName} 已存在，将被覆盖`);
  }

  // 1. 处理具名导出：复制模块的所有自有属性（排除原型链属性）
  const moduleExports = {};
  Object.keys(module).forEach((key) => {
    moduleExports[key] = module[key];
  });

  // 2. 处理默认导出：明确赋值（无论是否存在）
  // 若模块本身是默认导出（如某些 UMD 模块），则手动添加 default 属性
  if (module.default === undefined) {
    // 特殊情况：如果模块本身就是默认导出（非 ES 模块格式），比如 React 的 UMD 包
    // 此时 module 就是默认导出对象，需要手动将其作为 default
    if (typeof module === "object" && !Object.hasOwn(module, "default")) {
      moduleExports.default = module;
    } else {
      // 确实无默认导出，显式赋值为 undefined
      moduleExports.default = undefined;
    }
  } else {
    // 存在默认导出，直接挂载
    moduleExports.default = module.default;
  }

  window[moduleName] = moduleExports;
  // console.log(`模块 ${moduleName} 已挂载到 window（包含 default: ${moduleExports.default !== undefined}）`);
}

mountModuleToWindow("React", React);
mountModuleToWindow("ReactDOM", ReactDOM);
mountModuleToWindow("ReactRouterDom", ReactRouterDom);
mountModuleToWindow("Clsx", Clsx);
mountModuleToWindow("lodash", lodash);

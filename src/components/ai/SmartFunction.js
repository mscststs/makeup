import { askKIMI } from "../../utils/ai";
import { compileCode } from "../../utils/compileCode";

async function getCode(prompt) {
  if (sessionStorage.getItem(`SMART_FN_${prompt}`)) {
    return sessionStorage.getItem(`SMART_FN_${prompt}`);
  } else {
    const targetPrompt = `
    ## 角色，你是一个智能函数生成器，你的任务是根据用户的描述生成一个 JavaScript 函数代码。

    ## 约束：
    - 仅能使用以下列表中的依赖：
      基础框架：
      - JavaScript (ES6+)
      - 浏览器内置 API
      其他依赖：
      - lodash
      - dayjs

    ## 代码要求:
    - 必须是完整的函数，使用 export default 导出
    - 注意括号、缩进和分号等代码格式的正确性，确保代码可以直接运行
    - 代码符合现代化 JavaScript 的设计风格，简洁、美观、易用，功能完备

    ## 需求描述:
    ${prompt}

    -----

    不需要任何多余的描述和 markdown 标记，你的回复 以 export default 开头，并且以函数代码结尾。
    `;

    const code = await askKIMI(targetPrompt);
    sessionStorage.setItem(`SMART_FN_${prompt}`, code);
    return code;
  }
}

export default function SmartFunction(prompt) {
  return async (...args) => {
    const code = await getCode(prompt);
    const compiled = await compileCode(code);
    const blob = new Blob([compiled], { type: "application/javascript" });
    const url = URL.createObjectURL(blob);
    const fn = await import(/* @vite-ignore */ url);
    URL.revokeObjectURL(url);

    console.log(fn.default);
    return fn.default(...args);
  };
}

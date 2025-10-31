import React from "react";
import { askKIMI } from "../../utils/ai.js";
import CodeRender from "../engine/CodeRender.jsx";

export default function SmartRender({ prompt, ...args }) {
  const [code, setCode] = React.useState("");

  React.useEffect(() => {
    let cancelled = false;
    async function fetchCode() {
      // 同一个 prompt 不重复请求，使用 sessionStorage 保存
      const cachedCode = sessionStorage.getItem(`SMART_${prompt}`);
      if (cachedCode) {
        setCode(cachedCode);
        return;
      }

      const targetPrompt = `

      ## 角色，你正在一个低代码页面中，你的任务是根据用户的描述生成一个 React 组件代码。

      ## 约束：
      - 仅能使用以下列表中的依赖：
        基础框架：
        - react
        - react-router-dom
        - Tailwind CSS
        其他依赖：
        - clsx
        - lodash
        
      - 禁止在组件内添加使用说明和描述。

      ## 代码要求:
      - 优先采用浅色主题，文案使用中文
      - 必须是完整的函数式组件，使用 export default 导出
      - 注意括号、缩进和分号等代码格式的正确性，确保代码可以直接运行
      - 代码符合现代化 Web 页面的设计风格，简洁、美观、易用，功能完备
      - 适应响应式需求，内容区域跟随容器宽度和尺寸，始终注意边距和溢出问题

      ## 需求描述:
      ${prompt}

      -----

      ## Props 说明:
      
      该组件需要接收以下 props，以下列出参数和对应的类型:
      ${Object.entries(args)
        .map(([key, value]) => `- ${key}: ${typeof value}`)
        .join("\n")}

      除此之外，组件始终接受 className 和 style 这两个可能为空的 props。

      -----

      不需要任何多余的描述和 markdown 标记，你的回复 以 import React from 'react' 开头，并且以组件代码结尾。
      `;

      // 触发前，先把组件代码置空，显示加载中
      setCode("");
      const code = await askKIMI(targetPrompt);

      if (!cancelled) {
        sessionStorage.setItem(`SMART_${prompt}`, code);
        setCode(code);
      }
    }

    fetchCode();

    return () => {
      cancelled = true;
    };
  }, [prompt]);

  return (
    <>
      {code ? <CodeRender code={code} args={args} /> : <div>AI 构思中...</div>}
    </>
  );
}

import { useMemo } from "react";
import { toYAML } from "../../utils/yaml";
import { useRuntime } from "./Context";
import PromptRender from "./PromptRender";

const ComponentRender = ({
  /**
   * 页面名称
   */
  path,
}) => {
  const { getTheme, getPageNode, getCode } = useRuntime();

  const pageNode = getPageNode(path);

  const parentPrompt = useMemo(() => {
    const parentPath = path.split("/").slice(0, -1).join("/");
    const parentCode = getCode(parentPath);

    return `

## 父组件:
你可以参考父组件代码，以更好地实现你的功能

${parentCode}
`;
  }, [path]);

  const childrensPrompt = useMemo(() => {
    if (!pageNode.childrens || pageNode.childrens.length === 0) return ``;
    return `
## 子组件:

根据架构划分，你的其他功能交给以下子组件来实现：
${toYAML(pageNode.childrens || [])}

渲染子组件的方式：
在顶部 import {ComponentRender} from '@mscststs/top-frame' ，然后在合适的位置使用：

<ComponentRender path="${path}/${"{child组件名称}"}" />

当前在一个分布式低代码环境，每层组件只需要实现当层的功能。
- 你只需要为子组件预留位置，而不需要实现子组件的布局。
- 必须使用 ComponentRender 来渲染对应的子组件。
- 可以给子组件传递合理的 Props 以处理循环数据或者事件，将其当作是常规组件一样来使用。

      `;
  }, [pageNode]);

  const targetPrompt = useMemo(() => {
    return `
## 角色，你正在一个低代码页面中，你的任务是根据用户的描述生成一个 React 组件代码。

## 约束：
- 仅能使用以下列表中的依赖：
  基础框架：
  - react
  - react-router-dom
  - Tailwind CSS
  - @mscststs/top-frame
  其他依赖：
  - clsx
  - lodash
  - dayjs
  - dayjs/locale/zh-cn
  
- 禁止在组件内添加使用说明和描述。

## 代码要求:
- 文案使用中文
- 必须是完整的函数式组件，使用 export default 导出
- 注意括号、缩进和分号等代码格式的正确性，确保代码可以直接运行
- 代码符合现代化 Web 页面的设计风格，简洁、美观、易用，功能完备
- 适应响应式需求，内容区域可能是固定尺寸，也可能需要基于 flex-auto 跟随容器尺寸，始终注意边距和溢出问题


## 布局和样式要求：

${getTheme()}

最外层使用 flex-auto ，使用flex布局，正确使用 justify-*, items-* 等类名进行对齐和分布，确保内容区域宽度适中且居中显示，避免内容过宽或过窄。

禁止使用 h-min-screen 等方式设置绝对高度，避免出现滚动条。

${parentPrompt}

${childrensPrompt}

  
## 组件的功能和设计描述:
**优先按照组件的要求来做**，除非与禁止的行为冲突

${pageNode.prompt}


不需要任何多余的描述和 markdown 标记，你的回复 以 import React from 'react' 开头，并且以组件代码结尾。
      `;
  }, [pageNode]);

  return <PromptRender path={path} prompt={targetPrompt} />;
};

export default ComponentRender;

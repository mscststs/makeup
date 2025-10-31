import { useMemo } from "react";
import { toYAML } from "../../utils/yaml";
import { useRuntime } from "./Context";
import PromptRender from "./PromptRender";

const AppRender = ()=>{
  const { dsl } = useRuntime();

  const prompt = useMemo(()=>{
    return `
## 背景
你正在一个 React 站点生成的场景中，你的任务是根据用户的描述和要求生成符合要求的站点框架。

## 说明
### React 风格
你的生成目标应该是一个包含默认导出的 jsx 函数组件，并且满足以下要求：
- 你的组件总是作为 export default 导出。
- 你的组件始终正确处理 Props，如果你的组件包含UI，总是正确处理 className 和 style 等属性。

### UI和样式
- 你只能使用 @radix-ui/themes 中的组件
- 你只能使用 Tailwind CSS
- 总是优先使用 Flex 布局，并正确设置溢出
- 总是正确设置 UI 元素的层级、user-select、cursor-pointer 等属性

### 依赖和导入
- 你必须使用 ESModule 风格来导入对应的组件
- 你只能使用以下依赖：
  - react
  - react-router-dom
  - Tailwind CSS
  - @mscststs/top-frame
  - @radix-ui/themes
  - lucide-react
  - clsx
  - lodash
- 绝对禁止使用列表外的依赖，你应该自己实现对应的功能。

### 路由和导航
- 只允许使用 HashRouter 
- 使用 <Routes> 和 <Route> 正确定义路由表
- 渲染对应的页面时，总是使用 \`@mscststs/top-frame\` 中的 \`PageRender\` 组件。
\`\`\`
import { PageRender } from "@mscststs/top-frame";
// usage: PageName 是 yml 定义中 Pages 中的属性
<PageRender pageName="[PageName]" />
\`\`\`

所有页面组件**必须** 使用 PageRender 组件来渲染，禁止独自实现对应的逻辑。

### 生成要求
你的 tsx 组件应当完全诠释站点的框架和主题定义，包含 Router、Theme 等，并正确处理全局的框架样式，包括 header 或者 content 的布局结构


### 用户的站点定义：
你需要解读以下定义并根据上述要求来生成对应的 tsx 组件代码。

${toYAML(dsl)}

不需要任何多余的描述和 markdown 标记，你的输出以 import React from 'react' 开头，并且以组件代码结尾。
    `
  }, [dsl]);

  return <PromptRender path={'app'} prompt={prompt} />;
}

export default AppRender;
## TopFrame

一种基于预设模板和流程的 AI无代码 前端页面 DSL 解决方案。

通过给定的步骤和流程，将 AI 产物限定在 数据源 、主题和组件内。
确保 AI 每次进行的修改都只覆盖特定的组件，而不参与脚手架、依赖、npm包的处理。
非常适合不会编程，不懂怎么写代码的人来使用。


限制：
  AI 始终只能使用范围内的 npm 包和依赖，AI 无法进行大规模的代码重构和修复，页面整体的功能复杂度有限，无法实现过于复杂的交互逻辑，也很难进行公共代码复用。AI无法精细化地修改指定的代码行，只能通过 Prompt 进行整体重新生成。

优势：
  AI 生码的复杂度降低，无需一次性完成全部代码，而是分步骤，且层层递进，这对多页面，但是功能简单的场景，非常有效。
  AI 生码的成功率大幅提升。
  AI 生码的速度大幅提升，可以并发处理。
  能支持实时预览和反馈，在生码过程中，用户可以直观看到所有的步骤，并且可以在生成过程中打断，并且进行修改。
  支持模板参考，能够实现主题风格的统一，能够给用户的不同需求预设 AI 模版。只需要 AI 针对 DSL 进行微调即可。

交互模式：
  - 以 DSL 驱动，DSL 是唯一入口
  - 用户总是自己编写或通过 AI 来编写或修改 DSL
  - DSL 的更新产生的变更会被 AI 按顺序进行处理，处理方式：先全局后局部，同级别可以并发处理

资产和代码的绑定
  - DSL 的变更会在不同级别产生不同的 JSX 代码资产，通过某个文件进行存储和绑定
  - 生成代码资产后，仅当 DSL 变更时，才会触发代码资产更新。
    当Global DSL 变更时（数据源、主题、路由），总是要重新生成所有的组件代码资产
    当局部 DSL 变更时，仅会重新生成受影响的组件代码资产
  - 代码资产可以手动修改，但无法锁定，一旦手动修改之后，如果再次触发 DSL 变更，代码资产可能会被覆盖，因此当进行小功能的改动时，建议直接修改 DSL，而不是代码资产。

推进步骤：
1. 描述即组件 ， Prompt as A Component
2. 描述即页面 ， Prompt as A Page
3. 描述即应用 ， Prompt as An App


基础能力建设：
1. 描述即组件
  基于 Prompt 的组件生成和页面渲染

2. 描述即页面
  基于 DSL 的页面生成和路由管理
  能实现多层级的组件渲染

3. 描述即应用
  基于 DSL 的数据源和主题管理，增加全局数据、全局依赖和后端 api 调用能力


**解构 AI 生码的核心能力，并做到极致。**

### DSL 渲染容器

处理以下功能：
1. 提供完整 DSL 容器、配置管理
2. 基于 yml 生成组件树
3. 提供组件树的 读、写 交互能力


### 多级可靠 AI 渲染
每一级 AI 组件渲染时需要知道的上下文：

0. 基本的输出要求和格式要求
1. 当前组件需要完成的功能和要求
2. 页面整体的功能，子组件的功能列表
3. 父组件会如何使用当前组件（父组件的代码）
4. 页面的数据来源代码，dataSource（zustand）
5. 全局的样式描述，主题定义


### 组件树透视关系

虚拟的组件树：
 DataProvider -- Data Agent 生成 React 组件
   ThemeProvider -- Theme Agent 生成 React 组件
    Layout + Router -- Router Agent 生成 React 组件
      Page
        Content
          componentA
            componentB
              componentC
              componentD
            componentE
          componentF


实际的组件树
** Runtime **
- DataProvider
  - ThemeProvider
    - SmartRender(Layout + Router)
      - SmartRender(Page)
        - SmartRender(Content)
          - SmartRender (componentA)
            - SmartRender (componentB)
              - SmartRender (componentC)
              - SmartRender (componentD)
            - SmartRender (componentE)
          - SmartRender (componentF)

在真实的场景中，分为 n + 1 种不同的组件类型。
其中 n 表示：DataProvider、ThemeProvider 等全局组件，由专门的 Agent 生成，这些组件严格遵循特定的场景要求，只设置或者提供 Context，以及被 SmartRender 参考。
另外 1 种表示：页面中的所有 SmartRender 组件，这些组件不干扰全局状态，仅基于数据交互能力来读取全局的数据接口和样式，以及读取父组件的信息，并根据父组件的数据来渲染自己。

### DSL 描述

DSL 顶层定义
1. DSL 类型、版本、元信息
2. Global 配置
  - 主题定义
  - 数据源定义
  - 路由和页面定义
3. 页面定义
  - 页面 A 定义
    - 组件树定义
      - 组件 A 定义
        - 组件 B 定义
      - 组件 C 定义
  - 页面 B 定义
    - 组件树定义
      - 组件 D 定义
      - 组件 E 定义

组件的定义包含：

### 示例：
```yaml
version: "1.0"
type: "topframe-app"
metadata:
  name: "Search Page"
  description: "A simplified Page"

global:
  theme:
    prompt: "极简，无圆角，无outline，间距偏小, fontSize 定义 为 14px，其他尺寸都等比缩小，颜色偏浅，背景色为白色，需要响应式设计"
  routes:
    prompt: "单纯的路由组件，由于是单页面，不需要Menu之类的组件，只需要内容区填满空间"
    - path: "/"
      page: "home"

pages:
  home:
    name: "首页"
    prompt: "一个搜索页面，顶部是搜索框，下面是搜索结果列表，每个搜索结果包含标题，描述，链接，点击标题可以打开链接，主内容宽度适中，水平居中展示"
    childrens:
      - name: "搜索输入框"
        prompt: "一个输入框和按钮在一行的组件，输入框占满剩余空间，按钮在右侧，按钮文字是搜索，点击搜索按钮会跳转到百度 https://www.baidu.com/s?wd={输入框内容}"
      - name: "推荐搜索"
        prompt: "一个推荐搜索列表，根据宽度决定显示两列或者一列，字号较小，显示最近的热搜：1. React 2. Vue 3. Angular 4. Svelte 5. Next.js 6. Nuxt.js"
```


使用 yaml 的原因：
1. yaml 更适合 AI 生成，比起类型严格的 JSON， yaml 更加宽松和灵活，AI 更容易理解和生成。
2. yaml 占用 Token 更少，控制字符更少，节省成本。
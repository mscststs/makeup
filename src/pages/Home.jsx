import React, { useEffect } from 'react'
import SmartRender from '../components/ai/SmartRender';
import Runtime from '../components/topframe/Runtime';
import PageRender from '../components/topframe/PageRender';
import { askKIMI } from '../utils/ai';

const defaultDSL = `
version: "1.0"
type: "topframe-app"

metadata:
  name: "Search Page"
  description: "A simplified Page"

global:
  theme:
    prompt: "极简设计风格，主色调 #1976D2，light 模式，全局 fontSize 14px，所有UI元素尺寸等比缩小，有1px实线边框，无圆角，对比度适中，布局紧凑间距偏小，UI元素偏小，整体为响应式设计，适配移动端和桌面端"
  layout:
    prompt: "单纯的路由组件，由于是单页面，不需要Menu之类的组件，只需要内容区填满空间"
    routes:
      - path: "/"
        page: "home"

pages:
  home:
    name: "首页"
    prompt: "一个搜索页面，所有内容垂直居中展示，顶部是搜索框，下面是推荐搜索列表，主内容宽度适中，背景色：从上到下，带角度的蓝色渐变"
    childrens:
      - name: "搜索输入框"
        prompt: "输入框和按钮并排一行，输入框占满剩余空间，右侧按钮显示文字'搜索'，输入框有1px实线边框；点击搜索按钮后，使用当前输入内容拼接谷歌搜索URL https://www.google.com/search?q={输入框内容}，在新标签页打开"
      - name: "推荐搜索"
        prompt: "两列布局的推荐列表，字号较小，固定显示热搜词：1. React 2. Vue 3. Angular 4. Svelte 5. Next.js 6. Nuxt.js；每个热词点击后，拼接对应名称生成谷歌搜索链接 https://www.google.com/search?q={热词}，并在新标签页打开"

`

export default function Home() {
  const [yaml, setYaml] = React.useState(defaultDSL);

  const [renderDSL, setRenderDSL] = React.useState(yaml);

  const handleDSLSubmit = () => {
    setRenderDSL(yaml);
  }


  const handleAIChat = async (message) => {
    const prompt = `
你是一个低代码 DSL 架构师，你需要根据用户的需求修改一个低代码站点的 DSL。

## 参考格式
version: "1.0"
type: ""

metadata:
  name: ""
  description: ""

global:
  theme:
    prompt: ""
  layout:
    prompt: ""
    routes:
      - path: "/"
        page: "home"

pages:
  home:
    name: ""
    prompt: ""
    childrens:
      - name: ""
        prompt: ""
      - name: ""
        prompt: ""

## 说明
所有 prompt 的字段都表示这个字段将会交给 AI 来识别，你需要确保不同 Prompt 字段的合理性满足以下要求：
1. global.theme.prompt: 需要明确给出整个页面的设计风格，主色调(16进制颜色)，是 light 模式还是 dark 模式，字号的要求，是否需要边框，UI元素是偏小还是偏大还是适中，圆角还是直角，对比度较高还是较低，是否需要响应式设计
2. pages[pageName].prompt：需要明确给出这个页面的核心功能，页面整体的设计风格，每个子元素的位置，尺寸，大小，宽度，是否居中或者并排，页面内的主要步骤
3. pages[pageName].childrens[?.childrens].prompt: 需要明确给出这个组件的功能、尺寸、按钮和交互方式，点击交互后的响应，执行的动作，描述清楚。

## 要求
- DSL 需要严格按照 YAML 格式
- 你需要以一个精英 Web 工程师的思维来拆解页面结构和组件模块
- 你在生成 Prompt 的时候需要从整体到细节，从 UI 到交互细节全方位考虑
- 你在生成 Prompt 的时候应该尽可能使用简短、明确的方式来表达
- 如果是在修改 一个YAML，你应该尽可能全局地判断功能，并尽可能精准、准确的完成修改任务，而不应该修改没提到的部分。


## 约束：
- 禁止输出无关的内容
- 禁止在回答前后输出 markdown 标记

接下来，你需要根据上面的约束来修改一份 yaml，原文如下：

${yaml}

用户的修改要求是:

${message}

你的修改应该充分考虑用户的意见，你的输出以 version: "1.0" 开始，并以完整的 yaml 内容结束。
    `

    const result = await askKIMI(prompt);
    console.log("result", result);
    setYaml(result);
  }

  return (
    <div className='flex-auto flex flex-row w-full gap-4 ' >
      <div className="left w-[400px] flex-none flex-col gap-4 flex">
        <SmartRender
          prompt="一个 textarea，实际是 yaml 编辑器,flex-auto，内部可以滚动，onChange 回调是 text"
          className="flex-auto w-full"
          onChange={setYaml}
          placeholder="请输入 YAML 内容"
          value={yaml}
        />
        <SmartRender className="flex-none" prompt={"一个标准按钮"} onClick={handleDSLSubmit} 
          title="渲染" disabled={renderDSL === yaml}></SmartRender>

        <SmartRender className="flex-none" prompt="一个input输入框，带一个提交按钮，点击提交后触发 onSubmit(val:string) 回调，并清空输入框" onSubmit={handleAIChat} placeholder="想让AI怎么改"></SmartRender>
      </div>
      <div className="flex-auto border rounded p-2 overflow-auto flex flex-col">
        <Runtime yaml={renderDSL}>
          <PageRender pageName="home" />
        </Runtime>
      </div>
    </div>
  );
}
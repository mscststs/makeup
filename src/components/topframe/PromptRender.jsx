import React from "react";
import { askKIMI } from "../../utils/ai.js";
import CodeRender from "../engine/CodeRender.jsx";
import { useRuntime } from "./Context.jsx";

const useCache = false;

export default function SmartRender({ path, prompt, ...args }) {
  const [code, setCode] = React.useState("");
  const { setCode: setCodeMap } = useRuntime();

  React.useEffect(() => {
    let cancelled = false;
    async function fetchCode() {
      // 同一个 prompt 不重复请求，使用 sessionStorage 保存
      const cachedCode = sessionStorage.getItem(`TF_SMART_${prompt}`);
      if (useCache && cachedCode) {
        setCode(cachedCode);
        return;
      }

      const targetPrompt = prompt;

      // 触发前，先把组件代码置空，显示加载中
      setCode("");
      const code = await askKIMI(targetPrompt);

      if (!cancelled) {
        sessionStorage.setItem(`TF_SMART_${prompt}`, code);
        setCode(code);
        setCodeMap(path, code);
      }
    }

    fetchCode();

    return () => {
      cancelled = true;
    };
  }, [prompt]);

  const _rebuild = async () => {
    const code = await askKIMI(targetPrompt);
    setCode(code);
  };

  return (
    <>
      {code ? <CodeRender code={code} args={args} /> : <div>AI 生成中...</div>}
    </>
  );
}

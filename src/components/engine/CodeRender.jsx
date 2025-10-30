import * as clsx from "clsx";
import lodash from "lodash";
import React, { useEffect, useMemo, useRef, useState } from "react";
// Globals
import ReactDOM from "react-dom/client";
import * as ReactRouterDom from "react-router-dom";
import { compileCode, runTransformedCode } from "../../utils/compileCode";
import TopFrame from "../topframe/globalvals";
import { ErrorBoundary } from "./ErrorBoundary";
import { DefaultErrorFallback } from "./ErrorFallback";

/**
 * CodeRender
 * props:
 *  - code: string (javascript module that default-exports a React component)
 *  - fallback: React node shown while loading
 *  - errorFallback: React component used by ErrorBoundary
 */
export default function CodeRender({
  code,
  fallback = <div>加载中...</div>,
  errorFallback = DefaultErrorFallback,
  args = {},
}) {
  const [moduleKey, setModuleKey] = useState(0);

  const newCode = useRef(null);

  // 编译错误状态（用于在 render 期间抛出以让 ErrorBoundary 捕获）
  const [compileError, setCompileError] = useState(null);

  // helper: 在 render 时抛出编译错误，使 ErrorBoundary 捕获
  function CompileErrorThrower({ error }) {
    if (error) throw error;
    return null;
  }

  // create blob url whenever code changes, but first compile via compileCode (sync or async)
  useEffect(() => {
    let cancelled = false;

    if (typeof code !== "string") {
      setCompileError(null);
      return () => {};
    }
    // compileCode may return string or Promise<string>
    (async () => {
      setCompileError(null);
      try {
        const compiled = await compileCode(code);
        if (cancelled) return;

        newCode.current = compiled;

        // bump key so useMemo recreates the lazy importer
        setModuleKey((k) => k + 1);
      } catch (e) {
        if (cancelled) return;
        // store compile error so we can throw it during render (caught by ErrorBoundary)
        setCompileError(e instanceof Error ? e : new Error(String(e)));
        // ensure a remount so ErrorBoundary will re-evaluate children
        setModuleKey((k) => k + 1);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [code]);

  // memoize Lazy component so it remounts when moduleKey changes
  const LazyComp = useMemo(() => {
    if (!newCode.current) return null;
    // using @vite-ignore to allow dynamic blob import under Vite
    return React.lazy(async () => {
      const exports = runTransformedCode(newCode.current, {
        react: React,
        "react-dom/client": ReactDOM,
        lodash: lodash,
        clsx: clsx,
        "react-router-dom": ReactRouterDom,
        "@mscststs/top-frame": TopFrame,
      });
      return exports;
    });
  }, [moduleKey]);

  // Render
  return (
    <ErrorBoundary fallback={errorFallback} key={moduleKey}>
      {/* 如果 compile 出错，在 render 阶段抛出以被 ErrorBoundary 捕获 */}
      <CompileErrorThrower error={compileError} />
      <React.Suspense fallback={fallback}>
        {LazyComp ? <LazyComp {...args} /> : <div>无可用代码</div>}
      </React.Suspense>
    </ErrorBoundary>
  );
}

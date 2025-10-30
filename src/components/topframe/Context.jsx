import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toJSON } from "../../utils/yaml";

const RuntimeContext = createContext();

export const RuntimeProvider = ({ children, initialYAML }) => {
  const [yaml, setYaml] = useState(initialYAML || "");
  const codeMap = useRef({});

  useEffect(() => {
    if (yaml === initialYAML) return;

    setYaml(initialYAML);
  }, [initialYAML]);

  const dsl = useMemo(() => {
    try {
      return toJSON(yaml);
    } catch (e) {
      console.error("YAML 解析错误：", e);
      return null;
    }
  }, [yaml]);

  const getPageNode = (nodePath) => {
    // nodePath: 以 / 分隔的路径，起始是 dsl.pages[pageName], 然后从下一级开始，从 childrens 找对应 name 的节点。
    const [pageName, ...paths] = nodePath.split("/");
    let target = dsl.pages ? dsl.pages[pageName] : null;

    while (paths.length > 0 && target) {
      const childName = paths.shift();
      target = target.childrens
        ? target.childrens.find((child) => child.name === childName)
        : null;
    }

    return target;
  };

  const setCode = (path, code) => {
    codeMap.current[path] = code;
  };
  const getCode = (path) => {
    return codeMap.current[path];
  };

  const getTheme = () => {
    return dsl?.global?.theme?.prompt ?? "";
  };

  const value = useMemo(
    () => ({
      dsl,
      yaml,
      setYaml,
      getTheme,
      getPageNode,
      setCode,
      getCode,
    }),
    [dsl, yaml, setYaml, getPageNode, getTheme],
  );

  if (!yaml) {
    return null;
  }

  return (
    <RuntimeContext.Provider value={value}>{children}</RuntimeContext.Provider>
  );
};

export const useRuntime = () => {
  const context = useContext(RuntimeContext);
  if (!context) {
    // 报错提示：必须在 ThemeProvider 内部使用
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

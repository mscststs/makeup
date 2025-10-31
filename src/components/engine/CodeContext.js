import {createContext, useContext} from "react";

const CodeContext = createContext({
  config: {},
  globalVals: {},
});

export const CodeProvider = CodeContext.Provider;

export const useCodeContext = () => useContext(CodeContext);

import { CodeProvider } from "./CodeContext";

const CodeContainer = ({ config, globalVals, children }) => {

  return (
    <CodeProvider value={{ config, globalVals }}>
      {children}
    </CodeProvider>
  );
};

export default CodeContainer;
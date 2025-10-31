import "./globalvals";
import { CodeContainer } from "../engine";
import { RuntimeProvider } from "./Context";

const Runtime = ({
  /**
   * DSL 内容
   */
  yaml,
  engine = {},
  children,
}) => {

  const globalVals = engine.globalVals ?? {};

  return (
    <RuntimeProvider initialYAML={yaml}>
      <CodeContainer globalVals={globalVals}>{children}</CodeContainer>
    </RuntimeProvider>
  );
};

export default Runtime;

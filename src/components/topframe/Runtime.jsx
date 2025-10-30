import "./globalvals";
import { RuntimeProvider } from "./Context";

const Runtime = ({
  /**
   * DSL 内容
   */
  yaml,
  children,
}) => {
  return <RuntimeProvider initialYAML={yaml}>{children}</RuntimeProvider>;
};

export default Runtime;


// 移除文本中的代码块语法
export function codeClear(text) {
  return text.replace(/^```(.*)?\n/gm, "").replace(/```$/gm, "").trim();
}

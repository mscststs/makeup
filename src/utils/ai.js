import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { generateText } from 'ai';


const provider = createOpenAICompatible({
  name: 'Custom',
  apiKey: import.meta.env.VITE_AI_SKEY,
  baseURL: import.meta.env.VITE_AI_ENDPOINT,
});

// 防止竞争，只能有一个请求在进行
let ongoingRequest = null;

export async function askKIMI(prompt) {
  // 如果有正在进行的请求，等待它完成
  while (ongoingRequest) {
    await ongoingRequest.finally(() => {});
  }

  ongoingRequest = (async () => {
    try {
      const response = await generateText({
        model: provider( import.meta.env.VITE_MODEL_NAME),
        prompt,
      });
      return response;
    } finally {
      ongoingRequest = null;
    }
  })();

  const { text } = await ongoingRequest;
  return text;
}

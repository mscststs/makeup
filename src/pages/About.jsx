import React from "react";
import { askKIMI } from "../utils/ai";

export default function About() {
  const [text, setText] = React.useState("");
  const [answer, setAnswer] = React.useState("");

  return (
    <div className="flex flex-auto flex-col">
      <textarea
        className="w-full h-48 p-2 border border-gray-300 rounded mb-4 font-mono text-sm"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ask KIMI anything..."
      />
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded"
        onClick={async () => {
          const response = await askKIMI(text);

          setAnswer(response);
        }}
        type="button"
      >
        Ask KIMI
      </button>

      <div className="mt-4 p-4 border border-gray-300 rounded bg-gray-50">
        <h3 className="font-semibold mb-2">Answer:</h3>
        <pre className="whitespace-pre-wrap">{answer}</pre>
      </div>
    </div>
  );
}

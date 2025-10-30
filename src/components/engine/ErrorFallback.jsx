export function DefaultErrorFallback({ error }) {
  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded">
      <h3 className="text-red-700 font-semibold">渲染错误</h3>
      <pre className="mt-2 text-sm text-red-600">
        {String(error && (error.stack || error.message || error))}
      </pre>
    </div>
  );
}

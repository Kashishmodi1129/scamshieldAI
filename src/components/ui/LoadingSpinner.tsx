export function LoadingSpinner({ text = 'Analyzing...' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-12">
      <div className="w-16 h-16 border-4 border-slate-700 border-t-cyan-400 rounded-full animate-spin" />
      <p className="text-gray-400 font-medium animate-pulse">{text}</p>
    </div>
  );
}

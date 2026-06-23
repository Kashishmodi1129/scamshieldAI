import { useCallback, useRef, useState } from 'react';
import { api } from '../../services/api';

interface Props {
  onTextExtracted: (text: string) => void;
}

export function ScreenshotUpload({ onTextExtracted }: Props) {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const res = await api.upload(file);
      onTextExtracted(res.text || '');
    } catch {
      onTextExtracted('OCR processing failed. Please paste text manually.');
    } finally {
      setUploading(false);
    }
  }, [onTextExtracted]);

  return (
    <div className="mt-8">
      <p className="text-[10px] tracking-widest font-bold text-gray-500 uppercase mb-3">Or upload a screenshot</p>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
          dragOver ? 'border-cyan-500 bg-cyan-500/5' : 'border-white/10 hover:border-white/20'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        />
        {preview ? (
          <div className="space-y-3">
            <img src={preview} alt="Screenshot preview" className="max-h-40 mx-auto rounded-xl" />
            {uploading && <p className="text-sm text-cyan-400 animate-pulse">Extracting text with OCR...</p>}
          </div>
        ) : (
          <div className="space-y-3">
            <svg className="w-10 h-10 text-gray-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
            <p className="text-sm text-gray-400">Drop a screenshot here or click to browse</p>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { X, ZoomIn, ZoomOut, RotateCw, Download, FileText, CheckCircle2 } from 'lucide-react';

interface DocumentImageViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
  description?: string;
}

export const DocumentImageViewerModal: React.FC<DocumentImageViewerModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  title,
  description,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);

  if (!isOpen || !imageUrl) return null;

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.5));
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);
  const handleReset = () => {
    setZoomLevel(1);
    setRotation(0);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-hidden animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-700 w-full max-w-4xl h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between gap-4 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">{title}</h3>
              {description && <p className="text-[11px] text-slate-400">{description}</p>}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-800 rounded-xl p-1 border border-slate-700">
              <button
                type="button"
                onClick={handleZoomOut}
                title="Zoom Out"
                className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono font-bold text-slate-300 px-2">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                type="button"
                onClick={handleZoomIn}
                title="Zoom In"
                className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleRotate}
              title="Putar 90 Derajat"
              className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 hover:text-white border border-slate-700 transition"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            <a
              href={imageUrl}
              download={`${title.replace(/\s+/g, '_').toLowerCase()}.jpg`}
              target="_blank"
              rel="noreferrer"
              title="Unduh Berkas"
              className="p-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-white transition"
            >
              <Download className="w-4 h-4" />
            </a>

            <button
              type="button"
              onClick={onClose}
              title="Tutup (ESC)"
              className="p-2 bg-slate-800 hover:bg-red-600/80 rounded-xl text-slate-300 hover:text-white border border-slate-700 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Image Preview Canvas */}
        <div className="flex-1 overflow-auto bg-slate-950 flex items-center justify-center p-6 relative select-none">
          <div
            className="transition-transform duration-150 flex items-center justify-center"
            style={{
              transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
            }}
          >
            <img
              src={imageUrl}
              alt={title}
              className="max-h-[72vh] max-w-full rounded-xl shadow-2xl object-contain border border-slate-800"
            />
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" /> Berkas Asli Terverifikasi di Sistem Aetra
          </span>
          <button
            type="button"
            onClick={handleReset}
            className="text-slate-400 hover:text-white underline text-[11px]"
          >
            Reset Tampilan
          </button>
        </div>
      </div>
    </div>
  );
};

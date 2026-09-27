import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Minimize2, 
  Download, 
  RotateCw,
  ExternalLink,
  Loader2,
  AlertCircle,
  RefreshCw,
  FileText
} from 'lucide-react';

// Polyfill Promise.try before pdfjs initializes
if (typeof (Promise as any).try !== 'function') {
  (Promise as any).try = function (fn: any, ...args: any[]) {
    return new Promise((resolve) => resolve(fn(...args)));
  };
}

import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

// Configure the worker to use the local worker script with Promise.try polyfill
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
}

export interface PdfViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
  title?: string;
  subtitle?: string;
  downloadFilename?: string;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({
  isOpen,
  onClose,
  pdfUrl,
  title = 'Website Services Brochure',
  subtitle = 'Official Master PDF — 2026 Edition',
  downloadFilename = 'wal-groups-website-services-brochure-2026.pdf',
}) => {
  const [numPages, setNumPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoom, setZoom] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRendering, setIsRendering] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [pageInput, setPageInput] = useState<string>('1');

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pdfDocRef = useRef<any>(null);
  const renderTaskRef = useRef<any>(null);

  // Synchronize page input display
  useEffect(() => {
    setPageInput(String(currentPage));
  }, [currentPage]);

  // Load PDF document safely as ArrayBuffer
  const loadPdf = useCallback(async () => {
    if (!pdfUrl) return;

    setIsLoading(true);
    setError(null);
    setCurrentPage(1);

    try {
      // Direct fetch of the PDF binary data ensures complete transfer and valid headers
      const response = await fetch(pdfUrl);
      if (!response.ok) {
        throw new Error(`Failed to load document (${response.status} ${response.statusText})`);
      }

      const buffer = await response.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({
        data: new Uint8Array(buffer),
        cMapPacked: true,
      });

      const doc = await loadingTask.promise;
      pdfDocRef.current = doc;
      setNumPages(doc.numPages);
      setIsLoading(false);
    } catch (err: any) {
      console.error('Error loading PDF document:', err);
      setError(err?.message || 'Failed to load PDF document.');
      setIsLoading(false);
    }
  }, [pdfUrl]);

  useEffect(() => {
    if (isOpen) {
      loadPdf();
    } else {
      // Reset state on close
      pdfDocRef.current = null;
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch (_) {}
        renderTaskRef.current = null;
      }
    }
  }, [isOpen, loadPdf]);

  // Render current page to canvas with high-DPI crispness
  const renderCurrentPage = useCallback(async () => {
    if (!pdfDocRef.current || !canvasRef.current) return;

    try {
      setIsRendering(true);

      // Cancel previous render task if active
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch (_) {}
        renderTaskRef.current = null;
      }

      const page = await pdfDocRef.current.getPage(currentPage);
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d', { alpha: false });
      if (!context) {
        setIsRendering(false);
        return;
      }

      const pixelRatio = typeof window !== 'undefined' ? Math.max(window.devicePixelRatio || 1, 2) : 2;
      const viewport = page.getViewport({ scale: zoom, rotation });
      const scaledViewport = page.getViewport({ scale: zoom * pixelRatio, rotation });

      canvas.width = Math.floor(scaledViewport.width);
      canvas.height = Math.floor(scaledViewport.height);
      canvas.style.width = `${Math.floor(viewport.width)}px`;
      canvas.style.height = `${Math.floor(viewport.height)}px`;

      const renderContext = {
        canvasContext: context,
        viewport: scaledViewport,
      };

      const task = page.render(renderContext);
      renderTaskRef.current = task;
      await task.promise;
      setIsRendering(false);
    } catch (err: any) {
      if (err?.name !== 'RenderingCancelledException') {
        console.error('Canvas render error:', err);
      }
      setIsRendering(false);
    }
  }, [currentPage, zoom, rotation]);

  useEffect(() => {
    if (isOpen && !isLoading && pdfDocRef.current) {
      renderCurrentPage();
    }
  }, [isOpen, isLoading, currentPage, zoom, rotation, renderCurrentPage]);

  // Keyboard controls
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        handleNextPage();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        handlePrevPage();
      } else if (e.key === '=' || e.key === '+') {
        handleZoomIn();
      } else if (e.key === '-') {
        handleZoomOut();
      } else if (e.key === 'Home') {
        setCurrentPage(1);
      } else if (e.key === 'End') {
        setCurrentPage(numPages);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentPage, numPages, onClose]);

  // Prevent background body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Zoom controls
  const handleZoomIn = () => {
    setZoom((z) => Math.min(2.5, Math.round((z + 0.15) * 100) / 100));
  };

  const handleZoomOut = () => {
    setZoom((z) => Math.max(0.5, Math.round((z - 0.15) * 100) / 100));
  };

  const handleFitWidth = () => {
    if (!scrollAreaRef.current || !pdfDocRef.current) return;
    pdfDocRef.current.getPage(currentPage).then((page: any) => {
      const baseViewport = page.getViewport({ scale: 1.0, rotation });
      const containerWidth = scrollAreaRef.current?.clientWidth || 800;
      const targetZoom = Math.max(0.5, Math.min(2.2, (containerWidth - 48) / baseViewport.width));
      setZoom(Math.round(targetZoom * 100) / 100);
    });
  };

  const handleFitPage = () => {
    if (!scrollAreaRef.current || !pdfDocRef.current) return;
    pdfDocRef.current.getPage(currentPage).then((page: any) => {
      const baseViewport = page.getViewport({ scale: 1.0, rotation });
      const containerHeight = scrollAreaRef.current?.clientHeight || 700;
      const targetZoom = Math.max(0.5, Math.min(1.8, (containerHeight - 40) / baseViewport.height));
      setZoom(Math.round(targetZoom * 100) / 100);
    });
  };

  const handleRotate = () => {
    setRotation((r) => (r + 90) % 360);
  };

  const handleNextPage = () => {
    setCurrentPage((p) => {
      const next = Math.min(numPages, p + 1);
      if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTop = 0;
      }
      return next;
    });
  };

  const handlePrevPage = () => {
    setCurrentPage((p) => {
      const prev = Math.max(1, p - 1);
      if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTop = 0;
      }
      return prev;
    });
  };

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageInput(e.target.value);
  };

  const handlePageInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(pageInput, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= numPages) {
      setCurrentPage(parsed);
      if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTop = 0;
      }
    } else {
      setPageInput(String(currentPage));
    }
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Direct open in new tab
  const handleOpenInNewTab = () => {
    window.open(pdfUrl, '_blank', 'noopener,noreferrer');
  };

  if (!isOpen) return null;
  if (typeof document === 'undefined') return null;

  const downloadUrl = pdfUrl.includes('?') ? `${pdfUrl}&download=1` : `${pdfUrl}?download=1`;

  return createPortal(
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md p-1 sm:p-3 md:p-6 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        ref={containerRef}
        className="w-full h-full max-w-6xl max-h-[96vh] bg-[#071322] border border-white/20 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-white relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* =========================================================================
            1. MINIMAL COMPACT HEADER BAR
            WAL GROUPS | Website Services Brochure | Actions | Close
            ========================================================================= */}
        <div className="bg-[#041e42] border-b border-white/15 px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between shrink-0 select-none">
          {/* Left: Branding & Document Title */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="flex items-center gap-2 shrink-0">
              <span className="font-black text-xs sm:text-sm tracking-wider text-white">WAL GROUPS</span>
              <span className="text-white/40">|</span>
            </div>
            <div className="min-w-0">
              <h2 className="text-xs sm:text-sm font-semibold text-slate-100 truncate">
                {title}
              </h2>
              {subtitle && (
                <p className="hidden md:block text-[10px] text-[#ff8533] truncate">
                  {subtitle}
                </p>
              )}
            </div>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#ff6600]/20 text-[#ff8533] border border-[#ff6600]/30 shrink-0">
              ORIGINAL PDF
            </span>
          </div>

          {/* Right: Controls & Close */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Open in New Window Button */}
            <button
              onClick={handleOpenInNewTab}
              title="Open PDF directly in a new browser tab"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#ff8533]" />
              <span className="hidden md:inline">Open in Tab</span>
            </button>

            {/* Direct Download Button */}
            <a
              href={downloadUrl}
              download={downloadFilename}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#ff6600] hover:bg-[#e65c00] text-black transition-all shadow-sm cursor-pointer"
              title="Download original PDF file"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </a>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors hidden sm:flex cursor-pointer"
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/15 transition-colors ml-1 cursor-pointer"
              aria-label="Close PDF Viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* =========================================================================
            2. PDF DOCUMENT VIEWING AREA (Clean Canvas Rendering)
            ========================================================================= */}
        <div 
          ref={scrollAreaRef}
          className="flex-1 overflow-auto bg-[#0a101d] p-2 sm:p-6 flex items-center justify-center relative select-none"
        >
          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center gap-3 text-slate-300 p-8">
              <Loader2 className="w-10 h-10 animate-spin text-[#ff6600]" />
              <span className="text-sm font-semibold text-white">Loading original PDF document...</span>
              <span className="text-xs text-slate-400">Verifying document stream & pages</span>
            </div>
          )}

          {/* Error State with Immediate Fallback */}
          {error && (
            <div className="text-center p-6 max-w-md bg-[#041e42]/90 rounded-2xl border border-white/20 shadow-2xl space-y-4">
              <AlertCircle className="w-12 h-12 text-[#ff6600] mx-auto" />
              <div>
                <h3 className="text-sm font-bold text-white mb-1">Could not render in-canvas</h3>
                <p className="text-xs text-slate-300">{error}</p>
              </div>
              <div className="flex flex-col sm:flex-row justify-center gap-2 pt-2">
                <button
                  onClick={loadPdf}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry</span>
                </button>
                <button
                  onClick={handleOpenInNewTab}
                  className="px-4 py-2 rounded-xl bg-[#ff6600] hover:bg-[#e65c00] text-black font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open PDF in Tab</span>
                </button>
                <a
                  href={downloadUrl}
                  download={downloadFilename}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </a>
              </div>
            </div>
          )}

          {/* Rendered Canvas Page */}
          {!isLoading && !error && (
            <div className="flex items-center justify-center my-auto transition-transform duration-150">
              <div className="rounded-lg shadow-[0_15px_40px_rgba(0,0,0,0.7)] overflow-hidden bg-white border border-slate-700 relative">
                <canvas 
                  ref={canvasRef} 
                  className="block mx-auto max-w-none bg-white"
                />
                {isRendering && (
                  <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px] flex items-center justify-center transition-opacity">
                    <Loader2 className="w-6 h-6 animate-spin text-[#ff6600]" />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* =========================================================================
            3. DOCUMENT CONTROL BAR (Desktop & Mobile)
            | - 100% + | Fit Width | Fit Page | Rotate | 1 / 18 | ← Prev | Next → |
            ========================================================================= */}
        <div className="bg-[#03152c] border-t border-white/15 px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs shrink-0 select-none">
          {/* Zoom & Fit controls */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            <button
              onClick={handleZoomOut}
              disabled={zoom <= 0.5 || isLoading}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              title="Zoom Out (-)"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-xs font-semibold px-1.5 sm:px-2 text-slate-200 min-w-[46px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              disabled={zoom >= 2.5 || isLoading}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              title="Zoom In (+)"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>

            <div className="h-4 w-px bg-white/15 mx-1 hidden sm:block" />

            {/* Fit Width / Fit Page buttons */}
            <button
              onClick={handleFitWidth}
              disabled={isLoading}
              className="hidden sm:inline-block px-2.5 py-1 rounded bg-white/5 hover:bg-white/15 text-[11px] font-medium text-slate-200 transition-colors disabled:opacity-30 cursor-pointer"
              title="Fit to Container Width"
            >
              Fit Width
            </button>
            <button
              onClick={handleFitPage}
              disabled={isLoading}
              className="hidden sm:inline-block px-2.5 py-1 rounded bg-white/5 hover:bg-white/15 text-[11px] font-medium text-slate-200 transition-colors disabled:opacity-30 cursor-pointer"
              title="Fit Entire Page"
            >
              Fit Page
            </button>
            <button
              onClick={handleRotate}
              disabled={isLoading}
              className="hidden md:inline-flex items-center gap-1 px-2 py-1 rounded bg-white/5 hover:bg-white/15 text-[11px] font-medium text-slate-200 transition-colors disabled:opacity-30 cursor-pointer"
              title="Rotate 90 degrees clockwise"
            >
              <RotateCw className="w-3 h-3" />
            </button>
          </div>

          {/* Page navigation controls */}
          <div className="flex items-center gap-2 mx-auto sm:mx-0">
            <button
              onClick={handlePrevPage}
              disabled={currentPage <= 1 || isLoading}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed font-semibold text-xs text-white transition-colors cursor-pointer"
              title="Previous Page (ArrowLeft)"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Prev</span>
            </button>

            <form onSubmit={handlePageInputSubmit} className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 rounded-lg border border-white/10 font-mono text-xs text-slate-200">
              <input
                type="text"
                value={pageInput}
                onChange={handlePageInputChange}
                onBlur={handlePageInputSubmit}
                className="w-7 text-center font-bold text-[#ff8533] bg-transparent border-none outline-none p-0"
                aria-label="Current Page Number"
              />
              <span className="text-slate-400">/</span>
              <span>{numPages}</span>
            </form>

            <button
              onClick={handleNextPage}
              disabled={currentPage >= numPages || isLoading}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#ff6600] hover:bg-[#e65c00] text-black disabled:opacity-30 disabled:cursor-not-allowed font-bold text-xs transition-colors cursor-pointer"
              title="Next Page (ArrowRight)"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Document metadata info / Keyboard helper */}
          <div className="hidden lg:flex items-center gap-2 text-[11px] text-slate-400">
            <span>Use ← / → to flip pages</span>
            <span>·</span>
            <span>Esc to close</span>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

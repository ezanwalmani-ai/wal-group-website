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
  FileText,
  Check
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
  title = 'Website Package Brochure',
  subtitle = 'Official Original PDF Document',
  downloadFilename = 'wal-groups-website-brochure.pdf',
}) => {
  const [numPages, setNumPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoom, setZoom] = useState<number>(1.0);
  const [fitMode, setFitMode] = useState<'page' | 'width' | 'custom'>('page');
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
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  // Synchronize page input display
  useEffect(() => {
    setPageInput(String(currentPage));
  }, [currentPage]);

  // Calculate fit scale for the current page
  const calculateScale = useCallback(async (mode: 'page' | 'width'): Promise<number> => {
    if (!scrollAreaRef.current || !pdfDocRef.current) return 1.0;
    try {
      const page = await pdfDocRef.current.getPage(currentPage);
      const unscaledViewport = page.getViewport({ scale: 1.0, rotation });

      const containerW = scrollAreaRef.current.clientWidth;
      const containerH = scrollAreaRef.current.clientHeight;

      // Allow comfortable padding around page so border/shadow are visible without cropping
      const padX = containerW < 640 ? 12 : 28;
      const padY = containerH < 640 ? 12 : 24;

      const availW = Math.max(100, containerW - padX * 2);
      const availH = Math.max(100, containerH - padY * 2);

      if (mode === 'page') {
        const scale = Math.min(availW / unscaledViewport.width, availH / unscaledViewport.height);
        return Math.max(0.3, Math.min(2.5, Math.round(scale * 100) / 100));
      } else {
        const scale = availW / unscaledViewport.width;
        return Math.max(0.3, Math.min(2.5, Math.round(scale * 100) / 100));
      }
    } catch {
      return 1.0;
    }
  }, [currentPage, rotation]);

  // Load PDF document safely as ArrayBuffer
  const loadPdf = useCallback(async () => {
    if (!pdfUrl) return;

    setIsLoading(true);
    setError(null);
    setCurrentPage(1);

    try {
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

      // Automatically calculate initial fit-to-page scale so the entire first page is in view immediately
      if (scrollAreaRef.current) {
        const page1 = await doc.getPage(1);
        const unscaledViewport = page1.getViewport({ scale: 1.0, rotation: 0 });
        const containerW = scrollAreaRef.current.clientWidth;
        const containerH = scrollAreaRef.current.clientHeight;
        const padX = containerW < 640 ? 12 : 28;
        const padY = containerH < 640 ? 12 : 24;
        const availW = Math.max(100, containerW - padX * 2);
        const availH = Math.max(100, containerH - padY * 2);
        const initialScale = Math.min(availW / unscaledViewport.width, availH / unscaledViewport.height);
        setZoom(Math.max(0.3, Math.min(2.5, Math.round(initialScale * 100) / 100)));
        setFitMode('page');
      }

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
      pdfDocRef.current = null;
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch (_) {}
        renderTaskRef.current = null;
      }
    }
  }, [isOpen, loadPdf]);

  // ResizeObserver: auto-adjust scale when in 'page' fit mode to prevent cropping on window resize
  useEffect(() => {
    if (!isOpen || !scrollAreaRef.current) return;

    const handleResize = async () => {
      if (fitMode === 'page' && pdfDocRef.current) {
        const newScale = await calculateScale('page');
        setZoom(newScale);
      } else if (fitMode === 'width' && pdfDocRef.current) {
        const newScale = await calculateScale('width');
        setZoom(newScale);
      }
    };

    resizeObserverRef.current = new ResizeObserver(() => {
      handleResize();
    });

    resizeObserverRef.current.observe(scrollAreaRef.current);

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current = null;
      }
    };
  }, [isOpen, fitMode, calculateScale]);

  // Render current page to canvas with high-DPI crystal-clear resolution
  const renderCurrentPage = useCallback(async () => {
    if (!pdfDocRef.current || !canvasRef.current) return;

    try {
      setIsRendering(true);

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

      // Crisp rendering ratio (minimum 2.5x pixel density for razor-sharp typography)
      const pixelRatio = typeof window !== 'undefined' ? Math.max(window.devicePixelRatio || 1, 2.5) : 2.5;
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

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        handleNextPage();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        handlePrevPage();
      } else if (e.key === '=' || e.key === '+') {
        handleZoomIn();
      } else if (e.key === '-') {
        handleZoomOut();
      } else if (e.key === 'Home') {
        goToPage(1);
      } else if (e.key === 'End') {
        goToPage(numPages);
      } else if (e.key === 'f' || e.key === 'F') {
        handleFitPage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentPage, numPages, onClose]);

  // Lock body scroll when modal is active
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

  // Navigation handlers
  const goToPage = (pageNumber: number) => {
    const target = Math.max(1, Math.min(numPages, pageNumber));
    setCurrentPage(target);
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = 0;
      scrollAreaRef.current.scrollLeft = 0;
    }
  };

  const handleNextPage = () => {
    if (currentPage < numPages) {
      goToPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  // Zoom and fit controls
  const handleZoomIn = () => {
    setFitMode('custom');
    setZoom((z) => Math.min(2.5, Math.round((z + 0.15) * 100) / 100));
  };

  const handleZoomOut = () => {
    setFitMode('custom');
    setZoom((z) => Math.max(0.35, Math.round((z - 0.15) * 100) / 100));
  };

  const handleFitPage = async () => {
    setFitMode('page');
    const scale = await calculateScale('page');
    setZoom(scale);
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = 0;
      scrollAreaRef.current.scrollLeft = 0;
    }
  };

  const handleFitWidth = async () => {
    setFitMode('width');
    const scale = await calculateScale('width');
    setZoom(scale);
  };

  const handleRotate = () => {
    setRotation((r) => (r + 90) % 360);
  };

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageInput(e.target.value);
  };

  const handlePageInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(pageInput, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= numPages) {
      goToPage(parsed);
    } else {
      setPageInput(String(currentPage));
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const handleOpenInNewTab = () => {
    window.open(pdfUrl, '_blank', 'noopener,noreferrer');
  };

  if (!isOpen) return null;
  if (typeof document === 'undefined') return null;

  const downloadUrl = pdfUrl.includes('?') ? `${pdfUrl}&download=1` : `${pdfUrl}?download=1`;

  return createPortal(
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-1 sm:p-3 md:p-5 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div 
        ref={containerRef}
        className="w-full h-full max-w-6xl max-h-[98vh] bg-[#071322] border border-white/20 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-white relative select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* =========================================================================
            1. HEADER BAR: Title, Document Badge, Direct Actions & Close
            ========================================================================= */}
        <div className="bg-[#041e42] border-b border-white/15 px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-6 h-6 rounded bg-[#ff6600] flex items-center justify-center font-black text-black text-xs">
                W
              </div>
              <span className="font-extrabold text-xs sm:text-sm tracking-wider text-white">WAL GROUPS</span>
              <span className="text-white/40">|</span>
            </div>
            <div className="min-w-0">
              <h2 className="text-xs sm:text-sm font-bold text-slate-100 truncate">
                {title}
              </h2>
              {subtitle && (
                <p className="hidden md:block text-[10px] text-[#ff8533] truncate">
                  {subtitle}
                </p>
              )}
            </div>
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#ff6600]/20 text-[#ff8533] border border-[#ff6600]/30 shrink-0">
              <FileText className="w-2.5 h-2.5" />
              <span>ORIGINAL PDF</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Open in New Window Button */}
            <button
              onClick={handleOpenInNewTab}
              title="Open full PDF directly in a new browser tab"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#ff8533]" />
              <span className="hidden md:inline">Open in Tab</span>
            </button>

            {/* Direct Download Button */}
            <a
              href={downloadUrl}
              download={downloadFilename}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#ff6600] hover:bg-[#e65c00] text-black transition-all shadow-sm cursor-pointer"
              title="Download original brochure PDF"
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
            2. FULL-PAGE VIEWING AREA
            Auto-fit calculation prevents half-page views and eliminates internal scrollbars
            ========================================================================= */}
        <div 
          ref={scrollAreaRef}
          className={`flex-1 ${fitMode === 'page' ? 'overflow-hidden' : 'overflow-auto'} bg-[#0a101d] p-2 sm:p-4 flex items-center justify-center relative select-none`}
        >
          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center gap-3 text-slate-300 p-8">
              <Loader2 className="w-10 h-10 animate-spin text-[#ff6600]" />
              <span className="text-sm font-semibold text-white">Loading original brochure...</span>
              <span className="text-xs text-slate-400">Rendering document pages</span>
            </div>
          )}

          {/* Error State with Recovery Fallbacks */}
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

          {/* Main Full-Page Canvas */}
          {!isLoading && !error && (
            <div className="relative flex items-center justify-center transition-all duration-150 max-w-full max-h-full">
              {/* Document Page Canvas Container with Shadow & Crisp Border */}
              <div className="rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.85)] overflow-hidden bg-white border border-slate-700/80 relative">
                <canvas 
                  ref={canvasRef} 
                  className="block mx-auto bg-white"
                />

                {/* Subtle loading spinner during page flip */}
                {isRendering && (
                  <div className="absolute inset-0 bg-black/15 backdrop-blur-[1px] flex items-center justify-center transition-opacity">
                    <Loader2 className="w-8 h-8 animate-spin text-[#ff6600]" />
                  </div>
                )}
              </div>

              {/* Floating Left / Right Page Flip Chevrons */}
              {currentPage > 1 && (
                <button
                  onClick={handlePrevPage}
                  title="Previous Page (Left Arrow)"
                  className="absolute left-2 sm:-left-12 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/75 hover:bg-[#ff6600] text-white hover:text-black border border-white/20 hover:border-[#ff6600] flex items-center justify-center shadow-xl transition-all z-10 cursor-pointer group"
                  aria-label="Previous Page"
                >
                  <ChevronLeft className="w-6 h-6 transition-transform group-hover:-translate-x-0.5" />
                </button>
              )}

              {currentPage < numPages && (
                <button
                  onClick={handleNextPage}
                  title="Next Page (Right Arrow)"
                  className="absolute right-2 sm:-right-12 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/75 hover:bg-[#ff6600] text-white hover:text-black border border-white/20 hover:border-[#ff6600] flex items-center justify-center shadow-xl transition-all z-10 cursor-pointer group"
                  aria-label="Next Page"
                >
                  <ChevronRight className="w-6 h-6 transition-transform group-hover:translate-x-0.5" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* =========================================================================
            3. QUICK PAGE JUMP TABS
            Click any page number to jump directly
            ========================================================================= */}
        {numPages > 1 && (
          <div className="bg-[#041a38] border-t border-white/10 px-3 sm:px-6 py-1.5 flex items-center justify-center gap-1 overflow-x-auto text-[11px] shrink-0 custom-scrollbar">
            <span className="text-slate-400 text-[10px] uppercase font-bold mr-1 shrink-0 hidden sm:inline">
              Jump to Page:
            </span>
            {Array.from({ length: numPages }, (_, i) => i + 1).map((pg) => (
              <button
                key={pg}
                onClick={() => goToPage(pg)}
                className={`min-w-[26px] h-6 px-1 rounded font-mono font-bold text-xs transition-all shrink-0 cursor-pointer ${
                  pg === currentPage
                    ? 'bg-[#ff6600] text-black shadow-sm'
                    : 'bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white'
                }`}
                title={`Go to Page ${pg}`}
              >
                {pg < 10 ? `0${pg}` : pg}
              </button>
            ))}
          </div>
        )}

        {/* =========================================================================
            4. DOCUMENT CONTROLS: Fit Full Page, Zoom, Page Indicator, Prev / Next
            ========================================================================= */}
        <div className="bg-[#03152c] border-t border-white/15 px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs shrink-0">
          {/* Zoom & Fit Modes */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            <button
              onClick={handleZoomOut}
              disabled={zoom <= 0.35 || isLoading}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              title="Zoom Out (-)"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-xs font-bold px-1.5 sm:px-2 text-slate-200 min-w-[48px] text-center">
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

            {/* Fit Full Page Button (Default & Optimal full view) */}
            <button
              onClick={handleFitPage}
              disabled={isLoading}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                fitMode === 'page'
                  ? 'bg-[#ff6600] text-black shadow-sm'
                  : 'bg-white/5 hover:bg-white/15 text-slate-200'
              }`}
              title="Fit entire page in view without scrolling (F)"
            >
              Fit Page
            </button>

            {/* Fit Width Button */}
            <button
              onClick={handleFitWidth}
              disabled={isLoading}
              className={`hidden sm:inline-block px-2.5 py-1 rounded text-[11px] font-medium transition-all cursor-pointer ${
                fitMode === 'width'
                  ? 'bg-[#ff6600] text-black shadow-sm'
                  : 'bg-white/5 hover:bg-white/15 text-slate-200'
              }`}
              title="Fit to container width"
            >
              Fit Width
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

          {/* Page Navigator: Prev | [ X / N ] | Next */}
          <div className="flex items-center gap-2 mx-auto sm:mx-0">
            <button
              onClick={handlePrevPage}
              disabled={currentPage <= 1 || isLoading}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed font-bold text-xs text-white transition-colors cursor-pointer"
              title="Previous Page (Left Arrow)"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Prev</span>
            </button>

            <form onSubmit={handlePageInputSubmit} className="flex items-center gap-1 px-2.5 py-1 bg-white/5 rounded-lg border border-white/10 font-mono text-xs text-slate-200">
              <span className="text-[10px] text-slate-400">Page</span>
              <input
                type="text"
                value={pageInput}
                onChange={handlePageInputChange}
                onBlur={handlePageInputSubmit}
                className="w-6 text-center font-bold text-[#ff8533] bg-transparent border-none outline-none p-0"
                aria-label="Current Page Number"
              />
              <span className="text-slate-400">of</span>
              <span className="font-bold text-white">{numPages}</span>
            </form>

            <button
              onClick={handleNextPage}
              disabled={currentPage >= numPages || isLoading}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#ff6600] hover:bg-[#e65c00] text-black disabled:opacity-30 disabled:cursor-not-allowed font-bold text-xs transition-colors cursor-pointer"
              title="Next Page (Right Arrow)"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Keyboard Hint */}
          <div className="hidden lg:flex items-center gap-2 text-[11px] text-slate-400">
            <span>Use <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono text-[10px]">←</kbd> <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono text-[10px]">→</kbd> to turn pages</span>
            <span>·</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono text-[10px]">Esc</kbd> to close</span>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

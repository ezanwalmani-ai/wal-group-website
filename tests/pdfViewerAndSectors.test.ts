import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import request from 'supertest';
import { app } from '../server';

if (typeof (Promise as any).try !== 'function') {
  (Promise as any).try = function (fn: any, ...args: any[]) {
    return new Promise((resolve) => resolve(fn(...args)));
  };
}

import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

describe('Website Design & Development UX Updates & Robust PDF System', () => {
  it('should have all 5 portfolio screenshots present and valid', () => {
    const portfolioDir = path.join(process.cwd(), 'public', 'images', 'portfolio');
    const requiredImages = [
      'ml-worldwide.webp',
      'southdekalb.webp',
      'alpine-medical.webp',
      'abhijobs.webp',
      'wal-groups.webp'
    ];

    for (const img of requiredImages) {
      const fullPath = path.join(portfolioDir, img);
      expect(fs.existsSync(fullPath)).toBe(true);
      const stat = fs.statSync(fullPath);
      expect(stat.size).toBeGreaterThan(1000);
    }
  });

  it('should parse and validate all 5 PDF brochures with exact page counts', async () => {
    const brochureDir = path.join(process.cwd(), 'public', 'brochures');
    const brochureSpecs = [
      { filename: 'wal-groups-website-services-brochure-2026.pdf', minPages: 18, name: 'Master Brochure' },
      { filename: 'wal-groups-starter-website-brochure.pdf', minPages: 10, name: 'Starter Website' },
      { filename: 'wal-groups-business-website-brochure.pdf', minPages: 10, name: 'Business Website' },
      { filename: 'wal-groups-growth-website-brochure.pdf', minPages: 10, name: 'Growth Website' },
      { filename: 'wal-groups-custom-website-brochure.pdf', minPages: 10, name: 'Custom Website' },
    ];

    for (const spec of brochureSpecs) {
      const fullPath = path.join(brochureDir, spec.filename);
      expect(fs.existsSync(fullPath)).toBe(true);

      const buffer = fs.readFileSync(fullPath);
      const data = new Uint8Array(buffer);
      const doc = await pdfjsLib.getDocument({ data }).promise;

      expect(doc.numPages).toBeGreaterThanOrEqual(spec.minPages);

      // Verify the first and last page can be retrieved and have valid non-zero dimensions
      const firstPage = await doc.getPage(1);
      const firstViewport = firstPage.getViewport({ scale: 1.0 });
      expect(firstViewport.width).toBeGreaterThan(300);
      expect(firstViewport.height).toBeGreaterThan(300);

      const lastPage = await doc.getPage(doc.numPages);
      const lastViewport = lastPage.getViewport({ scale: 1.0 });
      expect(lastViewport.width).toBeGreaterThan(300);
      expect(lastViewport.height).toBeGreaterThan(300);
    }
  });

  it('should serve all 5 PDFs via /brochures/:filename with correct headers for Chrome', async () => {
    const testBrochures = [
      'wal-groups-website-services-brochure-2026.pdf',
      'wal-groups-starter-website-brochure.pdf',
      'wal-groups-business-website-brochure.pdf',
      'wal-groups-growth-website-brochure.pdf',
      'wal-groups-custom-website-brochure.pdf',
    ];

    for (const filename of testBrochures) {
      const res = await request(app).get(`/brochures/${filename}`);
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toBe('application/pdf');
      expect(res.headers['accept-ranges']).toBe('bytes');
      expect(res.headers['x-content-type-options']).toBe('nosniff');
      expect(res.headers['content-disposition']).toContain('inline');
    }
  });

  it('should serve attachments with attachment disposition when download=1 is requested', async () => {
    const res = await request(app).get('/brochures/wal-groups-website-services-brochure-2026.pdf?download=1');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toBe('application/pdf');
    expect(res.headers['content-disposition']).toContain('attachment');
    expect(res.headers['content-disposition']).toContain('wal-groups-website-services-brochure-2026.pdf');
  });

  it('should have the PDF.js worker file in public/ with Promise.try polyfill', () => {
    const workerPath = path.join(process.cwd(), 'public', 'pdf.worker.min.mjs');
    expect(fs.existsSync(workerPath)).toBe(true);
    const content = fs.readFileSync(workerPath, 'utf-8');
    expect(content).toContain('Promise.try');
    expect(content.length).toBeGreaterThan(100000);
  });

  it('should contain the Custom Built · Tailored to Your Sector messaging and PDF modal hooks in WebsiteDesignPage', () => {
    const pageContent = fs.readFileSync(
      path.join(process.cwd(), 'src', 'pages', 'WebsiteDesignPage.tsx'),
      'utf-8'
    );
    expect(pageContent).toContain('CUSTOM BUILT · TAILORED TO YOUR SECTOR');
    expect(pageContent).toContain('Websites Engineered for Specific Business Requirements');
    expect(pageContent).toContain('PdfViewerModal');
    expect(pageContent).toContain('Detailed Package Comparison');
    expect(pageContent).toContain('50% Deposit / 50% On Approval');
  });
});

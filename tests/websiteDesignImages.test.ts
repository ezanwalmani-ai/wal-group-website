import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { getStaticPortfolioItemImages } from '../src/lib/imageOptimizer';

describe('Website Design & Development Production Image Assets', () => {
  const portfolioIds = [
    'ml-worldwide',
    'southdekalb',
    'alpine-medical',
    'abhijobs',
    'wal-groups',
  ];

  portfolioIds.forEach((id) => {
    it(`should have all required production-safe image variants for ${id}`, () => {
      const publicPortfolioDir = path.resolve(process.cwd(), 'public/images/portfolio');

      const expectedFiles = [
        `${id}.webp`,
        `${id}.jpg`,
        `${id}-400.webp`,
        `${id}-800.webp`,
        `${id}-1200.webp`,
      ];

      expectedFiles.forEach((filename) => {
        const filePath = path.join(publicPortfolioDir, filename);
        expect(fs.existsSync(filePath), `Missing asset: ${filename}`).toBe(true);

        const stats = fs.statSync(filePath);
        expect(stats.size, `Asset ${filename} should not be empty`).toBeGreaterThan(1000);
      });
    });

    it(`should generate direct static production URLs for ${id}`, () => {
      const variants = getStaticPortfolioItemImages(id);

      expect(variants.defaultWebp).toBe(`/images/portfolio/${id}-800.webp`);
      expect(variants.masterWebp).toBe(`/images/portfolio/${id}.webp`);
      expect(variants.fallbackJpg).toBe(`/images/portfolio/${id}.jpg`);
      expect(variants.webpSrcSet).toContain(`${id}-400.webp 400w`);
      expect(variants.webpSrcSet).toContain(`${id}-800.webp 800w`);
      expect(variants.webpSrcSet).toContain(`${id}-1200.webp 1200w`);

      // Ensure no reliance on dynamic API route
      expect(variants.defaultWebp).not.toContain('/api/optimize-image');
      expect(variants.webpSrcSet).not.toContain('/api/optimize-image');
    });
  });

  it('should have web-design-dev service background images present in public directory', () => {
    const serviceImages = [
      'web-design-dev.jpg',
      'web-design-dev.webp',
      'web-design-dev-400.webp',
      'web-design-dev-800.webp',
      'web-design-dev-400.avif',
      'web-design-dev-800.avif',
    ];

    const publicServicesDir = path.resolve(process.cwd(), 'public/images/services');

    serviceImages.forEach((filename) => {
      const filePath = path.join(publicServicesDir, filename);
      expect(fs.existsSync(filePath), `Missing service image: ${filename}`).toBe(true);
      expect(fs.statSync(filePath).size).toBeGreaterThan(500);
    });
  });
});

import fs from 'fs';
import path from 'path';

export interface ImageAssetInfo {
  filePath: string;
  relativePath: string;
  originalFormat: string;
  originalSizeBytes: number;
  originalSizeFormatted: string;
  isOptimized: boolean;
  hasWebpEquivalent: boolean;
  webpEquivalentPath?: string;
  webpSizeBytes?: number;
  webpSizeFormatted?: string;
  estimatedWebpSavingsPercent: number;
  recommendation: 'ALREADY_OPTIMIZED' | 'CONVERT_TO_WEBP' | 'REPLACE_WITH_WEBP_PICTURE';
  suggestedCodeRefactor: string;
}

export interface ImageAuditReport {
  scannedDirectory: string;
  totalAssets: number;
  nonOptimizedCount: number;
  optimizedCount: number;
  totalOriginalSizeBytes: number;
  totalOriginalSizeFormatted: string;
  potentialSavingsBytes: number;
  potentialSavingsFormatted: string;
  items: ImageAssetInfo[];
  batchConversionCommand: string;
}

/**
 * Format bytes to human readable string (KB, MB)
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Helper to identify non-optimized image assets and propose refactorings
 * to WebP format for improved browser delivery speeds.
 */
export function auditImageAssets(targetDir = path.resolve(process.cwd(), 'public')): ImageAuditReport {
  const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.tiff'];
  const modernExtensions = ['.webp', '.avif', '.svg'];
  const allImages: ImageAssetInfo[] = [];

  function walk(currentDir: string) {
    if (!fs.existsSync(currentDir)) return;
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (imageExtensions.includes(ext) || modernExtensions.includes(ext)) {
          const stats = fs.statSync(fullPath);
          const relativePath = path.relative(targetDir, fullPath).replace(/\\/g, '/');
          const isModern = modernExtensions.includes(ext);

          // Check if a WebP equivalent exists
          const webpName = entry.name.replace(/\.[^.]+$/, '.webp');
          const webpFullPath = path.join(currentDir, webpName);
          const hasWebp = fs.existsSync(webpFullPath);
          let webpSizeBytes: number | undefined;

          if (hasWebp) {
            webpSizeBytes = fs.statSync(webpFullPath).size;
          }

          // Estimated savings if converted to WebP (average 60% for PNG / 35% for JPEG)
          let estimatedRatio = 0.5;
          if (ext === '.png') estimatedRatio = 0.4;
          if (ext === '.jpg' || ext === '.jpeg') estimatedRatio = 0.65;

          const estimatedWebpSavings = isModern 
            ? 0 
            : Math.max(0, Math.round(stats.size * (1 - estimatedRatio)));
          const estimatedPercent = isModern ? 0 : Math.round((1 - estimatedRatio) * 100);

          let recommendation: ImageAssetInfo['recommendation'] = 'ALREADY_OPTIMIZED';
          let suggestedCodeRefactor = '// Asset is already optimized with modern format';

          if (!isModern) {
            const webpWebPath = '/' + relativePath.replace(/\.[^.]+$/, '.webp');
            const originalWebPath = '/' + relativePath;

            if (hasWebp) {
              recommendation = 'REPLACE_WITH_WEBP_PICTURE';
              suggestedCodeRefactor = `<picture>
  <source srcSet="${webpWebPath}" type="image/webp" />
  <img 
    src="${originalWebPath}" 
    alt="Asset description" 
    loading="lazy" 
    decoding="async" 
  />
</picture>`;
            } else {
              recommendation = 'CONVERT_TO_WEBP';
              suggestedCodeRefactor = `// 1. Run conversion: npx tsx scripts/generate-webp-assets.ts
// 2. Use getOptimizedImageUrl or <picture> tag:
<img 
  src={getOptimizedImageUrl('${originalWebPath}', 800, 80, 'webp')} 
  alt="Asset description" 
  loading="lazy" 
  decoding="async" 
/>`;
            }
          }

          allImages.push({
            filePath: fullPath,
            relativePath,
            originalFormat: ext.replace('.', '').toUpperCase(),
            originalSizeBytes: stats.size,
            originalSizeFormatted: formatBytes(stats.size),
            isOptimized: isModern,
            hasWebpEquivalent: hasWebp,
            webpEquivalentPath: hasWebp ? webpFullPath : undefined,
            webpSizeBytes,
            webpSizeFormatted: webpSizeBytes ? formatBytes(webpSizeBytes) : undefined,
            estimatedWebpSavingsPercent: estimatedPercent,
            recommendation,
            suggestedCodeRefactor,
          });
        }
      }
    }
  }

  walk(targetDir);

  const nonOptimized = allImages.filter(img => !img.isOptimized);
  const totalOriginalSizeBytes = allImages.reduce((acc, curr) => acc + curr.originalSizeBytes, 0);
  const potentialSavingsBytes = nonOptimized.reduce((acc, curr) => {
    if (curr.webpSizeBytes && curr.webpSizeBytes < curr.originalSizeBytes) {
      return acc + (curr.originalSizeBytes - curr.webpSizeBytes);
    }
    return acc + Math.round(curr.originalSizeBytes * 0.5);
  }, 0);

  return {
    scannedDirectory: targetDir,
    totalAssets: allImages.length,
    nonOptimizedCount: nonOptimized.length,
    optimizedCount: allImages.length - nonOptimized.length,
    totalOriginalSizeBytes,
    totalOriginalSizeFormatted: formatBytes(totalOriginalSizeBytes),
    potentialSavingsBytes,
    potentialSavingsFormatted: formatBytes(potentialSavingsBytes),
    items: allImages,
    batchConversionCommand: 'npx tsx scripts/generate-webp-assets.ts',
  };
}

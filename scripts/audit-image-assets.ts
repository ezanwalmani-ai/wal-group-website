import { auditImageAssets } from '../src/utils/imageAssetAudit';

async function run() {
  console.log('🔍 Auditing Image Assets in public/ ...\n');
  const report = auditImageAssets();

  console.log('========================================');
  console.log('📊 IMAGE ASSET OPTIMIZATION AUDIT REPORT');
  console.log('========================================');
  console.log(`Scanned Directory:           ${report.scannedDirectory}`);
  console.log(`Total Image Assets Found:     ${report.totalAssets}`);
  console.log(`Modern/Optimized Assets:     ${report.optimizedCount}`);
  console.log(`Legacy/Non-Optimized Assets: ${report.nonOptimizedCount}`);
  console.log(`Total Payload Size:          ${report.totalOriginalSizeFormatted}`);
  console.log(`Estimated Bandwidth Savings: ${report.potentialSavingsFormatted}`);
  console.log('========================================\n');

  const nonOptimized = report.items.filter(item => !item.isOptimized);
  if (nonOptimized.length === 0) {
    console.log('✅ All image assets are already optimized with modern WebP/AVIF formats!');
    return;
  }

  console.log('⚠️  NON-OPTIMIZED ASSETS & REFACTOR PROPOSALS:');
  console.log('--------------------------------------------------');
  for (const item of nonOptimized) {
    console.log(`• Asset: ${item.relativePath}`);
    console.log(`  Current Format: ${item.originalFormat} (${item.originalSizeFormatted})`);
    if (item.hasWebpEquivalent) {
      console.log(`  WebP Equivalent: Exists (${item.webpSizeFormatted}) - Ready for <picture> refactor!`);
      const savings = item.originalSizeBytes - (item.webpSizeBytes || 0);
      const pct = Math.round((savings / item.originalSizeBytes) * 100);
      console.log(`  Actual Size Reduction: ${pct}% payload reduction`);
    } else {
      console.log(`  Target Format: WebP (Est. ${item.estimatedWebpSavingsPercent}% reduction)`);
    }
    console.log('  Proposed Refactor:');
    console.log(item.suggestedCodeRefactor.split('\n').map(line => '    ' + line).join('\n'));
    console.log('--------------------------------------------------');
  }

  console.log(`\n🚀 To run batch conversion, execute:\n   ${report.batchConversionCommand}\n`);
}

run().catch(console.error);

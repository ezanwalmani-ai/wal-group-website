import { describe, it, expect } from 'vitest';
import { TextRoll } from '../src/components/core/text-roll';
import { TextRoll as TextRollRoot } from '../components/core/text-roll';
import fs from 'fs';
import path from 'path';

describe('TextRoll Component & WAL GROUPS Headline Integration', () => {
  it('should export TextRoll component properly from src/components/core/text-roll', () => {
    expect(TextRoll).toBeDefined();
    expect(typeof TextRoll).toBe('function');
  });

  it('should export TextRoll component properly from root components/core/text-roll', () => {
    expect(TextRollRoot).toBeDefined();
    expect(typeof TextRollRoot).toBe('function');
    expect(TextRollRoot).toBe(TextRoll);
  });

  it('should verify HomePage uses TextRoll for "We Run the Backend. So You Can Run the Business."', () => {
    const homePageCode = fs.readFileSync(path.resolve(__dirname, '../src/pages/HomePage.tsx'), 'utf-8');
    
    // Check import
    expect(homePageCode).toMatch(/import\s+{\s*TextRoll\s*}\s+from\s+['"]@\/components\/core\/text-roll['"]/);
    
    // Check TextRoll usage with exact wording
    expect(homePageCode).toContain('We Run the Backend. So You Can Run the Business.');
    expect(homePageCode).toMatch(/<TextRoll[^>]*>\s*We Run the Backend\. So You Can Run the Business\.\s*<\/TextRoll>/);
    
    // Verify placeholder text is not used
    expect(homePageCode).not.toContain('motion-primitives');
  });

  it('should verify AboutPage uses TextRoll for "Relationships First. Business Follows."', () => {
    const aboutPageCode = fs.readFileSync(path.resolve(__dirname, '../src/pages/AboutPage.tsx'), 'utf-8');
    
    // Check import
    expect(aboutPageCode).toMatch(/import\s+{\s*TextRoll\s*}\s+from\s+['"]@\/components\/core\/text-roll['"]/);
    
    // Check TextRoll usage with exact wording
    expect(aboutPageCode).toContain('Relationships First. Business Follows.');
    expect(aboutPageCode).toMatch(/<TextRoll[^>]*>\s*Relationships First\. Business Follows\.\s*<\/TextRoll>/);
    
    // Verify placeholder text is not used
    expect(aboutPageCode).not.toContain('motion-primitives');
  });
});

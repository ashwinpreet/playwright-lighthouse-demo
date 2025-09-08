import { test, expect } from '@playwright/test';
import { chromium } from 'playwright';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure the base URL for your application
const baseURL = 'http://localhost:3000';

// Lighthouse configuration
const thresholds = {
  performance: 0,
  accessibility: 0,
  'best-practices': 0,
  seo: 0,
  pwa: 0,
};

// Test suite for Fast Gallery
test.describe('Fast Gallery Performance', () => {
  test('should load the Fast Gallery', async ({ page }) => {
    // Navigate to the page
    await page.goto(baseURL);
    
    // Wait for the gallery to be visible
    await expect(page.locator('h1:has-text("Optimized Gallery")')).toBeVisible();
    
    // Take a screenshot for visual confirmation
    await page.screenshot({ path: 'test-results/fast-gallery.png' });
    
    // Basic performance metrics
    const metrics = await page.evaluate(() => {
      const { timing } = performance;
      return {
        dns: timing.domainLookupEnd - timing.domainLookupStart,
        tcp: timing.connectEnd - timing.connectStart,
        ttfb: timing.responseStart - timing.requestStart,
        domLoad: timing.domComplete - timing.domLoading,
        total: timing.loadEventEnd - timing.navigationStart,
      };
    });
    
    console.log('\nFast Gallery Performance Metrics:');
    console.log('--------------------------------');
    console.log(`DNS lookup time: ${metrics.dns}ms`);
    console.log(`TCP handshake time: ${metrics.tcp}ms`);
    console.log(`Time to First Byte (TTFB): ${metrics.ttfb}ms`);
    console.log(`DOM load time: ${metrics.domLoad}ms`);
    console.log(`Total page load time: ${metrics.total}ms`);
    console.log('--------------------------------\n');
  });
});

// Test suite for Slow Gallery (commented out by default)
test.describe('Slow Gallery Performance', () => {
  test.skip('should load the Slow Gallery', async ({ page }) => {
    // To test the slow gallery, uncomment this test and comment out the Fast Gallery test
    // Also update the baseURL if needed
    await page.goto(baseURL);
    await expect(page.locator('h1:has-text("Slow Loading Gallery")')).toBeVisible();
    
    const metrics = await page.evaluate(() => ({
      timing: performance.timing
    }));
    
    console.log('\nSlow Gallery Performance Metrics:');
    console.log('--------------------------------');
    console.log(`Total page load time: ${metrics.timing.loadEventEnd - metrics.timing.navigationStart}ms`);
    console.log('--------------------------------\n');
  });
});

// Run Lighthouse as a separate process
async function runLighthouse() {
  return new Promise((resolve, reject) => {
    const lighthouse = spawn('npx', [
      'lighthouse',
      baseURL,
      '--output=html',
      '--output-path=./lighthouse-results.html',
      '--chrome-flags="--headless"',
      '--throttling-method=simulate',
      '--throttling.rttMs=150',
      '--throttling.throughputKbps=1638.4',
      '--throttling.cpuSlowdownMultiplier=4'
    ]);

    lighthouse.on('close', (code) => {
      if (code === 0) {
        console.log('Lighthouse audit completed successfully');
        resolve();
      } else {
        reject(new Error(`Lighthouse exited with code ${code}`));
      }
    });
  });
}

// Run Lighthouse after all tests
// Comment this out if you don't want to run Lighthouse automatically
test.afterAll(async () => {
  console.log('\nRunning Lighthouse audit...');
  try {
    await runLighthouse();
  } catch (error) {
    console.error('Lighthouse audit failed:', error);
  }
});

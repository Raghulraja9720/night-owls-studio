import { validateImageUrl, detectWebpageShareLink, validateGalleryUrls } from '../src/lib/imageUrlUtils.js';

async function checkNetworkResponse(url) {
  try {
    const res = await fetch(url, { method: 'HEAD' });
    const contentType = res.headers.get('content-type') || 'unknown';
    return {
      status: res.status,
      ok: res.ok,
      contentType,
      isImageContentType: contentType.startsWith('image/')
    };
  } catch (err) {
    return {
      status: 0,
      ok: false,
      error: err.message
    };
  }
}

async function runTests() {
  console.log('====================================================');
  console.log(' NIGHT OWLS STUDIO — URL-ONLY IMAGE MANAGEMENT TESTS');
  console.log('====================================================\n');

  // TEST 1: Working Public Image URLs
  console.log('--- TEST 1: Working Public Image URLs ---');
  const validUrls = [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c', // Extensionless
    'https://raw.githubusercontent.com/Raghulraja9720/night-owls-studio/main/public/favicon.ico'
  ];

  for (const url of validUrls) {
    const val = validateImageUrl(url);
    const net = await checkNetworkResponse(url);
    console.log(`[URL] ${url}`);
    console.log(`  -> Syntax Valid: ${val.isValid}`);
    console.log(`  -> Is Share Page: ${val.isWebpageShareLink}`);
    console.log(`  -> HTTP Status: ${net.status} (Content-Type: ${net.contentType})`);
    console.log(`  -> Is Image Stream: ${net.isImageContentType}\n`);
  }

  // TEST 2: Invalid URLs
  console.log('--- TEST 2: Invalid URLs ---');
  const invalidUrls = [
    'not-a-valid-url',
    'javascript:alert("exploit")',
    'ftp://files.example.com/photo.png',
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII='
  ];

  for (const url of invalidUrls) {
    const val = validateImageUrl(url);
    console.log(`[URL] ${url.slice(0, 45)}...`);
    console.log(`  -> Syntax Valid: ${val.isValid}`);
    console.log(`  -> Error Message: "${val.error}"\n`);
  }

  // TEST 3: Share-Page URLs (Webpage HTML vs Image Stream)
  console.log('--- TEST 3: Share-Page URLs ---');
  const shareUrls = [
    'https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/view?usp=sharing',
    'https://www.dropbox.com/s/abcdef12345/design_mockup.png?dl=0',
    'https://imgur.com/gallery/aBcDeFg',
    'https://www.pinterest.com/pin/123456789/'
  ];

  for (const url of shareUrls) {
    const val = validateImageUrl(url);
    const net = await checkNetworkResponse(url);
    console.log(`[URL] ${url}`);
    console.log(`  -> Syntax Valid: ${val.isValid}`);
    console.log(`  -> Is Share Page Flagged: ${val.isWebpageShareLink}`);
    console.log(`  -> Detected Service: ${val.shareService}`);
    console.log(`  -> Share Advice: "${val.shareAdvice}"`);
    console.log(`  -> Direct Suggestion: ${val.directUrlSuggestion || 'N/A'}`);
    console.log(`  -> Actual HTTP Content-Type: ${net.contentType} (Is Image Stream: ${net.isImageContentType})\n`);
  }

  // TEST 4: Multi-line Gallery Validation
  console.log('--- TEST 4: Multi-line Gallery Input Validation ---');
  const galleryInput = [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format',
    'invalid-line-example',
    'https://drive.google.com/file/d/12345/view',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71'
  ].join('\n');

  const galleryRes = validateGalleryUrls(galleryInput);
  console.log(`  -> Total Valid URLs extracted: ${galleryRes.validUrls.length}`);
  console.log(`  -> Has Errors: ${galleryRes.hasErrors}`);
  console.log(`  -> Line Breakdown:`);
  galleryRes.lineResults.forEach(lr => {
    console.log(`     Line ${lr.line} (${lr.raw}): Valid=${lr.isValid}, SharePage=${lr.isWebpageShareLink}, Error=${lr.error || 'None'}`);
  });

  console.log('\n====================================================');
  console.log(' ALL AUTOMATED TESTS COMPLETED');
  console.log('====================================================');
}

runTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});

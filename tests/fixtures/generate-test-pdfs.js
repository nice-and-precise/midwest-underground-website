/**
 * Generate Test PDF Fixtures
 * Creates minimal PDF files for E2E testing
 */

const fs = require('fs');
const path = require('path');

const FIXTURES_DIR = path.join(__dirname, 'pdfs');

// Ensure fixtures directory exists
if (!fs.existsSync(FIXTURES_DIR)) {
  fs.mkdirSync(FIXTURES_DIR, { recursive: true });
}

/**
 * Minimal PDF file (single page, 1 KB)
 * This is a valid PDF 1.4 structure
 */
const createMinimalPDF = () => {
  return `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj
2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj
3 0 obj
<<
/Type /Page
/Parent 2 0 R
/Resources <<
/Font <<
/F1 4 0 R
>>
>>
/MediaBox [0 0 612 792]
/Contents 5 0 R
>>
endobj
4 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj
5 0 obj
<<
/Length 44
>>
stream
BT
/F1 24 Tf
100 700 Td
(Test PDF) Tj
ET
endstream
endobj
xref
0 6
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000262 00000 n
0000000341 00000 n
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
432
%%EOF`;
};

/**
 * Multi-page PDF (3 pages, ~2 KB)
 */
const createMultiPagePDF = () => {
  return `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj
2 0 obj
<<
/Type /Pages
/Kids [3 0 R 4 0 R 5 0 R]
/Count 3
>>
endobj
3 0 obj
<<
/Type /Page
/Parent 2 0 R
/Resources <<
/Font <<
/F1 6 0 R
>>
>>
/MediaBox [0 0 612 792]
/Contents 7 0 R
>>
endobj
4 0 obj
<<
/Type /Page
/Parent 2 0 R
/Resources <<
/Font <<
/F1 6 0 R
>>
>>
/MediaBox [0 0 612 792]
/Contents 8 0 R
>>
endobj
5 0 obj
<<
/Type /Page
/Parent 2 0 R
/Resources <<
/Font <<
/F1 6 0 R
>>
>>
/MediaBox [0 0 612 792]
/Contents 9 0 R
>>
endobj
6 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj
7 0 obj
<<
/Length 48
>>
stream
BT
/F1 24 Tf
100 700 Td
(Page 1 of 3) Tj
ET
endstream
endobj
8 0 obj
<<
/Length 48
>>
stream
BT
/F1 24 Tf
100 700 Td
(Page 2 of 3) Tj
ET
endstream
endobj
9 0 obj
<<
/Length 48
>>
stream
BT
/F1 24 Tf
100 700 Td
(Page 3 of 3) Tj
ET
endstream
endobj
xref
0 10
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000125 00000 n
0000000272 00000 n
0000000419 00000 n
0000000566 00000 n
0000000645 00000 n
0000000741 00000 n
0000000837 00000 n
trailer
<<
/Size 10
/Root 1 0 R
>>
startxref
933
%%EOF`;
};

/**
 * Large PDF (5 pages, ~4 KB)
 */
const createLargePDF = () => {
  return `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj
2 0 obj
<<
/Type /Pages
/Kids [3 0 R 4 0 R 5 0 R 6 0 R 7 0 R]
/Count 5
>>
endobj
3 0 obj
<<
/Type /Page
/Parent 2 0 R
/Resources <<
/Font <<
/F1 8 0 R
>>
>>
/MediaBox [0 0 612 792]
/Contents 9 0 R
>>
endobj
4 0 obj
<<
/Type /Page
/Parent 2 0 R
/Resources <<
/Font <<
/F1 8 0 R
>>
>>
/MediaBox [0 0 612 792]
/Contents 10 0 R
>>
endobj
5 0 obj
<<
/Type /Page
/Parent 2 0 R
/Resources <<
/Font <<
/F1 8 0 R
>>
>>
/MediaBox [0 0 612 792]
/Contents 11 0 R
>>
endobj
6 0 obj
<<
/Type /Page
/Parent 2 0 R
/Resources <<
/Font <<
/F1 8 0 R
>>
>>
/MediaBox [0 0 612 792]
/Contents 12 0 R
>>
endobj
7 0 obj
<<
/Type /Page
/Parent 2 0 R
/Resources <<
/Font <<
/F1 8 0 R
>>
>>
/MediaBox [0 0 612 792]
/Contents 13 0 R
>>
endobj
8 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj
9 0 obj
<<
/Length 88
>>
stream
BT
/F1 24 Tf
100 700 Td
(Construction Plan) Tj
0 -40 Td
(Page 1 of 5) Tj
ET
endstream
endobj
10 0 obj
<<
/Length 48
>>
stream
BT
/F1 24 Tf
100 700 Td
(Page 2 of 5) Tj
ET
endstream
endobj
11 0 obj
<<
/Length 48
>>
stream
BT
/F1 24 Tf
100 700 Td
(Page 3 of 5) Tj
ET
endstream
endobj
12 0 obj
<<
/Length 48
>>
stream
BT
/F1 24 Tf
100 700 Td
(Page 4 of 5) Tj
ET
endstream
endobj
13 0 obj
<<
/Length 48
>>
stream
BT
/F1 24 Tf
100 700 Td
(Page 5 of 5) Tj
ET
endstream
endobj
xref
0 14
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000145 00000 n
0000000292 00000 n
0000000440 00000 n
0000000588 00000 n
0000000736 00000 n
0000000884 00000 n
0000000963 00000 n
0000001099 00000 n
0000001195 00000 n
0000001291 00000 n
0000001387 00000 n
trailer
<<
/Size 14
/Root 1 0 R
>>
startxref
1483
%%EOF`;
};

/**
 * Invalid file (not a PDF)
 */
const createInvalidFile = () => {
  return 'This is not a valid PDF file. It is plain text.';
};

/**
 * Corrupted PDF (invalid structure)
 */
const createCorruptedPDF = () => {
  return `%PDF-1.4
CORRUPTED CONTENT
This PDF file is intentionally corrupted for testing error handling.
%%EOF`;
};

// Generate all test fixtures
const fixtures = [
  { name: 'small-1-page.pdf', content: createMinimalPDF() },
  { name: 'medium-3-pages.pdf', content: createMultiPagePDF() },
  { name: 'large-5-pages.pdf', content: createLargePDF() },
  { name: 'invalid.txt', content: createInvalidFile() },
  { name: 'corrupted.pdf', content: createCorruptedPDF() }
];

console.log('📦 Generating PDF test fixtures...\n');

fixtures.forEach(({ name, content }) => {
  const filePath = path.join(FIXTURES_DIR, name);
  fs.writeFileSync(filePath, content, 'utf8');
  const size = fs.statSync(filePath).size;
  console.log(`✅ Created: ${name} (${size} bytes)`);
});

console.log('\n✨ All PDF test fixtures generated successfully!');
console.log(`📁 Location: ${FIXTURES_DIR}`);

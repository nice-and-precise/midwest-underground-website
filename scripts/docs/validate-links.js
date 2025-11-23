#!/usr/bin/env node
/**
 * validate-links.js - Validate internal links in markdown files
 * Finds all markdown files and checks that relative links point to existing files
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// Directories to exclude from search
const EXCLUDE_DIRS = [
  'node_modules',
  '.git',
  '.next',
  'out',
  'dist',
  'build',
  '.cache',
  'coverage',
  '.vercel',
  '.turbo',
];

// Get project root
const PROJECT_ROOT = path.resolve(__dirname, '..', '..');

/**
 * Find all markdown files in directory
 */
function findMarkdownFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      const dirName = path.basename(filePath);
      if (!EXCLUDE_DIRS.includes(dirName)) {
        findMarkdownFiles(filePath, fileList);
      }
    } else if (file.endsWith('.md')) {
      fileList.push(filePath);
    }
  }

  return fileList;
}

/**
 * Extract markdown links from content
 * Matches [text](url) format
 */
function extractLinks(content) {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const links = [];
  let match;

  while ((match = linkRegex.exec(content)) !== null) {
    links.push({
      text: match[1],
      url: match[2],
      position: match.index,
    });
  }

  return links;
}

/**
 * Get line number from content position
 */
function getLineNumber(content, position) {
  return content.substring(0, position).split('\n').length;
}

/**
 * Check if a link is relative (not http://, https://, mailto:, #anchor)
 */
function isRelativeLink(url) {
  return !url.startsWith('http://') &&
         !url.startsWith('https://') &&
         !url.startsWith('mailto:') &&
         !url.startsWith('#') &&
         !url.startsWith('//');
}

/**
 * Validate that a relative link points to an existing file
 */
function validateRelativeLink(markdownFilePath, linkUrl) {
  // Remove anchor/fragment if present
  const urlWithoutAnchor = linkUrl.split('#')[0];

  // Skip if just an anchor
  if (!urlWithoutAnchor) {
    return { valid: true };
  }

  // Decode URL encoding
  const decodedUrl = decodeURIComponent(urlWithoutAnchor);

  // Resolve relative to the markdown file's directory
  const markdownDir = path.dirname(markdownFilePath);
  const targetPath = path.resolve(markdownDir, decodedUrl);

  // Check if file or directory exists
  const exists = fs.existsSync(targetPath);

  return {
    valid: exists,
    resolvedPath: targetPath,
  };
}

/**
 * Main validation function
 */
function validateLinks() {
  console.log(`${colors.blue}========================================${colors.reset}`);
  console.log(`${colors.blue}Link Validation Report${colors.reset}`);
  console.log(`${colors.blue}========================================${colors.reset}`);
  console.log();
  console.log(`Project Root: ${PROJECT_ROOT}`);
  console.log(`Generated: ${new Date().toISOString().replace('T', ' ').substring(0, 19)}`);
  console.log();

  // Find all markdown files
  console.log(`${colors.cyan}Scanning for markdown files...${colors.reset}`);
  const markdownFiles = findMarkdownFiles(PROJECT_ROOT);
  console.log(`Found ${markdownFiles.length} markdown files`);
  console.log();

  // Track statistics
  let totalLinks = 0;
  let totalRelativeLinks = 0;
  let brokenLinks = [];

  // Process each markdown file
  for (const filePath of markdownFiles) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const links = extractLinks(content);
    const relativePath = path.relative(PROJECT_ROOT, filePath);

    let fileBrokenLinks = [];

    for (const link of links) {
      totalLinks++;

      if (isRelativeLink(link.url)) {
        totalRelativeLinks++;

        const validation = validateRelativeLink(filePath, link.url);

        if (!validation.valid) {
          const lineNumber = getLineNumber(content, link.position);
          fileBrokenLinks.push({
            text: link.text,
            url: link.url,
            line: lineNumber,
            resolvedPath: validation.resolvedPath,
          });
        }
      }
    }

    if (fileBrokenLinks.length > 0) {
      brokenLinks.push({
        file: relativePath,
        links: fileBrokenLinks,
      });
    }
  }

  // Report results
  console.log(`${colors.blue}========================================${colors.reset}`);
  console.log(`${colors.blue}Results${colors.reset}`);
  console.log(`${colors.blue}========================================${colors.reset}`);
  console.log();

  if (brokenLinks.length === 0) {
    console.log(`${colors.green}✓ All links valid!${colors.reset}`);
    console.log();
    console.log(`${colors.cyan}Statistics:${colors.reset}`);
    console.log(`  Total links: ${totalLinks}`);
    console.log(`  Relative links: ${totalRelativeLinks}`);
    console.log(`  External links: ${totalLinks - totalRelativeLinks}`);
    console.log(`  Broken links: 0`);
    console.log();
    return 0;
  }

  // Report broken links
  console.log(`${colors.red}✗ Found ${brokenLinks.length} files with broken links:${colors.reset}`);
  console.log();

  let totalBroken = 0;

  for (const file of brokenLinks) {
    console.log(`${colors.yellow}${file.file}${colors.reset}`);

    for (const link of file.links) {
      totalBroken++;
      console.log(`  ${colors.red}✗${colors.reset} Line ${link.line}: [${link.text}](${link.url})`);
      console.log(`    Target: ${path.relative(PROJECT_ROOT, link.resolvedPath)}`);
    }

    console.log();
  }

  console.log(`${colors.cyan}Statistics:${colors.reset}`);
  console.log(`  Total links: ${totalLinks}`);
  console.log(`  Relative links: ${totalRelativeLinks}`);
  console.log(`  External links: ${totalLinks - totalRelativeLinks}`);
  console.log(`  ${colors.red}Broken links: ${totalBroken}${colors.reset}`);
  console.log();

  return 1;
}

// Run validation
const exitCode = validateLinks();
process.exit(exitCode);

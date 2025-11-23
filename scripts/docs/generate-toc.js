#!/usr/bin/env node
/**
 * generate-toc.js - Generate and insert table of contents for large markdown files
 * Scans docs/ for markdown files >300 lines and adds/updates TOC
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

// Configuration
const MIN_LINES = 300;
const DOCS_DIR = path.resolve(__dirname, '..', '..', 'docs');
const TOC_MARKER_START = '<!-- TOC -->';
const TOC_MARKER_END = '<!-- /TOC -->';

/**
 * Find all markdown files in docs/ directory
 */
function findMarkdownFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) {
    return fileList;
  }

  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findMarkdownFiles(filePath, fileList);
    } else if (file.endsWith('.md')) {
      fileList.push(filePath);
    }
  }

  return fileList;
}

/**
 * Count lines in a file
 */
function countLines(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  return content.split('\n').length;
}

/**
 * Extract headings from markdown content
 */
function extractHeadings(content) {
  const lines = content.split('\n');
  const headings = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const match = line.match(/^(#{1,6})\s+(.+)$/);

    if (match) {
      const level = match[1].length;
      const text = match[2]
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links
        .replace(/`([^`]+)`/g, '$1') // Remove code formatting
        .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold
        .replace(/\*([^*]+)\*/g, '$1') // Remove italic
        .trim();

      headings.push({
        level,
        text,
        line: i + 1,
      });
    }
  }

  return headings;
}

/**
 * Generate slug from heading text
 */
function generateSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Generate table of contents from headings
 */
function generateTOC(headings) {
  if (headings.length === 0) {
    return null;
  }

  // Skip the first heading (assumed to be document title)
  const tocHeadings = headings.slice(1);

  if (tocHeadings.length === 0) {
    return null;
  }

  // Find minimum heading level for baseline
  const minLevel = Math.min(...tocHeadings.map(h => h.level));

  const lines = [TOC_MARKER_START, '', '## Table of Contents', ''];

  for (const heading of tocHeadings) {
    const indent = '  '.repeat(heading.level - minLevel);
    const slug = generateSlug(heading.text);
    const link = `[${heading.text}](#${slug})`;
    lines.push(`${indent}- ${link}`);
  }

  lines.push('', TOC_MARKER_END, '');

  return lines.join('\n');
}

/**
 * Check if TOC already exists in content
 */
function hasTOC(content) {
  return content.includes(TOC_MARKER_START) && content.includes(TOC_MARKER_END);
}

/**
 * Remove existing TOC from content
 */
function removeTOC(content) {
  const startIndex = content.indexOf(TOC_MARKER_START);
  const endIndex = content.indexOf(TOC_MARKER_END);

  if (startIndex === -1 || endIndex === -1) {
    return content;
  }

  const before = content.substring(0, startIndex);
  const after = content.substring(endIndex + TOC_MARKER_END.length);

  return (before + after).replace(/\n{3,}/g, '\n\n'); // Clean up extra newlines
}

/**
 * Insert TOC after first heading
 */
function insertTOC(content, toc) {
  const lines = content.split('\n');
  let insertIndex = -1;

  // Find first heading
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].match(/^#\s+.+$/)) {
      insertIndex = i + 1;
      break;
    }
  }

  if (insertIndex === -1) {
    // No heading found, insert at top
    return toc + '\n' + content;
  }

  // Insert after first heading
  const before = lines.slice(0, insertIndex).join('\n');
  const after = lines.slice(insertIndex).join('\n');

  return before + '\n\n' + toc + '\n' + after;
}

/**
 * Process a single markdown file
 */
function processFile(filePath, dryRun = false) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const headings = extractHeadings(content);
  const toc = generateTOC(headings);

  if (!toc) {
    return {
      processed: false,
      reason: 'Not enough headings for TOC',
    };
  }

  // Remove existing TOC if present
  let newContent = removeTOC(content);

  // Insert new TOC
  newContent = insertTOC(newContent, toc);

  // Check if content changed
  if (newContent === content) {
    return {
      processed: false,
      reason: 'TOC already up to date',
    };
  }

  // Write file if not dry run
  if (!dryRun) {
    fs.writeFileSync(filePath, newContent, 'utf-8');
  }

  return {
    processed: true,
    hadTOC: hasTOC(content),
    headingCount: headings.length - 1, // Exclude document title
  };
}

/**
 * Main function
 */
function main() {
  const dryRun = process.argv.includes('--dry-run');

  console.log(`${colors.blue}========================================${colors.reset}`);
  console.log(`${colors.blue}Table of Contents Generator${colors.reset}`);
  console.log(`${colors.blue}========================================${colors.reset}`);
  console.log();
  console.log(`Docs Directory: ${DOCS_DIR}`);
  console.log(`Min Lines: ${MIN_LINES}`);
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'WRITE'}`);
  console.log();

  // Find all markdown files
  console.log(`${colors.cyan}Scanning for markdown files...${colors.reset}`);
  const allFiles = findMarkdownFiles(DOCS_DIR);
  console.log(`Found ${allFiles.length} markdown files in docs/`);
  console.log();

  // Filter files by line count
  const largeFiles = allFiles.filter(file => countLines(file) >= MIN_LINES);
  console.log(`${colors.cyan}Found ${largeFiles.length} files with >=${MIN_LINES} lines${colors.reset}`);
  console.log();

  if (largeFiles.length === 0) {
    console.log(`${colors.green}✓ No files require TOC generation${colors.reset}`);
    return 0;
  }

  // Process each file
  console.log(`${colors.cyan}Processing files...${colors.reset}`);
  console.log();

  const results = {
    created: [],
    updated: [],
    skipped: [],
  };

  for (const filePath of largeFiles) {
    const relativePath = path.relative(DOCS_DIR, filePath);
    const lines = countLines(filePath);

    try {
      const result = processFile(filePath, dryRun);

      if (result.processed) {
        if (result.hadTOC) {
          results.updated.push({ path: relativePath, lines, headings: result.headingCount });
          console.log(`${colors.yellow}↻${colors.reset} ${relativePath} (${lines} lines, ${result.headingCount} headings) - TOC updated`);
        } else {
          results.created.push({ path: relativePath, lines, headings: result.headingCount });
          console.log(`${colors.green}✓${colors.reset} ${relativePath} (${lines} lines, ${result.headingCount} headings) - TOC created`);
        }
      } else {
        results.skipped.push({ path: relativePath, lines, reason: result.reason });
        console.log(`${colors.blue}−${colors.reset} ${relativePath} (${lines} lines) - ${result.reason}`);
      }
    } catch (error) {
      console.log(`${colors.red}✗${colors.reset} ${relativePath} - Error: ${error.message}`);
    }
  }

  // Summary
  console.log();
  console.log(`${colors.blue}========================================${colors.reset}`);
  console.log(`${colors.blue}Summary${colors.reset}`);
  console.log(`${colors.blue}========================================${colors.reset}`);
  console.log();

  if (dryRun) {
    console.log(`${colors.yellow}DRY RUN - No files were modified${colors.reset}`);
    console.log();
  }

  console.log(`${colors.green}TOC Created: ${results.created.length}${colors.reset}`);
  console.log(`${colors.yellow}TOC Updated: ${results.updated.length}${colors.reset}`);
  console.log(`${colors.blue}Skipped: ${results.skipped.length}${colors.reset}`);
  console.log();

  if (results.created.length > 0 || results.updated.length > 0) {
    console.log(`${colors.green}✓ TOC generation complete${colors.reset}`);
  } else {
    console.log(`${colors.green}✓ All TOCs are up to date${colors.reset}`);
  }

  return 0;
}

// Run main function
const exitCode = main();
process.exit(exitCode);

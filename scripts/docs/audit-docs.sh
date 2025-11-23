#!/usr/bin/env bash
# audit-docs.sh - Audit all markdown documentation files
# Reports file statistics including path, size, lines, and last modified date

set -euo pipefail

# Colors for output
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly NC='\033[0m' # No Color

# Get project root (assuming script is in scripts/docs/)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Documentation Audit Report${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo "Project Root: ${PROJECT_ROOT}"
echo "Generated: $(date '+%Y-%m-%d %H:%M:%S')"
echo ""

# Function to get file stats
get_file_stats() {
    local file="$1"
    local location="$2"
    local rel_path="${file#$PROJECT_ROOT/}"

    # Get file size
    if [[ "$OSTYPE" == "darwin"* ]] || [[ "$OSTYPE" == "linux-gnu"* ]]; then
        size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null || echo "0")
        modified=$(stat -f%Sm -t "%Y-%m-%d %H:%M:%S" "$file" 2>/dev/null || stat -c%y "$file" 2>/dev/null | cut -d' ' -f1-2 || echo "unknown")
    else
        # Windows fallback
        size=$(wc -c < "$file" 2>/dev/null || echo "0")
        modified="unknown"
    fi

    # Get line count
    lines=$(wc -l < "$file" 2>/dev/null || echo "0")

    # Format size
    if [ "$size" -ge 1048576 ]; then
        size_fmt=$(echo "scale=2; $size/1048576" | bc 2>/dev/null || echo "$size")
        size_unit="MB"
    elif [ "$size" -ge 1024 ]; then
        size_fmt=$(echo "scale=2; $size/1024" | bc 2>/dev/null || echo "$size")
        size_unit="KB"
    else
        size_fmt="$size"
        size_unit="B"
    fi

    printf "%-60s %10s %-4s %8s lines  %s  [%s]\n" "$rel_path" "$size_fmt" "$size_unit" "$lines" "$modified" "$location"
}

# Initialize counters
root_count=0
docs_count=0
root_size=0
docs_size=0
root_lines=0
docs_lines=0

echo -e "${GREEN}Root-Level Markdown Files:${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Find root-level .md files
while IFS= read -r -d '' file; do
    if [ -f "$file" ]; then
        get_file_stats "$file" "ROOT"
        size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null || wc -c < "$file" 2>/dev/null || echo "0")
        lines=$(wc -l < "$file" 2>/dev/null || echo "0")
        root_count=$((root_count + 1))
        root_size=$((root_size + size))
        root_lines=$((root_lines + lines))
    fi
done < <(find "$PROJECT_ROOT" -maxdepth 1 -type f -name "*.md" -print0 2>/dev/null || true)

if [ $root_count -eq 0 ]; then
    echo "  (none)"
fi

echo ""
echo -e "${GREEN}docs/ Directory Markdown Files:${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Find docs/ .md files
docs_dir="$PROJECT_ROOT/docs"
if [ -d "$docs_dir" ]; then
    while IFS= read -r -d '' file; do
        if [ -f "$file" ]; then
            get_file_stats "$file" "DOCS"
            size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null || wc -c < "$file" 2>/dev/null || echo "0")
            lines=$(wc -l < "$file" 2>/dev/null || echo "0")
            docs_count=$((docs_count + 1))
            docs_size=$((docs_size + size))
            docs_lines=$((docs_lines + lines))
        fi
    done < <(find "$docs_dir" -type f -name "*.md" -print0 2>/dev/null || true)
else
    echo "  (docs/ directory not found)"
fi

if [ $docs_count -eq 0 ] && [ -d "$docs_dir" ]; then
    echo "  (none)"
fi

# Summary
echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Summary Statistics${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Format sizes for summary
if [ $root_size -ge 1048576 ]; then
    root_size_fmt=$(echo "scale=2; $root_size/1048576" | bc 2>/dev/null || echo "$root_size")
    root_unit="MB"
elif [ $root_size -ge 1024 ]; then
    root_size_fmt=$(echo "scale=2; $root_size/1024" | bc 2>/dev/null || echo "$root_size")
    root_unit="KB"
else
    root_size_fmt="$root_size"
    root_unit="B"
fi

if [ $docs_size -ge 1048576 ]; then
    docs_size_fmt=$(echo "scale=2; $docs_size/1048576" | bc 2>/dev/null || echo "$docs_size")
    docs_unit="MB"
elif [ $docs_size -ge 1024 ]; then
    docs_size_fmt=$(echo "scale=2; $docs_size/1024" | bc 2>/dev/null || echo "$docs_size")
    docs_unit="KB"
else
    docs_size_fmt="$docs_size"
    docs_unit="B"
fi

total_count=$((root_count + docs_count))
total_size=$((root_size + docs_size))
total_lines=$((root_lines + docs_lines))

if [ $total_size -ge 1048576 ]; then
    total_size_fmt=$(echo "scale=2; $total_size/1048576" | bc 2>/dev/null || echo "$total_size")
    total_unit="MB"
elif [ $total_size -ge 1024 ]; then
    total_size_fmt=$(echo "scale=2; $total_size/1024" | bc 2>/dev/null || echo "$total_size")
    total_unit="KB"
else
    total_size_fmt="$total_size"
    total_unit="B"
fi

echo -e "${YELLOW}Root-Level Files:${NC}"
echo "  Count: $root_count files"
echo "  Size:  $root_size_fmt $root_unit"
echo "  Lines: $root_lines lines"
echo ""

echo -e "${YELLOW}docs/ Files:${NC}"
echo "  Count: $docs_count files"
echo "  Size:  $docs_size_fmt $docs_unit"
echo "  Lines: $docs_lines lines"
echo ""

echo -e "${YELLOW}Total:${NC}"
echo "  Count: $total_count files"
echo "  Size:  $total_size_fmt $total_unit"
echo "  Lines: $total_lines lines"
echo ""

# Recommendations
if [ $root_count -gt 5 ]; then
    echo -e "${YELLOW}⚠ Warning: ${root_count} root-level markdown files detected.${NC}"
    echo -e "${YELLOW}Consider consolidating into docs/ for better organization.${NC}"
    echo ""
fi

echo -e "${GREEN}✓ Audit complete${NC}"

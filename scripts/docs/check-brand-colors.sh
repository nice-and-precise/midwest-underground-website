#!/usr/bin/env bash
# check-brand-colors.sh - Check for deprecated brand colors
# Searches for old color codes that should no longer be used

set -euo pipefail

# Colors for output
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly CYAN='\033[0;36m'
readonly NC='\033[0m' # No Color

# Get project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

# Deprecated colors to search for
DEPRECATED_COLORS=(
    "#003B5C"  # Old dark blue
    "#FF6B35"  # Old orange
    "#2EA3F2"  # Old light blue
)

# File extensions to search
FILE_PATTERNS=(
    "*.md"
    "*.css"
    "*.scss"
    "*.ts"
    "*.tsx"
    "*.js"
    "*.jsx"
)

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Brand Color Validation Report${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo "Project Root: ${PROJECT_ROOT}"
echo "Generated: $(date '+%Y-%m-%d %H:%M:%S')"
echo ""
echo -e "${CYAN}Checking for deprecated colors:${NC}"
for color in "${DEPRECATED_COLORS[@]}"; do
    echo "  • $color"
done
echo ""

# Initialize counters
total_matches=0
files_with_matches=0

# Temporary file for results
TEMP_FILE=$(mktemp)
trap "rm -f $TEMP_FILE" EXIT

# Search for each deprecated color
for color in "${DEPRECATED_COLORS[@]}"; do
    echo -e "${YELLOW}Searching for: ${color}${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    color_matches=0

    # Build find command to search all file patterns
    find_args=("$PROJECT_ROOT" "(" "-name" ".git" "-o" "-name" "node_modules" "-o" "-name" ".next" "-o" "-name" "out" "-o" "-name" "dist" "-o" "-name" "coverage" ")" "-prune" "-o" "-type" "f")

    # Add file pattern conditions
    pattern_added=false
    for pattern in "${FILE_PATTERNS[@]}"; do
        if [ "$pattern_added" = false ]; then
            find_args+=("(" "-name" "$pattern")
            pattern_added=true
        else
            find_args+=("-o" "-name" "$pattern")
        fi
    done
    find_args+=(")" "-print")

    # Execute find and search
    found_files=false
    while IFS= read -r file; do
        # Search for color in file (case-insensitive)
        if grep -i -n "$color" "$file" > /dev/null 2>&1; then
            if [ "$found_files" = false ]; then
                found_files=true
            fi

            # Get relative path
            rel_path="${file#$PROJECT_ROOT/}"

            # Print file header
            echo -e "${RED}${rel_path}${NC}"

            # Print matching lines with line numbers
            grep -i -n --color=always "$color" "$file" | while IFS= read -r line; do
                echo "  $line"
                color_matches=$((color_matches + 1))
                total_matches=$((total_matches + 1))
            done

            files_with_matches=$((files_with_matches + 1))
            echo ""
        fi
    done < <("${find_args[@]}" 2>/dev/null || true)

    if [ "$found_files" = false ]; then
        echo -e "  ${GREEN}✓ No occurrences found${NC}"
        echo ""
    else
        echo -e "  ${RED}Found $color_matches occurrence(s)${NC}"
        echo ""
    fi
done

# Summary
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Summary${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

if [ $total_matches -eq 0 ]; then
    echo -e "${GREEN}✓ No deprecated colors found!${NC}"
    echo ""
    echo "Your codebase is following the current brand standards."
    echo ""
    exit 0
else
    echo -e "${RED}✗ Found ${total_matches} occurrence(s) of deprecated colors in ${files_with_matches} file(s)${NC}"
    echo ""
    echo -e "${YELLOW}Action Required:${NC}"
    echo "Please update the deprecated colors to the current brand palette:"
    echo ""
    echo "  Current Brand Colors:"
    echo "    • Charcoal:       #23272A (primary text and logo)"
    echo "    • Safety Orange:  #FF5A1F (primary CTA accent)"
    echo "    • Steel:          #4F5B66 (secondary)"
    echo "    • Sand:           #F2EDE5 (backgrounds)"
    echo "    • Utility Yellow: #FFC400 (highlight)"
    echo ""
    echo "  See docs/brand/BRAND-STANDARDS.md for full details."
    echo ""
    exit 1
fi

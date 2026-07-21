#!/usr/bin/env python3
"""
Strip V# Fix #N and FIX-* tags from source-code comments.

Strategy
--------
1.  Preserve the **descriptive** text that surrounds each tag.
    e.g.  `// V11 Fix #9: Uses Web Crypto API`  ->  `// Uses Web Crypto API`
          `(V11 Fix #9 — Edge Runtime compatible)`  ->  `(Edge Runtime compatible)`
2.  Drop the tag entirely when there is no surrounding text to preserve.
    e.g.  `(V9 Fix #1)`  ->  `` (removed)
3.  Never touch the actual code — only the comments.
4.  Skip `src/app/globals.css` (Solver B owns the color definitions).

The script is idempotent: running it twice produces the same output.
"""
from __future__ import annotations
import re
import sys
from pathlib import Path


# ----- V# Fix #N patterns ---------------------------------------------------

# (V11 Fix #9 — text)  ->  (text)
RE_VFIX_PAREN_EM = re.compile(r'\(V\d+ Fix #\d+\s*[—–-]\s*([^)]*?)\)')
# (V11 Fix #9: text)   ->  (text)
RE_VFIX_PAREN_COLON = re.compile(r'\(V\d+ Fix #\d+:\s*([^)]*?)\)')
# (V9 Fix #4 + #5)     ->  remove entirely  (with optional preceding whitespace)
RE_VFIX_PAREN_PLUS = re.compile(r'\s*\(V\d+ Fix #\d+(?:\s*\+\s*#\d+)*\s*\)')
# (V9 Fix #1) — text   ->  text  (consume the em-dash that followed the paren)
RE_VFIX_PAREN_DASH = re.compile(r'\s*\(V\d+ Fix #\d+\)\s*[—–-]\s*')
# (V9 Fix #1)          ->  remove entirely
RE_VFIX_PAREN_BARE = re.compile(r'\s*\(V\d+ Fix #\d+\s*\)')
# V11 Fix #9 — text    ->  text
RE_VFIX_EM = re.compile(r'V\d+ Fix #\d+\s*[—–-]\s*')
# V11 Fix #9: text     ->  text
RE_VFIX_COLON = re.compile(r'V\d+ Fix #\d+:\s*')
# V11 Fix #9           ->  remove entirely
RE_VFIX_BARE = re.compile(r'V\d+ Fix #\d+')


# ----- FIX-* patterns -------------------------------------------------------

# "/ FIX-1D: text"     ->  ": text"   (FIX-* is the 2nd ref in an "X / FIX-Y:" list)
RE_FIX_SLASH_COLON = re.compile(r'\s*/\s*FIX-\d+[A-Z]?\s*:\s*')
# "/ FIX-1B Fix 5. "   ->  " "        (same idea, with the "Fix N" sub-form)
RE_FIX_SLASH_FIXN = re.compile(r'\s*/\s*FIX-\d+[A-Z]?\s+[Ff]ix\s+\d+\s*\.?\s*')
# FIX-1C Fix 3: text   ->  text
RE_FIX_FIXN_COLON = re.compile(r'FIX-\d+[A-Z]?\s+[Ff]ix\s+\d+\s*:\s*')
# FIX-1B Fix 5.        ->  remove (with surrounding whitespace + optional period)
RE_FIX_FIXN = re.compile(r'\s*FIX-\d+[A-Z]?\s+[Ff]ix\s+\d+\s*\.?\s*')
# FIX-4A (R3-C-1):     ->  (R3-C-1):
RE_FIX_PAREN = re.compile(r'FIX-\d+[A-Z]?\s*\(([^)]*)\)')
# FIX-1A / R1-D M6:    ->  R1-D M6:    (FIX-* is the 1st ref in a list)
RE_FIX_SLASH = re.compile(r'FIX-\d+[A-Z]?\s*/\s*')
# FIX-1A: text         ->  text
RE_FIX_COLON = re.compile(r'FIX-\d+[A-Z]?\s*:\s*')
# FIX-1A               ->  remove (with surrounding whitespace)
RE_FIX_BARE = re.compile(r'\s*FIX-\d+[A-Z]?')


# ----- Cleanup patterns -----------------------------------------------------

# "//  text"           ->  "// text"   (collapse double space after comment marker)
RE_DOUBLE_SPACE_COMMENT = re.compile(r'(//\s{2,})')
# "text  ,"            ->  "text ,"    (collapse mid-line double spaces; safe enough)
RE_DOUBLE_SPACE_MID = re.compile(r'(\S)  +(\S)')
# "// : text"          ->  "// text"   (lone colon left after FIX-* removal)
RE_LONE_COLON = re.compile(r'(?<=//\s):\s+')


def clean_line(line: str) -> str:
    # V# Fix #N — order matters!
    line = RE_VFIX_PAREN_EM.sub(r'(\1)', line)
    line = RE_VFIX_PAREN_COLON.sub(r'(\1)', line)
    line = RE_VFIX_PAREN_PLUS.sub('', line)
    line = RE_VFIX_PAREN_DASH.sub(' ', line)
    line = RE_VFIX_PAREN_BARE.sub('', line)
    line = RE_VFIX_EM.sub('', line)
    line = RE_VFIX_COLON.sub('', line)
    line = RE_VFIX_BARE.sub('', line)

    # FIX-* — order matters!
    line = RE_FIX_SLASH_COLON.sub(': ', line)
    line = RE_FIX_SLASH_FIXN.sub(' ', line)
    line = RE_FIX_FIXN_COLON.sub('', line)
    line = RE_FIX_FIXN.sub(' ', line)
    line = RE_FIX_PAREN.sub(r'\1', line)
    line = RE_FIX_SLASH.sub('', line)
    line = RE_FIX_COLON.sub('', line)
    line = RE_FIX_BARE.sub('', line)

    # Cleanup
    line = RE_DOUBLE_SPACE_COMMENT.sub('// ', line)
    line = RE_DOUBLE_SPACE_MID.sub(r'\1 \2', line)
    line = RE_LONE_COLON.sub('', line)
    return line


def clean_file(path: Path) -> tuple[bool, str]:
    original = path.read_text(encoding='utf-8')
    cleaned_lines = [clean_line(line) for line in original.split('\n')]
    cleaned = '\n'.join(cleaned_lines)
    return (cleaned != original, cleaned)


def main() -> int:
    src = Path('src')
    extensions = {'.ts', '.tsx', '.js', '.jsx', '.css'}
    updated: list[Path] = []

    for path in sorted(src.rglob('*')):
        if not path.is_file() or path.suffix not in extensions:
            continue
        # Solver B owns the colour definitions in globals.css — leave it alone.
        if path.name == 'globals.css':
            continue

        changed, cleaned = clean_file(path)
        if changed:
            path.write_text(cleaned, encoding='utf-8')
            updated.append(path)

    print(f'Updated {len(updated)} file(s):')
    for p in updated:
        print(f'  - {p}')
    return 0


if __name__ == '__main__':
    sys.exit(main())

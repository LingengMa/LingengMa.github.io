#!/usr/bin/env python3
"""
字体子集化脚本
将 Sarasa Fixed Slab SC 字体按站点实际内容裁剪为 woff2，大幅减小文件体积。

用法：
  python3 scripts/gen_fonts.py

依赖：fonttools, brotli（pip install fonttools brotli）

生成文件：
  static/fonts/SarasaFixedSlabSCNerdFont-Regular.woff2
  static/fonts/SarasaFixedSlabSCNerdFont-Bold.woff2
"""

import os, sys
from pathlib import Path

# ── 配置 ──────────────────────────────────────────────────────────────────────
REPO_ROOT   = Path(__file__).parent.parent
CONTENT_DIR = REPO_ROOT / "content"
OUTPUT_DIR  = REPO_ROOT / "static" / "fonts"
SOURCES = {
    "Regular": "/usr/share/fonts/sarasa-gothic/Sarasa-Regular.ttc",
    "Bold":    "/usr/share/fonts/sarasa-gothic/Sarasa-Bold.ttc",
}
# Sarasa-Regular.ttc / Sarasa-Bold.ttc 中 Sarasa Fixed Slab SC 的索引
TTC_INDEX = 43
# ──────────────────────────────────────────────────────────────────────────────

def collect_chars() -> set:
    """收集 content/ 目录下所有 Markdown 文件中出现的字符"""
    chars = set()
    for md in CONTENT_DIR.rglob("*.md"):
        chars.update(md.read_text(encoding="utf-8"))
    return chars

def build_unicodes(chars: set) -> str:
    """
    合并所需 Unicode 范围：
    - 站点内容实际出现的字符
    - 基础拉丁字符（确保英文/代码正常显示）
    - 常用标点与符号
    """
    codepoints = set(ord(c) for c in chars if not c.isspace())

    # 基础 Latin + Latin-1 Supplement
    codepoints.update(range(0x0020, 0x00FF + 1))
    # 常用标点 General Punctuation
    codepoints.update(range(0x2000, 0x206F + 1))
    # CJK 标点
    codepoints.update(range(0x3000, 0x303F + 1))
    # 全角字符
    codepoints.update(range(0xFF00, 0xFFEF + 1))

    return ",".join(f"U+{cp:04X}" for cp in sorted(codepoints))

def subset_font(src_ttc: str, ttc_index: int, unicodes: str, out_path: Path):
    from fontTools.subset import main as subset_main
    args = [
        src_ttc,
        f"--font-number={ttc_index}",
        f"--unicodes={unicodes}",
        "--flavor=woff2",
        "--layout-features=*",
        "--no-hinting",
        "--desubroutinize",
        f"--output-file={out_path}",
    ]
    print(f"  Subsetting → {out_path.name} ...", flush=True)
    subset_main(args)
    size_kb = out_path.stat().st_size // 1024
    print(f"  ✓ {size_kb} KB")

def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    print("📖 收集站点字符...")
    chars = collect_chars()
    print(f"   共 {len(chars)} 个唯一字符")

    unicodes = build_unicodes(chars)

    for weight, src in SOURCES.items():
        if not os.path.exists(src):
            print(f"  ✗ 未找到字体文件: {src}", file=sys.stderr)
            sys.exit(1)
        out = OUTPUT_DIR / f"SarasaFixedSlabSCNerdFont-{weight}.woff2"
        print(f"\n🔤 {weight}")
        subset_font(src, TTC_INDEX, unicodes, out)

    print("\n✅ 字体生成完成，文件在 static/fonts/")
    print("提示：每次大量新增文章后重新运行此脚本以更新字体子集。")

if __name__ == "__main__":
    main()

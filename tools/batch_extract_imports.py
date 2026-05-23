from pathlib import Path
from pypdf import PdfReader


ROOT = Path("imports/orange-2026-meetings")
OUT = Path("extracted/imported-2026")


def main() -> int:
    OUT.mkdir(parents=True, exist_ok=True)
    for pdf in sorted(ROOT.rglob("*.pdf")):
        rel = pdf.relative_to(ROOT)
        safe_name = "__".join(rel.parts).replace(".pdf", ".txt")
        output = OUT / safe_name
        reader = PdfReader(str(pdf))
        pages = []
        for index, page in enumerate(reader.pages, start=1):
            pages.append(f"\n\n--- Page {index} ---\n{page.extract_text() or ''}")
        output.write_text("\n".join(pages).strip(), encoding="utf-8")
        print(output)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

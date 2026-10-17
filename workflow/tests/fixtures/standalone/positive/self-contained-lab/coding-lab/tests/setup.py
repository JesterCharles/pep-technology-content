from pathlib import Path
root = Path(__file__).resolve().parents[1]
(root / "starter.txt").write_text((root / "fixtures/input.txt").read_text())

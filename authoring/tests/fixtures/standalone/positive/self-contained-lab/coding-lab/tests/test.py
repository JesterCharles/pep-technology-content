from pathlib import Path
root = Path(__file__).resolve().parents[1]
assert (root / "fixtures/input.txt").read_text() == "hello\n"

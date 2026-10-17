#!/usr/bin/env python3
"""Find complete Python comprehensions in target-scoped public strings."""

import ast
import io
import json
import sys
import tokenize

COMPREHENSIONS = (ast.ListComp, ast.SetComp, ast.DictComp)
ASSIGNMENTS = (ast.Assign, ast.AnnAssign, ast.NamedExpr)


def contains_comprehension(node):
    return any(isinstance(child, COMPREHENSIONS) for child in ast.walk(node))


def paired_values(target, value):
    """Yield name/value pairs, preserving positional tuple/list destructuring."""
    if isinstance(target, ast.Name):
        yield target.id, value
        return
    if isinstance(target, (ast.Tuple, ast.List)):
        if isinstance(value, (ast.Tuple, ast.List)) and len(target.elts) == len(value.elts):
            for child_target, child_value in zip(target.elts, value.elts):
                yield from paired_values(child_target, child_value)
        else:
            for child_target in target.elts:
                yield from paired_values(child_target, value)


def tree_has_target_answer(tree, targets):
    for node in ast.walk(tree):
        if not isinstance(node, ASSIGNMENTS):
            continue
        assigned = node.targets if isinstance(node, ast.Assign) else [node.target]
        for target in assigned:
            if any(name in targets and contains_comprehension(value)
                   for name, value in paired_values(target, node.value)):
                return True
    return False


def offsets(source):
    lines = source.splitlines(keepends=True)
    starts = []
    total = 0
    for line in lines:
        starts.append(total)
        total += len(line)
    if not lines or not source.endswith(("\n", "\r")):
        starts.append(total)
    return lines, starts


def absolute(starts, position):
    row, column = position
    return starts[min(max(row - 1, 0), len(starts) - 1)] + column


def token_candidates(source, targets):
    """Emit parseable-looking spans from prose without executing it."""
    candidates = [source.strip()]
    try:
        tokens = list(tokenize.generate_tokens(io.StringIO(source).readline))
    except (tokenize.TokenError, IndentationError, SyntaxError, UnicodeError):
        tokens = []
    _, starts = offsets(source)

    # Balanced bracket spans catch prose such as "Use [x for x in values]."
    stack = []
    matching = {"]": "[", "}": "{", ")": "("}
    for token in tokens:
        if token.type != tokenize.OP:
            continue
        if token.string in "[({":
            stack.append((token.string, absolute(starts, token.start)))
        elif token.string in matching and stack:
            opener, start = stack[-1]
            if opener == matching[token.string]:
                stack.pop()
                candidates.append(source[start:absolute(starts, token.end)].strip())

    # Prefixes beginning at declared names catch assignments surrounded by prose.
    for index, token in enumerate(tokens):
        if token.type != tokenize.NAME or token.string not in targets:
            continue
        start = absolute(starts, token.start)
        for end_token in tokens[index + 1:]:
            if end_token.type == tokenize.ENDMARKER:
                break
            candidates.append(source[start:absolute(starts, end_token.end)].strip())
            if end_token.type in {tokenize.NEWLINE, tokenize.NL}:
                break

    # Assignment windows preserve tuple/list target-to-value pairing inside prose.
    for index, token in enumerate(tokens):
        if token.type != tokenize.OP or token.string not in {"=", ":="}:
            continue
        line_start = index
        while line_start > 0 and tokens[line_start - 1].start[0] == token.start[0]:
            line_start -= 1
        line_end = index + 1
        while line_end < len(tokens) and tokens[line_end].end[0] == token.end[0]:
            line_end += 1
        for start_token in tokens[line_start:index + 1]:
            for end_token in tokens[index + 1:line_end]:
                candidates.append(source[absolute(starts, start_token.start):absolute(starts, end_token.end)].strip())

    # Whole line and text after a prose colon are useful bounded candidates.
    for line in source.splitlines():
        stripped = line.strip()
        if stripped:
            candidates.append(stripped)
            if ":" in stripped:
                candidates.append(stripped.split(":", 1)[1].strip())
    return dict.fromkeys(candidate for candidate in candidates if candidate)


def parse_candidate(source, targets, answer_bearing):
    try:
        source_tokens = list(tokenize.generate_tokens(io.StringIO(source).readline))
        has_assignment = any(token.type == tokenize.OP and token.string in {"=", ":="} for token in source_tokens)
    except (tokenize.TokenError, IndentationError, SyntaxError, UnicodeError):
        has_assignment = False
    for candidate in token_candidates(source, targets):
        for mode in ("exec", "eval"):
            try:
                tree = ast.parse(candidate, mode=mode)
            except (SyntaxError, ValueError, TypeError):
                continue
            if tree_has_target_answer(tree, targets):
                return True
            if answer_bearing and not has_assignment and isinstance(tree, ast.Expression) and contains_comprehension(tree.body):
                return True
    return False


def main():
    payload = json.load(sys.stdin)
    targets = set(payload.get("targets", []))
    sources = payload.get("sources")
    if sources is None:  # Backward-compatible helper input for focused tests.
        sources = [{"value": value, "answerBearing": True} for value in payload.get("strings", [])]
    findings = []
    for index, source in enumerate(sources):
        value = source.get("value") if isinstance(source, dict) else source
        answer_bearing = bool(source.get("answerBearing")) if isinstance(source, dict) else True
        if isinstance(value, str) and parse_candidate(value, targets, answer_bearing):
            findings.append(index)
    json.dump({"findings": findings}, sys.stdout)


if __name__ == "__main__":
    main()

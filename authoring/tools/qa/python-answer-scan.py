#!/usr/bin/env python3
"""Find complete Python comprehension expressions in declared answer-sensitive strings."""

import ast
import io
import json
import sys
import tokenize

COMPREHENSIONS = (ast.ListComp, ast.SetComp, ast.DictComp)


def is_complete_target(tree, targets):
    for node in ast.walk(tree):
        if isinstance(node, (ast.Assign, ast.AnnAssign, ast.NamedExpr)):
            assigned = node.targets if isinstance(node, ast.Assign) else [node.target]
            value = node.value
            if isinstance(value, COMPREHENSIONS):
                for target in assigned:
                    if isinstance(target, ast.Name) and target.id in targets:
                        return True
    if isinstance(tree, ast.Expression) and isinstance(tree.body, COMPREHENSIONS):
        return True
    return False


def parse_candidate(source, targets):
    attempts = [source.strip()]
    try:
        tokens = list(tokenize.generate_tokens(io.StringIO(source).readline))
    except (tokenize.TokenError, IndentationError):
        tokens = []
    for index, token in enumerate(tokens):
        if token.type != tokenize.NAME or token.string not in targets:
            continue
        cursor = index + 1
        while cursor < len(tokens) and tokens[cursor].type in {tokenize.NL, tokenize.NEWLINE, tokenize.INDENT, tokenize.DEDENT}:
            cursor += 1
        if cursor >= len(tokens) or tokens[cursor].string not in {"=", ":="}:
            continue
        start = tokens[cursor + 1].start if cursor + 1 < len(tokens) else None
        if start:
            lines = source.splitlines(keepends=True)
            tail = "".join(lines[start[0] - 1 :])[start[1] :].strip()
            attempts.append(tail)
            start_offset = sum(len(line) for line in lines[: start[0] - 1]) + start[1]
            for end_token in tokens[cursor + 1 :]:
                end_offset = sum(len(line) for line in lines[: end_token.end[0] - 1]) + end_token.end[1]
                attempts.append(source[start_offset:end_offset].strip())
    for candidate in attempts:
        if not candidate:
            continue
        for mode in ("exec", "eval"):
            try:
                tree = ast.parse(candidate, mode=mode)
            except (SyntaxError, ValueError):
                continue
            if is_complete_target(tree, targets):
                return True
    return False


def main():
    payload = json.load(sys.stdin)
    targets = set(payload.get("targets", []))
    findings = []
    for index, value in enumerate(payload.get("strings", [])):
        if isinstance(value, str) and parse_candidate(value, targets):
            findings.append(index)
    json.dump({"findings": findings}, sys.stdout)


if __name__ == "__main__":
    main()

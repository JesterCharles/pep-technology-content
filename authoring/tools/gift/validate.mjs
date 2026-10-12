#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const escapeCharacters = new Set([":", "#", "=", "{", "}", "~", "\\"]);

function isEscaped(text, index) {
  let count = 0;
  for (let cursor = index - 1; cursor >= 0 && text[cursor] === "\\"; cursor -= 1) {
    count += 1;
  }
  return count % 2 === 1;
}

function findUnescaped(text, character, start = 0) {
  for (let index = start; index < text.length; index += 1) {
    if (text[index] === character && !isEscaped(text, index)) {
      return index;
    }
  }
  return -1;
}

function unescapeGift(text) {
  let output = "";
  for (let index = 0; index < text.length; index += 1) {
    if (text[index] !== "\\") {
      output += text[index];
      continue;
    }
    const next = text[index + 1];
    if (!escapeCharacters.has(next)) {
      throw new Error(`unsupported or dangling escape \\${next ?? ""}`);
    }
    output += next;
    index += 1;
  }
  return output;
}

function splitOptions(answerBlock) {
  const markers = [];
  for (let index = 0; index < answerBlock.length; index += 1) {
    if ((answerBlock[index] === "=" || answerBlock[index] === "~") && !isEscaped(answerBlock, index)) {
      markers.push(index);
    }
  }
  if (!markers.length || answerBlock.slice(0, markers[0]).trim()) {
    throw new Error("multiple-choice answers must begin with = or ~");
  }
  return markers.map((start, optionIndex) => {
    const end = markers[optionIndex + 1] ?? answerBlock.length;
    const raw = answerBlock.slice(start + 1, end).trim();
    const feedbackAt = findUnescaped(raw, "#");
    if (feedbackAt < 0) {
      throw new Error(`option ${optionIndex + 1} has no # feedback`);
    }
    const answer = unescapeGift(raw.slice(0, feedbackAt).trim());
    const feedback = unescapeGift(raw.slice(feedbackAt + 1).trim());
    if (!answer) {
      throw new Error(`option ${optionIndex + 1} has no answer text`);
    }
    if (!feedback) {
      throw new Error(`option ${optionIndex + 1} has empty feedback`);
    }
    const correct = answerBlock[start] === "=";
    const prefix = correct ? "Correct." : "Not quite.";
    if (!feedback.startsWith(prefix)) {
      throw new Error(`option ${optionIndex + 1} feedback must open ${JSON.stringify(prefix)}`);
    }
    return { answer, feedback, correct };
  });
}

function parseQuestion(block, category) {
  if (!category) {
    throw new Error("question appears before $CATEGORY");
  }
  if (!block.startsWith("::")) {
    throw new Error("question title must use ::title:: syntax");
  }
  let titleEnd = -1;
  for (let index = 2; index < block.length - 1; index += 1) {
    if (block.slice(index, index + 2) === "::" && !isEscaped(block, index)) {
      titleEnd = index;
      break;
    }
  }
  if (titleEnd < 0) {
    throw new Error("question title is not terminated");
  }
  const title = unescapeGift(block.slice(2, titleEnd).trim());
  if (!title) {
    throw new Error("question title is empty");
  }
  const open = findUnescaped(block, "{", titleEnd + 2);
  const close = findUnescaped(block, "}", open + 1);
  if (open < 0 || close < 0 || block.slice(close + 1).trim()) {
    throw new Error("answer block must be a final, balanced {...} block");
  }
  const stem = unescapeGift(block.slice(titleEnd + 2, open).trim());
  if (!stem) {
    throw new Error("question stem is empty");
  }
  const options = splitOptions(block.slice(open + 1, close));
  if (options.length < 2) {
    throw new Error("multiple-choice question must have at least two options");
  }
  if (options.filter((option) => option.correct).length !== 1) {
    throw new Error("single-answer item must have exactly one correct answer");
  }
  return { category, title, stem, options };
}

export function parseGift(bytes) {
  const buffer = Buffer.isBuffer(bytes) ? bytes : Buffer.from(bytes);
  if ([...buffer].some((byte) => byte > 0x7f)) {
    throw new Error("GIFT must contain ASCII bytes only");
  }
  const text = buffer.toString("ascii");
  if (text.includes("<") || text.includes(">")) {
    throw new Error("GIFT must not contain < or >");
  }

  let category;
  const questions = [];
  const blocks = text.replaceAll("\r\n", "\n").split(/\n[ \t]*\n+/);
  for (const original of blocks) {
    const lines = original
      .split("\n")
      .filter((line) => !line.trimStart().startsWith("//"));
    const block = lines.join("\n").trim();
    if (!block) {
      continue;
    }
    if (block.startsWith("$CATEGORY:")) {
      const categoryLines = block.split("\n");
      category = categoryLines.shift().slice("$CATEGORY:".length).trim();
      if (!category) {
        throw new Error("$CATEGORY is empty");
      }
      if (categoryLines.join("\n").trim()) {
        questions.push(parseQuestion(categoryLines.join("\n").trim(), category));
      }
      continue;
    }
    questions.push(parseQuestion(block, category));
  }
  if (!questions.length) {
    throw new Error("GIFT contains no questions");
  }
  return questions;
}

export function validateGift(bytes, expectedCategory) {
  const questions = parseGift(bytes);
  for (const [index, question] of questions.entries()) {
    if (question.category !== expectedCategory) {
      throw new Error(
        `question ${index + 1} category ${JSON.stringify(question.category)} must equal ` +
          JSON.stringify(expectedCategory),
      );
    }
  }
  return questions;
}

async function main() {
  const [file, expectedCategory] = process.argv.slice(2);
  if (!file || !expectedCategory || process.argv.includes("--help")) {
    console.log("Usage: node tools/gift/validate.mjs <artifact.gift> <course/module/topic>");
    return;
  }
  const questions = validateGift(await readFile(file), expectedCategory);
  console.log(`${file}: ${questions.length} question(s) valid`);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  main().catch((error) => {
    console.error(`gift-validate: ${error.message}`);
    process.exitCode = 1;
  });
}

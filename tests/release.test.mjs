// Release hygiene for the opencode port: the skill metadata and the checksums agree, and the skill
// never keeps a Claude-only placeholder that opencode can't fill.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { REPO, SKILL, readJson } from './helpers.mjs';

const pkg = readJson(path.join(REPO, 'package.json'));
const read = (p) => fs.readFileSync(path.isAbsolute(p) ? p : path.join(REPO, p), 'utf8');
const front = () => /^---\n([\s\S]*?)\n---/.exec(read(path.join(SKILL, 'SKILL.md')).replace(/\r\n/g, '\n'))?.[1] || '';

test('the port has a version', () => {
  assert.match(pkg.version || '', /^\d+\.\d+\.\d+(-[\w.]+)?$/);
});

test('the skill has the opencode frontmatter', () => {
  const f = front();
  assert.match(f, /^name: floorplan$/m);
  assert.match(f, /^description: .{50,}/m);
  assert.match(f, /^compatibility: opencode$/m);
  for (const k of ['argument-hint', 'allowed-tools', 'prompt']) assert.doesNotMatch(f, new RegExp(`^${k}:`, 'm'), `Claude-only frontmatter: ${k}`);
});

test('the skill never uses a placeholder opencode cannot fill', () => {
  const text = read(path.join(SKILL, 'SKILL.md'));
  assert.doesNotMatch(text, /\$\{CLAUDE_SKILL_DIR\}/, 'use $SKILL_DIR and the base directory opencode prints');
  assert.doesNotMatch(text, /^!\`/m, 'no Claude command-substitution lines');
});

test('the skill points only at files that exist', () => {
  const skill = read(path.join(SKILL, 'SKILL.md'));
  for (const [, ref] of skill.matchAll(/\]\((references\/[\w.-]+\.md)/g)) assert.ok(fs.existsSync(path.join(SKILL, ref)), ref);
  for (const [, script] of skill.matchAll(/scripts\/(\w+\.mjs)/g)) assert.ok(fs.existsSync(path.join(SKILL, 'scripts', script)), script);
});

test('CHECKSUMS.txt is for this version', () => {
  assert.match(read('CHECKSUMS.txt'), new RegExp(`^# Floorplan ${pkg.version.replaceAll('.', '\\.')}:`), 'run node tools/checksums.mjs when bumping the version');
});

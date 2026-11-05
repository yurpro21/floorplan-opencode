// Stands in for `opencode` in tests: answers --version, and for `run` logs what it was given (arguments
// and prompt) to $FAKE_LOG, then prints the JSON events a real `--format json` run would. A prompt
// containing "SIGNED-OUT" fails the way opencode does when nobody is signed in.
import fs from 'node:fs';

const args = process.argv.slice(2);
if (args[0] === '--version') { console.log('1.18.4-test'); process.exit(0); }
const prompt = args[args.length - 1] || '';
fs.appendFileSync(process.env.FAKE_LOG, JSON.stringify({ args, prompt }) + '\n');
const out = (ev) => console.log(JSON.stringify(ev));
const sessionID = 'ses_test';
out({ type: 'step_start', sessionID, part: { type: 'step-start' } });
if (prompt.includes('SIGNED-OUT')) {
  out({ type: 'error', sessionID, error: { message: 'You are not signed in. Run opencode auth login.' } });
  process.exitCode = 1;
} else {
  out({ type: 'tool_use', sessionID, part: { tool: 'bash', state: { status: 'completed', input: { command: `/bin/sh -lc 'node floorplan/query.mjs find "refund"'` } } } });
  out({ type: 'tool_use', sessionID, part: { tool: 'read', state: { status: 'completed', input: { filePath: 'shop-api/routes/orders.js' } } } });
  out({ type: 'text', sessionID, part: { type: 'text', text: JSON.stringify({
    title: 'Refunds', answer: 'Refunds go through [[f:shop-api/routes/orders.js]].',
    items: [{ id: 'f:shop-api/routes/orders.js', note: 'Holds the refund endpoint.' }], steps: [], followups: ['Who can ask for one?'],
  }) } });
  out({ type: 'step_finish', sessionID, part: { type: 'step-finish' } });
}

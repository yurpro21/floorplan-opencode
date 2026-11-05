# Floorplan for opencode

A port of [haydenschmitty/floorplan](https://github.com/haydenschmitty/floorplan) that runs in
[opencode](https://opencode.ai). Floorplan reads a codebase and draws an interactive, plain-English map
of every part, file, endpoint and connection, with a health check, screens, guided flows and recent work.

Everything the original does still works. The only additions are the opencode CLI as an engine and
opencode skill/command packaging.

## Requirements

- Node.js 18+
- opencode, signed in (`opencode auth login`)
- Claude Code or Codex only if you want to change a blueprint from the map (see Limitations)

## Install

```sh
./install.sh            # global: ~/.config/opencode (or $XDG_CONFIG_HOME/opencode)
./install.sh --project  # project-only: ./.opencode
```

Restart opencode after installing.

## Use

In your project, ask:

> Make me a floorplan of this app.

or run `/floorplan`. Later, ask:

> Update the floorplan.

The map opens in your browser. Its **Ask** bar answers through `opencode run` with the read-only
`plan` agent, so it can read your source without changing it.

## Engines

The map server picks the engine that built the map, then falls back to the other installed CLIs:

```sh
node floorplan/serve.mjs --engine opencode
node floorplan/serve.mjs --engine opencode --opencode /path/to/opencode --model provider/model
```

`--engine` also accepts `claude` and `codex`. The Ask bar's engine is shown on the map.

## Limitations

- **Changing a blueprint from the map** (`Change` in the Ask bar) needs an engine with schema-constrained
  output. opencode has no equivalent flag yet, so this action is offered only when the map is built and
  answered by Claude Code or Codex. Building a blueprint, asking questions and requesting flows all work
  with opencode.
- Ask answers are read from opencode's reply text and parsed as JSON. The schema is in the prompt, so this
  is reliable but not enforced by the CLI.

## Tests

```sh
npm test
```

## License

MIT, same as the original. See [LICENSE](LICENSE). This port keeps the original copyright and adds the
opencode integration.

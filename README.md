# Claude Code Context Plus

A VS Code extension that bridges your editor and [Claude Code](https://docs.anthropic.com/en/docs/claude-code) CLI. Right-click files or selections to send them as `@`-references directly into your Claude Code terminal.

## Features

- **Add files to context** — Right-click a file in the explorer or editor tab and select "Add to Claude Code". Sends `@path/to/file` to the Claude Code terminal. Supports multi-select.
- **Send selections** — Select code in the editor, right-click, and choose "Send Selection to Claude Code". Sends `@path/to/file:startLine-endLine` so Claude knows exactly what you're pointing at.
- **Auto-detect Claude Code terminals** — Automatically finds terminals named "Claude Code" or matching version patterns (e.g. `1.0.32`). Configurable with custom regex patterns.
- **Manual terminal designation** — Use the command palette to manually designate any terminal as your Claude Code target.
- **Status bar indicator** — Shows when a Claude Code terminal is active. Displays a selection icon when you have text selected, and clicking it sends the selection.

## Keyboard Shortcuts

| Action | Mac | Windows/Linux |
|---|---|---|
| Add current file to context | `Cmd+Shift+.` | `Ctrl+Shift+.` |
| Send selection to context | `Cmd+Shift+,` | `Ctrl+Shift+,` |

## Commands

All commands are available via the command palette (`Cmd+Shift+P`):

- **Add to Claude Code** — Send file(s) as `@`-references
- **Send Selection to Claude Code** — Send selected code with line numbers
- **Set as Claude Code Terminal** — Manually designate a terminal
- **Select Claude Code Terminal** — Choose between multiple Claude Code terminals

## Configuration

| Setting | Type | Default | Description |
|---|---|---|---|
| `claudeContextPlus.terminalNamePatterns` | `string[]` | `[]` | Additional regex patterns to match terminal names as Claude Code terminals |

## How It Works

The extension types `@`-references into your Claude Code terminal input without pressing Enter, so you stay in control. For files it sends `@relative/path`, and for selections it sends `@relative/path:startLine-endLine`.

Paths are automatically made relative to your workspace root.

## Development

```bash
npm install
npm run build        # Build once
npm run watch        # Build on save
npm test             # Run tests
```

To test in VS Code, press `F5` to launch the Extension Development Host.

## Building & Installing Locally

```bash
npm run package      # Produces claude-code-context-plus-0.1.0.vsix
code --install-extension claude-code-context-plus-0.1.0.vsix
```

## License

MIT

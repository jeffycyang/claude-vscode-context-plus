import * as vscode from 'vscode';
import { TerminalDetector } from './terminalDetector';
import { ContextSender } from './contextSender';
import { StatusBar } from './statusBar';

export function activate(context: vscode.ExtensionContext) {
  const detector = new TerminalDetector();
  const sender = new ContextSender(detector);
  const statusBar = new StatusBar(detector);

  context.subscriptions.push(detector, statusBar);

  context.subscriptions.push(
    vscode.commands.registerCommand(
      'claudeContextPlus.addFileToContext',
      (uri?: vscode.Uri, uris?: vscode.Uri[]) => {
        // When invoked from explorer context menu, `uri` is the right-clicked
        // item and `uris` is all selected items (if multi-select).
        // When invoked from editor title context or keybinding, fall back to active editor.
        const targets =
          uris && uris.length > 0
            ? uris
            : uri
              ? [uri]
              : vscode.window.activeTextEditor
                ? [vscode.window.activeTextEditor.document.uri]
                : [];

        if (targets.length === 0) {
          vscode.window.showWarningMessage('No file to add.');
          return;
        }
        sender.addFiles(targets);
      },
    ),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      'claudeContextPlus.sendSelectionToContext',
      () => {
        sender.sendSelection();
      },
    ),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      'claudeContextPlus.setAsClaudeTerminal',
      async () => {
        const active = vscode.window.activeTerminal;
        const terminals = vscode.window.terminals;

        if (terminals.length === 0) {
          vscode.window.showWarningMessage('No terminals open.');
          return;
        }

        // If there's a focused terminal, offer to designate it directly
        if (terminals.length === 1 && active) {
          detector.designate(active);
          vscode.window.showInformationMessage(
            `"${active.name}" set as Claude Code terminal.`,
          );
          return;
        }

        const items = terminals.map((t) => ({
          label: t.name,
          terminal: t,
          description: t === active ? '(active)' : undefined,
        }));

        const picked = await vscode.window.showQuickPick(items, {
          placeHolder: 'Select terminal to designate as Claude Code',
        });

        if (picked) {
          detector.designate(picked.terminal);
          vscode.window.showInformationMessage(
            `"${picked.terminal.name}" set as Claude Code terminal.`,
          );
        }
      },
    ),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      'claudeContextPlus.selectTerminal',
      async () => {
        const claudeTerminals = detector.getClaudeTerminals();

        if (claudeTerminals.length === 0) {
          vscode.window.showWarningMessage(
            'No Claude Code terminals found.',
          );
          return;
        }

        if (claudeTerminals.length === 1) {
          vscode.window.showInformationMessage(
            `Only one Claude Code terminal: "${claudeTerminals[0].name}"`,
          );
          return;
        }

        const items = claudeTerminals.map((t) => ({
          label: t.name,
          terminal: t,
          description: t === detector.target ? '(current target)' : undefined,
        }));

        const picked = await vscode.window.showQuickPick(items, {
          placeHolder: 'Select which Claude Code terminal to target',
        });

        if (picked) {
          detector.designate(picked.terminal);
        }
      },
    ),
  );
}

export function deactivate() {}

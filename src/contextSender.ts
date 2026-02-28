import * as vscode from 'vscode';
import { TerminalDetector } from './terminalDetector';
import { toRelativePath, formatLineRef } from './matching';

export class ContextSender {
  constructor(private readonly detector: TerminalDetector) {}

  addFiles(uris: vscode.Uri[]): void {
    const terminal = this.requireTerminal();
    if (!terminal) return;

    const workspacePaths = (vscode.workspace.workspaceFolders ?? []).map(
      (f) => f.uri.fsPath,
    );
    const refs = uris
      .map((uri) => `@${toRelativePath(uri.fsPath, workspacePaths)}`)
      .join(' ');
    terminal.sendText(' ' + refs + ' ', false);
    terminal.show(false);
  }

  sendSelection(): void {
    const terminal = this.requireTerminal();
    if (!terminal) return;

    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.selection.isEmpty) {
      vscode.window.showWarningMessage('No text selected.');
      return;
    }

    const sel = editor.selection;
    const workspacePaths = (vscode.workspace.workspaceFolders ?? []).map(
      (f) => f.uri.fsPath,
    );
    const filePath = toRelativePath(editor.document.uri.fsPath, workspacePaths);
    const startLine = sel.start.line + 1;
    const endLine = sel.end.line + 1;

    const ref = formatLineRef(filePath, startLine, endLine);
    terminal.sendText(' ' + ref + ' ', false);
    terminal.show(false);
  }

  private requireTerminal(): vscode.Terminal | undefined {
    const terminal = this.detector.target;
    if (!terminal) {
      vscode.window.showWarningMessage(
        'No Claude Code terminal found. Open one first.',
      );
    }
    return terminal;
  }
}

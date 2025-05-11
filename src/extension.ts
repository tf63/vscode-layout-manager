import * as vscode from 'vscode'
import { saveSession } from './commands/save-session'
import { restoreSession } from './commands/restore-session'

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('layoutManager.saveSession', async () => {
            saveSession(context)
        }),

        vscode.commands.registerCommand('layoutManager.restoreSession', async () => {
            restoreSession(context)
        }),
    )
}

export function deactivate() {}

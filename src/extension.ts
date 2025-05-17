// Extension entry point

import { type ExtensionContext, window } from 'vscode'
import { registerLayoutCommands } from './commands/layoutCommands'
import { LayoutsViewProvider } from './views/layoutsViewProvider'
import { LayoutService } from './services/layoutService'
import { WorkspaceLayoutRepository } from './repositories/layoutRepository'

export function activate(context: ExtensionContext): void {
    registerLayoutCommands(context)
    const repository = new WorkspaceLayoutRepository(context.workspaceState)
    const service = new LayoutService(repository)
    const viewProvider = new LayoutsViewProvider(service)
    window.registerTreeDataProvider('layoutManager.layoutsView', viewProvider)
}

export function deactivate(): void {}

// Extension entry point

import { type ExtensionContext, window } from 'vscode'
import { registerLayoutCommands } from './commands/layoutCommands'
import { WorkspaceLayoutRepository } from './repositories/layoutRepository'
import { LayoutService } from './services/layoutService'
import { LayoutsViewProvider } from './views/layoutsViewProvider'

export function activate(context: ExtensionContext): void {
    const repository = new WorkspaceLayoutRepository(context.workspaceState)
    const service = new LayoutService(repository)
    const viewProvider = new LayoutsViewProvider(service)
    window.registerTreeDataProvider('layoutManager.layoutsView', viewProvider)
    registerLayoutCommands(context, service)
}

export function deactivate(): void {}

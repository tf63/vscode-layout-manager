// Extension entry point

import { type ExtensionContext, commands, window } from 'vscode'
import { registerLayoutCommands } from './commands/layoutCommands'
import { WorkspaceLayoutRepository } from './repositories/layoutRepository'
import { LayoutService } from './services/layoutService'
import { LayoutTreeItem, LayoutsViewProvider } from './views/layoutsViewProvider'

export function activate(context: ExtensionContext): void {
    const repository = new WorkspaceLayoutRepository(context.workspaceState)
    const service = new LayoutService(repository)
    const viewProvider = new LayoutsViewProvider(service)
    window.registerTreeDataProvider('layoutManager.layoutsView', viewProvider)
    // +ボタンで新規作成
    context.subscriptions.push(
        commands.registerCommand('layoutManager.createLayoutFromView', async () => {
            await viewProvider.createLayout()
        }),
    )
    // ツリーアイテム右クリック用コマンド
    context.subscriptions.push(
        commands.registerCommand('layoutManager.deleteLayoutFromView', async (item: LayoutTreeItem) => {
            await viewProvider.deleteLayout(item.key)
        }),
    )
    context.subscriptions.push(
        commands.registerCommand('layoutManager.renameLayoutFromView', async (item: LayoutTreeItem) => {
            await viewProvider.renameLayout(item.key)
        }),
    )
    context.subscriptions.push(
        commands.registerCommand('layoutManager.overwriteLayoutFromView', async (item: LayoutTreeItem) => {
            await viewProvider.overwriteLayout(item.key)
        }),
    )
    // TreeViewのレイアウト選択時にusecaseを呼ぶ
    context.subscriptions.push(
        window
            .createTreeView('layoutManager.layoutsView', {
                treeDataProvider: viewProvider,
                // 選択時のイベントハンドラ
                canSelectMany: false,
            })
            .onDidChangeSelection(async (e) => {
                const item = e.selection[0]
                if (item instanceof LayoutTreeItem) {
                    await viewProvider.onDidSelectLayout(item)
                }
            }),
    )
    registerLayoutCommands(context, service)
}

export function deactivate(): void {}

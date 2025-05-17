// Layout commands registration

import { type ExtensionContext, commands, window, InputBoxOptions, QuickPickItem } from 'vscode'
import { LayoutService } from '../services/layoutService'
import { WorkspaceLayoutRepository } from '../repositories/layoutRepository'
import { Layout } from '../models/layout'

export function registerLayoutCommands(context: ExtensionContext) {
    const repository = new WorkspaceLayoutRepository(context.workspaceState)
    const service = new LayoutService(repository)

    context.subscriptions.push(
        commands.registerCommand('layoutManager.createLayout', async () => {
            const name = await window.showInputBox({ prompt: '新しいレイアウト名を入力してください' })
            if (!name) return
            const layout = new Layout({
                key: name,
                tabGroups: [],
            })
            await service.create(layout)
            window.showInformationMessage(`レイアウト「${name}」を作成しました`)
        }),
        commands.registerCommand('layoutManager.loadLayout', async () => {
            const layouts = await service.list()
            if (layouts.length === 0) {
                window.showWarningMessage('レイアウトがありません')
                return
            }
            const pick = await window.showQuickPick(
                layouts.map((l) => l.key),
                { placeHolder: '読み込むレイアウトを選択' },
            )
            if (!pick) return
            window.showInformationMessage(`レイアウト「${pick}」を読み込みました`)
        }),
        commands.registerCommand('layoutManager.listLayouts', async () => {
            const layouts = await service.list()
            if (layouts.length === 0) {
                window.showWarningMessage('レイアウトがありません')
                return
            }
            window.showQuickPick(
                layouts.map((l) => l.key),
                { placeHolder: 'レイアウト一覧' },
            )
        }),
        commands.registerCommand('layoutManager.overwriteLayout', async () => {
            const layouts = await service.list()
            if (layouts.length === 0) {
                window.showWarningMessage('レイアウトがありません')
                return
            }
            const pick = await window.showQuickPick(
                layouts.map((l) => l.key),
                { placeHolder: '上書きするレイアウトを選択' },
            )
            if (!pick) return
            const layout = await service.load(pick)
            if (!layout) return
            layout.tabGroups = []
            await service.overwrite(layout)
            window.showInformationMessage(`レイアウト「${pick}」を上書きしました`)
        }),
        commands.registerCommand('layoutManager.renameLayout', async () => {
            const layouts = await service.list()
            if (layouts.length === 0) {
                window.showWarningMessage('レイアウトがありません')
                return
            }
            const pick = await window.showQuickPick(
                layouts.map((l) => l.key),
                { placeHolder: '名前を変更するレイアウトを選択' },
            )
            if (!pick) return
            const newName = await window.showInputBox({ prompt: '新しいレイアウト名を入力してください', value: pick })
            if (!newName) return
            await service.rename(pick, newName)
            window.showInformationMessage(`レイアウト「${pick}」を「${newName}」に変更しました`)
        }),
        commands.registerCommand('layoutManager.deleteLayout', async () => {
            const layouts = await service.list()
            if (layouts.length === 0) {
                window.showWarningMessage('レイアウトがありません')
                return
            }
            const pick = await window.showQuickPick(
                layouts.map((l) => l.key),
                { placeHolder: '削除するレイアウトを選択' },
            )
            if (!pick) return
            await service.delete(pick)
            window.showInformationMessage(`レイアウト「${pick}」を削除しました`)
        }),
    )
}

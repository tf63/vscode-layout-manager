// Layout commands registration

import { type ExtensionContext, commands, window } from 'vscode'
import type { LayoutService } from '../services/layoutService'
import { loadLayout } from '../usecases/loadLayoutUsecase'
import { readTabGroups } from '../usecases/readTabGroupsUsecase'

// TODO: 整理しておく
export function registerLayoutCommands(context: ExtensionContext, service: LayoutService) {
    context.subscriptions.push(
        commands.registerCommand('layoutManager.createLayout', async () => {
            const name = await window.showInputBox({ prompt: '新しいレイアウト名を入力してください' })
            if (!name) return
            const tabGroups = await readTabGroups()
            if (!tabGroups) {
                window.showWarningMessage('レイアウトの取得に失敗しました')
                return
            }
            await service.create(name, tabGroups)
            window.showInformationMessage(`レイアウト「${name}」を作成しました`)
        }),
        commands.registerCommand('layoutManager.loadLayout', async () => {
            const layouts = await service.getAll()
            if (layouts.length === 0) {
                window.showWarningMessage('レイアウトがありません')
                return
            }

            const pick = await window.showQuickPick(
                layouts.map((l) => l.key),
                { placeHolder: '読み込むレイアウトを選択' },
            )
            if (!pick) return

            const layout = await service.get(pick)
            if (!layout) return

            try {
                await loadLayout(layout)
                window.showInformationMessage(`レイアウト「${pick}」を読み込みました`)
            } catch (_err) {
                window.showErrorMessage('レイアウトの読み込みに失敗しました')
            }
        }),
        commands.registerCommand('layoutManager.listLayouts', async () => {
            const layouts = await service.getAll()
            if (layouts.length === 0) {
                window.showWarningMessage('レイアウトがありません')
                return
            }
            await window.showQuickPick(
                layouts.map((l) => l.key),
                { placeHolder: 'レイアウト一覧' },
            )
        }),
        commands.registerCommand('layoutManager.overwriteLayout', async () => {
            const layouts = await service.getAll()
            if (layouts.length === 0) {
                window.showWarningMessage('レイアウトがありません')
                return
            }
            const pick = await window.showQuickPick(
                layouts.map((l) => l.key),
                { placeHolder: '上書きするレイアウトを選択' },
            )
            if (!pick) return
            const layout = await service.get(pick)
            if (!layout) return
            layout.tabGroups = []
            await service.overwrite(layout)
            window.showInformationMessage(`レイアウト「${pick}」を上書きしました`)
        }),
        commands.registerCommand('layoutManager.renameLayout', async () => {
            const layouts = await service.getAll()
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
            const layouts = await service.getAll()
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

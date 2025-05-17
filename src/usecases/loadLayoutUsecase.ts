// Usecase: Load a layout and open its tab groups in VSCode

import { Uri, commands, window, workspace } from 'vscode'
import type { Layout } from '../models/layout'

export async function loadLayout(layout: Layout) {
    await closeLayout()
    await openLayout(layout)
}

export async function openLayout(layout: Layout) {
    for (const group of layout.tabGroups) {
        const openPromises = group.tabs.map(async (tab) => {
            try {
                const doc = await workspace.openTextDocument(Uri.file(tab.path))
                return window.showTextDocument(doc, { preview: false, preserveFocus: true })
            } catch {
                window.showWarningMessage(`ファイル「${tab.path}」を開けませんでした`)
                return undefined
            }
        })
        await Promise.all(openPromises)
    }
}

export async function closeLayout() {
    await commands.executeCommand('workbench.action.closeAllEditors')
}

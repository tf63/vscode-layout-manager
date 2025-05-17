import { type Tab, type TabGroup as VSCodeTabGroup, window as vscodeWindow, window } from 'vscode'
import type { TabGroup } from '../types/layout'

export async function readTabGroups(): Promise<TabGroup[] | undefined> {
    const tabGroups = vscodeWindow.tabGroups.all.map((group: VSCodeTabGroup) => {
        return {
            tabs: group.tabs
                .filter((tab: Tab) => {
                    // TabInputText型のみ保存
                    return (tab.input as { uri?: { fsPath?: string } })?.uri?.fsPath != null
                })
                .map((tab: Tab) => ({ path: (tab.input as { uri: { fsPath: string } }).uri.fsPath })),
        }
    })

    if (tabGroups.every((g) => g.tabs.length === 0)) {
        window.showWarningMessage('開いているファイルがありません')
        return undefined
    }

    return tabGroups
}

// Layouts view provider (stub)

import { type Command, type Event, EventEmitter, type TreeDataProvider, TreeItem, window } from 'vscode'
import type { LayoutService } from '../services/layoutService'
import { loadLayout } from '../usecases/loadLayoutUsecase'
import { readTabGroups } from '../usecases/readTabGroupsUsecase'

export class LayoutTreeItem extends TreeItem {
    constructor(
        public readonly key: string,
        public readonly command?: Command,
    ) {
        super(key)
        this.contextValue = 'layoutItem'
        if (command) this.command = command
    }
}

export class LayoutsViewProvider implements TreeDataProvider<TreeItem> {
    private _onDidChangeTreeData: EventEmitter<TreeItem | undefined> = new EventEmitter()
    readonly onDidChangeTreeData: Event<TreeItem | undefined> = this._onDidChangeTreeData.event

    constructor(private layoutService: LayoutService) {}

    getTreeItem(element: TreeItem) {
        return element
    }

    getChildren(element?: TreeItem) {
        if (!element) {
            const layouts = this.layoutService.getAll()
            return layouts.map((layout) => new LayoutTreeItem(layout.key))
        }
        return []
    }

    // TreeViewでアイテム選択時にレイアウトをロード
    async onDidSelectLayout(item: LayoutTreeItem) {
        const layout = this.layoutService.get(item.key)
        if (!layout) {
            window.showWarningMessage(`レイアウト「${item.key}」が見つかりません`)
            return
        }
        await loadLayout(layout)
        window.showInformationMessage(`レイアウト「${item.key}」を読み込みました`)
    }

    async createLayout() {
        const name = await window.showInputBox({ prompt: '新しいレイアウト名を入力してください' })
        if (!name) return
        const tabGroups = await readTabGroups()
        if (!tabGroups) {
            window.showWarningMessage('レイアウトの取得に失敗しました')
            return
        }
        this.layoutService.create(name, tabGroups)
        window.showInformationMessage(`レイアウト「${name}」を作成しました`)
        this.refresh()
    }

    deleteLayout(key: string) {
        this.layoutService.delete(key)
        window.showInformationMessage(`レイアウト「${key}」を削除しました`)
        this.refresh()
    }

    async renameLayout(key: string) {
        const newName = await window.showInputBox({ prompt: '新しいレイアウト名を入力してください', value: key })
        if (!newName) return
        this.layoutService.rename(key, newName)
        window.showInformationMessage(`レイアウト「${key}」を「${newName}」に変更しました`)
        this.refresh()
    }

    async overwriteLayout(key: string) {
        const tabGroups = await readTabGroups()
        if (!tabGroups) {
            window.showWarningMessage('レイアウトの取得に失敗しました')
            return
        }
        const layout = this.layoutService.get(key)
        if (!layout) return
        layout.tabGroups = tabGroups
        this.layoutService.overwrite(layout)
        window.showInformationMessage(`レイアウト「${key}」を上書きしました`)
        this.refresh()
    }

    refresh() {
        this._onDidChangeTreeData.fire(undefined)
    }
}

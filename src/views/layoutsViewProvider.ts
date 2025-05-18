// Layouts view provider (stub)

import { relative } from 'node:path'
import {
    type Command,
    type Event,
    EventEmitter,
    type TreeDataProvider,
    TreeItem,
    TreeItemCollapsibleState,
    window,
    workspace,
} from 'vscode'
import type { Layout } from '../models/layout'
import type { LayoutService } from '../services/layoutService'
import { loadLayout } from '../usecases/loadLayoutUsecase'
import { readTabGroups } from '../usecases/readTabGroupsUsecase'

export class LayoutTreeItem extends TreeItem {
    constructor(
        public readonly layout: Layout,
        public readonly command?: Command,
    ) {
        super(layout.key, TreeItemCollapsibleState.Collapsed)
        this.contextValue = 'layoutItem'
        // ファイル数とtabgroup数をdescriptionに表示
        const fileCount = new Set(layout.tabGroups.flatMap((g) => g.tabs.map((t) => t.path))).size
        const tabGroupCount = layout.tabGroups.length
        this.description = `files: ${fileCount}, groups: ${tabGroupCount}`
        this.tooltip = `ファイル数: ${fileCount}\nタブグループ数: ${tabGroupCount}`
        if (command) this.command = command
    }
    get key() {
        return this.layout.key
    }
}

export class FileTreeItem extends TreeItem {
    constructor(public readonly filePath: string) {
        // workspaceのルートからの相対パスを表示
        const wsFolders = workspace.workspaceFolders
        let label = filePath
        if (wsFolders && wsFolders.length > 0) {
            const wsPath = wsFolders[0].uri.fsPath
            label = relative(wsPath, filePath)
        }
        super(label, TreeItemCollapsibleState.None)
        this.contextValue = 'fileItem'
        this.description = label
        this.tooltip = filePath
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
            return layouts.map((layout) => new LayoutTreeItem(layout))
        }
        if (element instanceof LayoutTreeItem) {
            // レイアウト内の全タブファイルパスをリストアップ
            const filePaths = element.layout.tabGroups.flatMap((group) => group.tabs.map((tab) => tab.path))
            // 重複を除外
            const uniquePaths = Array.from(new Set(filePaths))
            return uniquePaths.map((path) => new FileTreeItem(path))
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

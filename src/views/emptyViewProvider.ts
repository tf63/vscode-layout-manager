import { type Event, EventEmitter, type TreeDataProvider, type TreeItem } from 'vscode'

// 空のタブ用のTreeDataProvider
export class EmptyViewProvider implements TreeDataProvider<TreeItem> {
    private _onDidChangeTreeData: EventEmitter<TreeItem | undefined> = new EventEmitter<TreeItem | undefined>()
    readonly onDidChangeTreeData: Event<TreeItem | undefined> = this._onDidChangeTreeData.event

    getTreeItem(element: TreeItem): TreeItem {
        return element
    }

    getChildren(): TreeItem[] {
        // 空のリストを返す
        return []
    }
}

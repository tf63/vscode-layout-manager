// Layouts view provider (stub)

import { type TreeDataProvider, TreeItem, type Event, EventEmitter } from 'vscode'
import type { LayoutService } from '../services/layoutService'

export class LayoutsViewProvider implements TreeDataProvider<TreeItem> {
    private _onDidChangeTreeData: EventEmitter<TreeItem | undefined> = new EventEmitter()
    readonly onDidChangeTreeData: Event<TreeItem | undefined> = this._onDidChangeTreeData.event

    constructor(private layoutService: LayoutService) {}

    getTreeItem(element: TreeItem) {
        return element
    }

    async getChildren(element?: TreeItem) {
        if (!element) {
            const layouts = await this.layoutService.list()
            return layouts.map((layout) => new TreeItem(layout.key))
        }
        return []
    }

    refresh() {
        this._onDidChangeTreeData.fire(undefined)
    }
}

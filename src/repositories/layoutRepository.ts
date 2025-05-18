// Layout repository interface and implementation

import { Layout } from '../models/layout'
import { LAYOUT_STORAGE_KEY } from '../constants/layout'
import type { Memento } from 'vscode'
import type { LayoutProps } from '../types/layout'

export interface LayoutRepository {
    getAll(): Promise<Layout[]>
    get(key: string): Promise<Layout | undefined>
    save(layout: LayoutProps): Promise<Layout>
    update(layout: LayoutProps): Promise<Layout>
    delete(key: string): Promise<void>
}

// TODO: 名前はWorkspaceLayoutRepositoryではない方が良い
export class WorkspaceLayoutRepository implements LayoutRepository {
    constructor(private storage: Memento) {}

    async getAll(): Promise<Layout[]> {
        const layoutMap = await this.getLayoutMap()
        return Object.values(layoutMap).map((layout) => new Layout(layout))
    }

    async get(key: string): Promise<Layout | undefined> {
        const layoutMap = await this.getLayoutMap()
        const layout = layoutMap[key]
        if (layout == null) return undefined

        return new Layout(layoutMap[key])
    }

    async save(layout: LayoutProps): Promise<Layout> {
        const layoutMap = await this.getLayoutMap()
        const l = new Layout(layout)
        layoutMap[l.key] = l
        await this.storage.update(LAYOUT_STORAGE_KEY, layoutMap)
        // 保存後の最新オブジェクトを返す
        return (await this.getLayoutMap())[l.key]
    }

    async update(layout: LayoutProps): Promise<Layout> {
        const layoutMap = await this.getLayoutMap()
        const updated = new Layout(layout)
        layoutMap[updated.key] = updated
        await this.storage.update(LAYOUT_STORAGE_KEY, layoutMap)
        // 更新後の最新オブジェクトを返す
        return (await this.getLayoutMap())[updated.key]
    }

    async delete(key: string) {
        const layoutMap = await this.getLayoutMap()
        delete layoutMap[key]
        await this.storage.update(LAYOUT_STORAGE_KEY, layoutMap)
    }

    private async getLayoutMap(): Promise<Record<string, Layout>> {
        const layoutMap = this.storage.get<Record<string, Layout>>(LAYOUT_STORAGE_KEY)
        return layoutMap ?? {}
    }
}

// Layout repository interface and implementation

import { Layout } from '../models/layout'
import { LAYOUT_STORAGE_KEY } from '../constants/layout'
import type { Memento } from 'vscode'
import type { LayoutProps } from '../types/layout'

export interface LayoutRepository {
    getAll(): Promise<Layout[]>
    get(key: string): Promise<Layout | undefined>
    save(layout: LayoutProps): Promise<void>
    update(layout: LayoutProps): Promise<void>
    delete(key: string): Promise<void>
}

// TODO: 名前はWorkspaceLayoutRepositoryではない方が良い
export class WorkspaceLayoutRepository implements LayoutRepository {
    constructor(private storage: Memento) {}

    async getAll(): Promise<Layout[]> {
        const layoutMap = await this.getLayoutMap()
        return Object.values(layoutMap)
    }

    async get(key: string): Promise<Layout | undefined> {
        const layoutMap = await this.getLayoutMap()
        return layoutMap[key]
    }

    async save(layout: LayoutProps) {
        const layoutMap = await this.getLayoutMap()
        const l = new Layout(layout)
        layoutMap[l.key] = l
        await this.storage.update(LAYOUT_STORAGE_KEY, layoutMap)
    }

    async update(layout: LayoutProps) {
        const layoutMap = await this.getLayoutMap()
        const updated = new Layout(layout)
        layoutMap[updated.key] = updated
        await this.storage.update(LAYOUT_STORAGE_KEY, layoutMap)
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

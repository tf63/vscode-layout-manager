// Layout repository interface and implementation

import type { Memento } from 'vscode'
import { LAYOUT_STORAGE_KEY } from '../constants/layout'
import { Layout } from '../models/layout'
import type { LayoutProps } from '../types/layout'

export interface LayoutRepository {
    getAll(): Promise<Layout[]>
    get(key: string): Promise<Layout | undefined>
    save(layoutProps: LayoutProps): Promise<Layout>
    update(targetKey: string, layoutProps: LayoutProps): Promise<Layout>
    delete(key: string): Promise<void>
}

// TODO: いちいちgetLayoutMap()を呼ぶのは無駄なので、repositoryで持っておけば良い
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

    async save(layoutProps: LayoutProps): Promise<Layout> {
        const layoutMap = await this.getLayoutMap()
        const layout = new Layout(layoutProps)
        layoutMap[layout.key] = layout
        await this.storage.update(LAYOUT_STORAGE_KEY, layoutMap)
        // 保存後の最新オブジェクトを返す
        return (await this.getLayoutMap())[layout.key]
    }

    // TODO
    async update(targetKey: string, layoutProps: LayoutProps): Promise<Layout> {
        // トランザクション的に一時的なコピーで操作
        const layoutMap = { ...(await this.getLayoutMap()) }

        const layout = new Layout(layoutMap[targetKey])
        if (layout == null) {
            throw new Error(`Layout with key "${targetKey}" not found`)
        }

        delete layoutMap[targetKey]

        layout.setLayout(layoutProps)
        layoutMap[layout.key] = layout

        await this.storage.update(LAYOUT_STORAGE_KEY, layoutMap)
        return (await this.getLayoutMap())[layout.key]
    }

    async delete(key: string) {
        const layoutMap = await this.getLayoutMap()
        delete layoutMap[key]
        await this.storage.update(LAYOUT_STORAGE_KEY, layoutMap)
    }

    private async getLayoutMap(): Promise<Record<string, Layout>> {
        // biome-ignore lint: awaitを一時的に無視
        const layoutMap = await this.storage.get<Record<string, Layout>>(LAYOUT_STORAGE_KEY)
        return layoutMap ?? {}
    }
}

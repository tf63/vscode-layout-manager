// Layout repository interface and implementation

import type { Memento } from 'vscode'
import { LAYOUT_STORAGE_KEY } from '../constants/layout'
import { Layout } from '../models/layout'
import type { LayoutProps } from '../types/layout'

export interface LayoutRepository {
    getAll(): Layout[]
    get(key: string): Layout | undefined
    save(layoutProps: LayoutProps): Layout
    update(targetKey: string, layoutProps: LayoutProps): Layout
    delete(key: string): void
}

// TODO: いちいちgetLayoutMap()を呼ぶのは無駄なので、repositoryで持っておけば良い
// TODO: 名前はWorkspaceLayoutRepositoryではない方が良い
export class WorkspaceLayoutRepository implements LayoutRepository {
    constructor(private storage: Memento) {}

    getAll(): Layout[] {
        const layoutMap = this.getLayoutMap()
        return Object.values(layoutMap).map((layout) => new Layout(layout))
    }

    get(key: string): Layout | undefined {
        const layoutMap = this.getLayoutMap()
        const layout = layoutMap[key]
        if (layout == null) return undefined

        return new Layout(layoutMap[key])
    }

    save(layoutProps: LayoutProps): Layout {
        const layoutMap = this.getLayoutMap()
        const layout = new Layout(layoutProps)
        layoutMap[layout.key] = layout
        this.storage.update(LAYOUT_STORAGE_KEY, layoutMap)
        // 保存後の最新オブジェクトを返す
        return this.getLayoutMap()[layout.key]
    }

    // TODO
    update(targetKey: string, layoutProps: LayoutProps): Layout {
        // トランザクション的に一時的なコピーで操作
        const layoutMap = { ...this.getLayoutMap() }

        const layout = new Layout(layoutMap[targetKey])
        if (layout == null) {
            throw new Error(`Layout with key "${targetKey}" not found`)
        }

        delete layoutMap[targetKey]

        layout.setLayout(layoutProps)
        layoutMap[layout.key] = layout

        this.storage.update(LAYOUT_STORAGE_KEY, layoutMap)
        return this.getLayoutMap()[layout.key]
    }

    delete(key: string) {
        const layoutMap = this.getLayoutMap()
        delete layoutMap[key]
        this.storage.update(LAYOUT_STORAGE_KEY, layoutMap)
    }

    private getLayoutMap(): Record<string, Layout> {
        const layoutMap = this.storage.get<Record<string, Layout>>(LAYOUT_STORAGE_KEY)
        return layoutMap ?? {}
    }
}

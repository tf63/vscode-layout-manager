import { Layout } from '../models/layout'
import type { LayoutRepository } from '../repositories/layoutRepository'
import type { LayoutProps } from '../types/layout'

export class LayoutService {
    private repository: LayoutRepository

    constructor(repository: LayoutRepository) {
        this.repository = repository
    }

    async create(name: string, tabGroups: LayoutProps['tabGroups']): Promise<Layout> {
        const layout = new Layout({ key: name, tabGroups })
        return await this.repository.save(layout)
    }

    async getAll() {
        return await this.repository.getAll()
    }

    async get(key: string): Promise<Layout | undefined> {
        const layout = await this.repository.get(key)
        if (layout == null) return undefined
        // repositoryから返された値をそのまま返す（型保証のため明示的にLayout型で返す）
        return layout
    }

    async overwrite(layout: LayoutProps): Promise<Layout> {
        const updated = new Layout(layout)
        return await this.repository.update(updated)
    }

    async rename(key: string, newKey: string): Promise<Layout | undefined> {
        const layout = await this.repository.get(key)
        if (layout != null) {
            layout.setKey(newKey)
            return await this.repository.update(layout)
        }
        return undefined
    }

    async delete(key: string) {
        await this.repository.delete(key)
    }
}

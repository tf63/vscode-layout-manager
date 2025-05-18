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
        return layout
    }

    async overwrite(layoutProps: LayoutProps): Promise<Layout> {
        return await this.repository.update(layoutProps.key, layoutProps)
    }

    async rename(key: string, newKey: string): Promise<Layout | undefined> {
        const layout = await this.repository.get(key)
        if (layout != null) {
            layout.setKey(newKey)
            return await this.repository.update(key, layout)
        }
        return undefined
    }

    async delete(key: string) {
        await this.repository.delete(key)
    }
}

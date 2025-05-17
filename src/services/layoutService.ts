import { Layout } from '../models/layout'
import type { LayoutRepository } from '../repositories/layoutRepository'
import type { LayoutProps } from '../types/layout'

export class LayoutService {
    private repository: LayoutRepository

    constructor(repository: LayoutRepository) {
        this.repository = repository
    }

    async create(name: string, tabGroups: LayoutProps['tabGroups']) {
        const layout = new Layout({
            key: name,
            tabGroups,
        })
        await this.repository.save(layout)
    }

    async getAll() {
        return await this.repository.getAll()
    }

    async get(key: string) {
        return await this.repository.get(key)
    }

    async overwrite(layout: LayoutProps) {
        await this.repository.update(new Layout(layout))
    }

    async rename(key: string, newKey: string) {
        const layout = await this.repository.get(key)
        if (layout != null) {
            layout.setKey(newKey)
            await this.repository.update(layout)
        }
    }

    async delete(key: string) {
        await this.repository.delete(key)
    }
}

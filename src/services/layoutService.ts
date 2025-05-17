// Layout service for CRUD operations

import type { LayoutProps } from '../types/layout'
import { Layout } from '../models/layout'
import type { LayoutRepository } from '../repositories/layoutRepository'

export class LayoutService {
    private repository: LayoutRepository

    constructor(repository: LayoutRepository) {
        this.repository = repository
    }

    async create(layout: LayoutProps) {
        await this.repository.save(new Layout(layout))
    }

    async load(key: string) {
        return await this.repository.get(key)
    }

    async list() {
        return await this.repository.getAll()
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

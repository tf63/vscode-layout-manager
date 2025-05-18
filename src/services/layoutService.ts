import { Layout } from '../models/layout'
import type { LayoutRepository } from '../repositories/layoutRepository'
import type { LayoutProps } from '../types/layout'

export class LayoutService {
    private repository: LayoutRepository

    constructor(repository: LayoutRepository) {
        this.repository = repository
    }

    create(name: string, tabGroups: LayoutProps['tabGroups']): Layout {
        const layout = new Layout({ key: name, tabGroups })
        return this.repository.save(layout)
    }

    getAll() {
        return this.repository.getAll()
    }

    get(key: string): Layout | undefined {
        const layout = this.repository.get(key)
        return layout
    }

    overwrite(layoutProps: LayoutProps): Layout {
        return this.repository.update(layoutProps.key, layoutProps)
    }

    rename(key: string, newKey: string): Layout | undefined {
        const layout = this.repository.get(key)
        if (layout != null) {
            layout.setKey(newKey)
            return this.repository.update(key, layout)
        }
        return undefined
    }

    delete(key: string) {
        this.repository.delete(key)
    }
}

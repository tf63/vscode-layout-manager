import type { TabGroup, LayoutProps } from '../types/layout'

export class Layout {
    key: string
    tabGroups: TabGroup[]
    createdAt: string
    updatedAt: string

    constructor(props: LayoutProps) {
        this.key = props.key
        this.tabGroups = props.tabGroups
        const now = new Date().toISOString()
        this.createdAt = props.createdAt ?? now
        this.updatedAt = props.updatedAt ?? now
    }

    setKey(newKey: string) {
        this.key = newKey
        this.touch()
    }

    setTabGroups(tabGroups: TabGroup[]) {
        this.tabGroups = tabGroups
        this.touch()
    }

    private touch() {
        this.updatedAt = new Date().toISOString()
    }
}

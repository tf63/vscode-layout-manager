import type { LayoutProps, TabGroup } from '../types/layout'

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

    setLayout(layout: LayoutProps) {
        this.key = layout.key
        this.tabGroups = layout.tabGroups
        this.createdAt = layout.createdAt ?? this.createdAt
        this.touch()
    }

    private touch() {
        this.updatedAt = new Date().toISOString()
    }
}

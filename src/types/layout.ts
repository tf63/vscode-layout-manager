// Type definitions for layout manager

import type { Layout } from '../models/layout'

export type LayoutKey = string
export type LayoutList = Layout[]

export type Tab = {
    path: string
}

export type TabGroup = {
    tabs: Tab[]
}

export type LayoutProps = {
    key: string
    tabGroups: TabGroup[]
    createdAt?: string
    updatedAt?: string
}

interface Session {
    name: string
    groups: {
        files: string[]
        activeFile?: string
    }[]
}

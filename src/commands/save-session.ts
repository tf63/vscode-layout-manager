import * as vscode from 'vscode'

export const saveSession = async (context: vscode.ExtensionContext) => {
    const name = await vscode.window.showInputBox({ prompt: 'Session name' })
    if (!name) return

    const groups = vscode.window.tabGroups.all.map((group) => {
        const files: string[] = []
        let activeFile: string | undefined

        for (const tab of group.tabs) {
            if (tab.input instanceof vscode.TabInputText) {
                const path = tab.input.uri.fsPath
                files.push(path)
                if (tab.isActive) activeFile = path
            }
        }

        return { files, activeFile }
    })

    const session: Session = { name, groups }
    const existing = context.globalState.get<Session[]>('sessions') || []
    existing.push(session)
    await context.globalState.update('sessions', existing)
    vscode.window.showInformationMessage(`Saved session: ${name}`)
}

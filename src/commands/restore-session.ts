import * as vscode from 'vscode'

export const restoreSession = async (context: vscode.ExtensionContext) => {
    const sessions = context.globalState.get<Session[]>('sessions') || []
    if (sessions.length === 0) {
        vscode.window.showInformationMessage('No saved sessions.')
        return
    }

    const names = sessions.map((s) => s.name)
    const picked = await vscode.window.showQuickPick(names, {
        placeHolder: 'Select a session to restore',
    })
    if (!picked) return

    const session = sessions.find((s) => s.name === picked)
    if (!session) return

    await vscode.commands.executeCommand('workbench.action.closeAllEditors')

    for (const group of session.groups) {
        const openPromises = group.files.map(async (file) => {
            const doc = await vscode.workspace.openTextDocument(file)
            return vscode.window.showTextDocument(doc, { preview: false, preserveFocus: true })
        })

        const editors = await Promise.all(openPromises)

        // activeFile の表示だけ後に行う
        if (group.activeFile) {
            const doc = await vscode.workspace.openTextDocument(group.activeFile)
            await vscode.window.showTextDocument(doc, { preview: false, preserveFocus: false })
        }
    }

    vscode.window.showInformationMessage(`Restored session: ${picked}`)
}

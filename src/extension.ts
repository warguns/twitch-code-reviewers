// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { ExtensionContext, languages, commands, Disposable, workspace, window } from 'vscode';
import { TwitchCodeReviewersProvider } from './TwitchCodeReviewersProvider';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

let disposables: Disposable[] = [];

export function activate(context: ExtensionContext) {
    const codelensProvider = new TwitchCodeReviewersProvider();

    languages.registerCodeLensProvider("*", codelensProvider);

    commands.registerCommand("twitch-code-reviewers.enableCodeReviews", () => {
        workspace.getConfiguration("twitch-code-reviewers").update("enableCodeReviews", true, true);
    });

    commands.registerCommand("twitch-code-reviewers.disableCodeReviews", () => {
        workspace.getConfiguration("twitch-code-reviewers").update("enableCodeReviews", false, true);
    });

    commands.registerCommand("twitch-code-reviewers.codelensAction", (args: any) => {
        window.showInformationMessage(`CodeLens action clicked with args=${args}`);
    });
}

// this method is called when your extension is deactivated
export function deactivate() {
    if (disposables) {
        disposables.forEach(item => item.dispose());
    }
    disposables = [];
}

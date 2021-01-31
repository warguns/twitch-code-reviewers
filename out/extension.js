"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode_1 = require("vscode");
const TwitchCodeReviewersProvider_1 = require("./TwitchCodeReviewersProvider");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
let disposables = [];
function activate(context) {
    const codelensProvider = new TwitchCodeReviewersProvider_1.TwitchCodeReviewersProvider();
    vscode_1.languages.registerCodeLensProvider("*", codelensProvider);
    vscode_1.commands.registerCommand("twitch-code-reviewers.enableCodeReviews", () => {
        vscode_1.workspace.getConfiguration("twitch-code-reviewers").update("enableCodeReviews", true, true);
    });
    vscode_1.commands.registerCommand("twitch-code-reviewers.disableCodeReviews", () => {
        vscode_1.workspace.getConfiguration("twitch-code-reviewers").update("enableCodeReviews", false, true);
    });
    vscode_1.commands.registerCommand("twitch-code-reviewers.codelensAction", (args) => {
        vscode_1.window.showInformationMessage(`CodeLens action clicked with args=${args}`);
    });
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
    if (disposables) {
        disposables.forEach(item => item.dispose());
    }
    disposables = [];
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map
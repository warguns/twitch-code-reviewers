"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
/**
 * TwitchCodeReviewersProvider
 */
class TwitchCodeReviewersProvider {
    constructor() {
        this.codeLenses = [];
        this._onDidChangeCodeLenses = new vscode.EventEmitter();
        this.onDidChangeCodeLenses = this._onDidChangeCodeLenses.event;
        this.regex = /LOL/g;
        vscode.workspace.onDidChangeConfiguration((_) => {
            this._onDidChangeCodeLenses.fire();
        });
    }
    provideCodeLenses(document, token) {
        if (vscode.workspace.getConfiguration("twitch-code-reviewers").get("enableCodeReviews", true)) {
            this.codeLenses = [];
            const regex = new RegExp(this.regex);
            const text = document.getText();
            let matches;
            while ((matches = regex.exec(text)) !== null) {
                const line = document.lineAt(document.positionAt(matches.index).line);
                const indexOf = line.text.indexOf(matches[0]);
                const position = new vscode.Position(line.lineNumber, indexOf);
                const range = document.getWordRangeAtPosition(position, new RegExp(this.regex));
                if (range) {
                    this.codeLenses.push(new vscode.CodeLens(range, {
                        title: "This is the command we put from socket io",
                        tooltip: "Tooltip provided by sample extension",
                        command: "twitch-code-reviewers.codelensAction",
                        arguments: ["Argument 1", false]
                    }));
                }
            }
            return this.codeLenses;
        }
        return [];
    }
    resolveCodeLens(codeLens, token) {
        if (vscode.workspace.getConfiguration("twitch-code-reviewers").get("enableCodeReviews", true)) {
            return codeLens;
        }
        return null;
    }
}
exports.TwitchCodeReviewersProvider = TwitchCodeReviewersProvider;
//# sourceMappingURL=TwitchCodeReviewersProvider.js.map
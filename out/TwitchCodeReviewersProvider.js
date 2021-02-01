"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const socket_io_client_1 = require("socket.io-client");
/**
 * TwitchCodeReviewersProvider
 */
class TwitchCodeReviewersProvider {
    constructor() {
        this.fileCodeLenses = new Map();
        this.commentedLines = new Map();
        this._onDidChangeCodeLenses = new vscode.EventEmitter();
        this.onDidChangeCodeLenses = this._onDidChangeCodeLenses.event;
        this.socket = socket_io_client_1.io(vscode.workspace.getConfiguration("twitch-code-reviewers").get("socketConnection", "http://localhost:666/"));
        vscode.workspace.onDidChangeConfiguration((_) => {
            this._onDidChangeCodeLenses.fire();
        });
    }
    provideCodeLenses(document, token) {
        if (vscode.workspace.getConfiguration("twitch-code-reviewers").get("enableCodeReviews", true)) {
            this.socket.once("twitch-code-review", (user, messageFile, messageLine, messageContent) => {
                var _a;
                const line = document.lineAt(document.positionAt(messageLine).line);
                // const position = new vscode.Position(line.lineNumber, 0);
                const range = new vscode.Range(line.lineNumber, 0, line.lineNumber, 100);
                if (range) {
                    const keyPair = `${messageLine}-${messageContent}`;
                    if (undefined === this.commentedLines.get(messageFile) || !((_a = this.commentedLines.get(messageFile)) === null || _a === void 0 ? void 0 : _a.includes(keyPair))) {
                        this.commentedLines.set(messageFile, keyPair);
                        let codeLenses = this.fileCodeLenses.get(messageFile) || [];
                        codeLenses.push(new vscode.CodeLens(range, {
                            title: `${user}: ${messageContent}`,
                            tooltip: messageContent,
                            command: "twitch-code-reviewers.codelensAction",
                            arguments: ["Argument 1", false]
                        }));
                        this.fileCodeLenses.set(messageFile, codeLenses);
                    }
                }
            });
            return this.fileCodeLenses.get(document.fileName) || [];
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
import * as vscode from 'vscode';
import { io, Socket } from "socket.io-client";

/**
 * TwitchCodeReviewersProvider
 */
export class TwitchCodeReviewersProvider implements vscode.CodeLensProvider {

    private codeLenses: vscode.CodeLens[] = [];
    private commentedLines: string[] = [];
    private _onDidChangeCodeLenses: vscode.EventEmitter<void> = new vscode.EventEmitter<void>();
    public readonly onDidChangeCodeLenses: vscode.Event<void> = this._onDidChangeCodeLenses.event;
    private socket: Socket;

    constructor() {
        this.socket = io(vscode.workspace.getConfiguration("twitch-code-reviewers").get("socketConnection", "http://localhost:666/"));
        vscode.workspace.onDidChangeConfiguration((_) => {
            this._onDidChangeCodeLenses.fire();
        });
    }

    public provideCodeLenses(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.CodeLens[] | Thenable<vscode.CodeLens[]> {

        if (vscode.workspace.getConfiguration("twitch-code-reviewers").get("enableCodeReviews", true)) {
            
            this.socket.once("twitch-code-review", (user: string, messageLine: number, messageContent: string) => {
                const line = document.lineAt(document.positionAt(messageLine).line);
                // const position = new vscode.Position(line.lineNumber, 0);
                const range = new vscode.Range(line.lineNumber, 0, line.lineNumber, 100);
                if (range) {
                    const keyPair = `${messageLine}-${messageContent}`;
                    if (!this.commentedLines.includes(keyPair)) {
                        this.commentedLines.push(keyPair);
                        this.codeLenses.push(new vscode.CodeLens(range, {
                            title: `${user}: ${messageContent}`,
                            tooltip: messageContent,
                            command: "twitch-code-reviewers.codelensAction",
                            arguments: ["Argument 1", false]
                        }));
                    }
                }
            });
            console.log(this.codeLenses);
            return this.codeLenses;
        }
        return [];
    }

    public resolveCodeLens(codeLens: vscode.CodeLens, token: vscode.CancellationToken) {
        if (vscode.workspace.getConfiguration("twitch-code-reviewers").get("enableCodeReviews", true)) {
            return codeLens;
        }
        return null;
    }
}


import * as vscode from 'vscode';
import { io, Socket } from "socket.io-client";

/**
 * TwitchCodeReviewersProvider
 */
export class TwitchCodeReviewersProvider implements vscode.CodeLensProvider {

    private fileCodeLenses: Map<string, vscode.CodeLens[]> = new Map<string, vscode.CodeLens[]>();
    private commentedLines: Map<string, string> = new Map<string, string>();
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

            this.socket.once("twitch-code-review", (user: string, messageFile: string, messageLine: number, messageContent: string) => {
                
                
                const line = document.lineAt(document.positionAt(messageLine).line);
                // const position = new vscode.Position(line.lineNumber, 0);
                const range = new vscode.Range(line.lineNumber, 0, line.lineNumber, 100);
                if (range) {
                    const keyPair = `${messageLine}-${messageContent}`;
                    if (undefined === this.commentedLines.get(messageFile) || !this.commentedLines.get(messageFile)?.includes(keyPair)) {
                        this.commentedLines.set(messageFile, keyPair);

                        let codeLenses: vscode.CodeLens[] = this.fileCodeLenses.get(messageFile) || [];
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

    public resolveCodeLens(codeLens: vscode.CodeLens, token: vscode.CancellationToken) {
        if (vscode.workspace.getConfiguration("twitch-code-reviewers").get("enableCodeReviews", true)) {
            return codeLens;
        }
        return null;
    }
}


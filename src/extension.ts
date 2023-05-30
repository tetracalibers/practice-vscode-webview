// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  // WebView を登録
  context.subscriptions.push(
    vscode.commands.registerCommand("content-provider-sample.helloWorld", (args) => {
      // Create and show panel
      const panel = vscode.window.createWebviewPanel("example.webview", "Hello World", vscode.ViewColumn.One, {});

      // And get the special URI to use with the webview
      const imgSrc = panel.webview.asWebviewUri(vscode.Uri.file(args.path));

      panel.webview.html = `
        <!DOCTYPE html>
        <html lang="ja">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>WebView Example</title>
        </head>
        <body>
          <img src="${imgSrc}"/>
        </body>
        </html>
      `;
    })
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}

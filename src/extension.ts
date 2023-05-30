// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

// これから実装するので、この時点ではまだファイルが無い事に注意！
import { WebViewProvider } from "./webview-provider";

export function activate(context: vscode.ExtensionContext) {
  // WebView を登録
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "example.webview", // package.json で設定した`id`と同じ値にして下さい
      new WebViewProvider(context.extensionUri)
    )
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}

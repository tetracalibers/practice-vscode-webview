// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import sizeOf from "image-size";

export function activate(context: vscode.ExtensionContext) {
  // WebView を登録
  context.subscriptions.push(
    vscode.commands.registerCommand("content-provider-sample.helloWorld", (args) => {
      // Create and show panel
      const panel = vscode.window.createWebviewPanel("example.webview", "Hello World", vscode.ViewColumn.One, {
        enableScripts: true
      });

      panel.webview.onDidReceiveMessage((message) => {
        switch (message.type) {
          case "crop":
            vscode.window.showInformationMessage(JSON.stringify(message, null, 2));
            return;
        }
      });

      // And get the special URI to use with the webview
      const imgSrc = panel.webview.asWebviewUri(vscode.Uri.file(args.path));
      const { width, height } = sizeOf(imgSrc.fsPath);

      const cropperJs = panel.webview.asWebviewUri(
        vscode.Uri.joinPath(context.extensionUri, "node_modules/cropperjs/dist/cropper.min.js")
      );
      const cropperCss = panel.webview.asWebviewUri(
        vscode.Uri.joinPath(context.extensionUri, "node_modules/cropperjs/dist/cropper.min.css")
      );

      panel.webview.html = `
        <!DOCTYPE html>
        <html lang="ja">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>WebView Example</title>
          <link rel="stylesheet" href="${cropperCss}" />
        </head>
        <body>
          <div style="width: ${width}px; height: ${height}px">
            <img id="crop-target" width="${width}" height="${height}"src="${imgSrc}"/>
          </div>
          <button id='crop-exec-button'>Crop</button>
          <div>
            <img id='preview' />
          </div>
          <div id="debug"></div>
          <script src="${cropperJs}"></script>
          <script>
            const target = document.getElementById('crop-target');
            const cropper = new Cropper(target, {
              zoomable: false,
            });
            
            const execButton = document.getElementById('crop-exec-button');
            const vscode = acquireVsCodeApi();
            
            execButton.addEventListener('click', () => {
              const canvas = cropper.getCroppedCanvas();
              const preview = document.getElementById('preview');
              preview.src = canvas.toDataURL();
              
              // 拡張側にイベントを送信します
              vscode.postMessage({ type: "crop", data: cropper.getData() })
            })
          </script>
        </body>
        </html>
      `;
    })
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}

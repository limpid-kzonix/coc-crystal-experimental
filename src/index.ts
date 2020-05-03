import * as fs from "fs";

import { DocumentSelector } from 'vscode-languageserver-protocol';

import { ExtensionContext, LanguageClient, LanguageClientOptions, workspace, Disposable } from 'coc.nvim'

const CRYSTAL_MODE: DocumentSelector = [{ language: "crystal", scheme: "file" }];

export function activate(context: ExtensionContext): void {

    showStatusMessage("Loading extension for Crystal Language")

    let { subscriptions, logger } = context
    // Holds the object of workspace configuration 
    // see JSON Schema in package.json (contributes.configuration)
    const config = workspace.getConfiguration().get<any>('crystal', {}) as any

    const enable = config.enable;
    if (enable === false) {
        showStatusMessage("Crystal Language Server disabled.", false);
        logger.warn("Crystal Language Server disabled. Exit. ");
        return;
    }
    if (config.server != null) {
        const scryExecutablePath = config.server;

        if (scryExecutablePath == null && typeof scryExecutablePath === "string") {
            showStatusMessage("Could't find configuration for 'scry' language server.", false);
            logger.error(`Could't find configuration for by key 'crystal.scry.path'.`);
            return;
        }
        if (fs.existsSync(scryExecutablePath) === false) {
            showStatusMessage("Could't find 'scry' executable file.", false);
            logger.error(`The 'scry' executable file doeCrystal language server starteds not exit. "crystal.scry.path" - ${scryExecutablePath}`);
            return;
        }


        const command: string = scryExecutablePath;

        showStatusMessage(`Generated 'scry' command - ${command}`);

        const serverOptions = { command: command, args: [] };

        const clientOptions: LanguageClientOptions = {
            documentSelector: CRYSTAL_MODE,
            synchronize: {
                configurationSection: "crystal",
                fileEvents: workspace.createFileSystemWatcher("**/*.cr")
            },
        };

        let client = new LanguageClient('crystal', 'Crystal language server', serverOptions, clientOptions)
        let sub: Disposable = client.start()
        client.onReady().then(() => {
            workspace.showMessage(`Crystal language server started`, 'more');
        }, e => {
            // tslint:disable-next-line:no-console
            workspace.showMessage(`Crystal language server start failed: ${e.message}`, 'error')
        })

        subscriptions.push(sub)
    }


}

function showStatusMessage(text: string, isProgressStatus: boolean = true) {
    workspace.showMessage(text, 'warning');
}


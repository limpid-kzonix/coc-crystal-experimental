import * as path from "path";
import * as fs from "fs";

import os = require('os');
import { ExtensionContext, LanguageClient, LanguageClientOptions, services, workspace } from 'coc.nvim'

export async function activate(context: ExtensionContext): Promise<void> {

    await showStatusMessage("Loading extension for Crystal Language")

    let { subscriptions, logger } = context
    // Holds the object of workspace configuration 
    // see JSON Schema in package.json (contributes.configuration)
    const config = workspace.getConfiguration().get<any>('crystal', {}) as any

    const enable = config.enable;
    if (enable === false) {
        await showStatusMessage("Crystal Language Server disabled.", false);
        logger.warn("Crystal Language Server disabled. Exit. ");
        return;
    }
    if (config.scry == null) {
        const scryExecutablePath = config.scry.path;
        let arch: string = os.arch();
        let platform: string = os.platform();

        if (scryExecutablePath == null && typeof scryExecutablePath === "string") {
            await showStatusMessage("Could't find configuration for 'scry' language server.", false);
            logger.error(`Could't find configuration for by key 'crystal.scry.path'.`);
            return;
        }
        if (fs.existsSync(scryExecutablePath) === false) {
            await showStatusMessage("Could't find 'scry' executable file.", false);
            logger.error(`The 'scry' executable file does not exit. "crystal.scry.path" - ${scryExecutablePath}`);
            return;
        }

        const command: string = context.asAbsolutePath(path.join(scryExecutablePath, platform, arch, "scry"));

        const selector = config.filetypes || [
            { scheme: 'file', language: 'cr' },
            { scheme: 'untitled', language: 'cr' }
        ];

        const serverOptions = { command: command, args: [] };

        const clientOptions: LanguageClientOptions = {
            documentSelector: selector,
            synchronize: {
                configurationSection: ['crystal'],
                fileEvents: workspace.createFileSystemWatcher('**/*.cr')
            },
            outputChannelName: 'crystal',
            initializationOptions: {
                embeddedLanguages: { crystal: true }
            }
        };

        let client = new LanguageClient('crystal', 'Crystal language server', serverOptions, clientOptions)

        client.onReady().then(() => {
            workspace.showMessage('Crystal language server started', 'more')
        }, e => {
            // tslint:disable-next-line:no-console
            workspace.showMessage(`Crystal language server start failed: ${e.message}`, 'error')
        })

        subscriptions.push(services.registLanguageClient(client))
    }


}

async function showStatusMessage(text: string, isProgressStatus: boolean = true) {
    let statusItem = workspace.createStatusBarItem(0, { progress: isProgressStatus })
    statusItem.text = text;
    statusItem.show();

    workspace.showMessage('Crystal language server started', 'warning');
}


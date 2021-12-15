import * as vscode from 'vscode';
import OPGen from './OPGen';

let OPGenInstance: OPGen;

export function activate(context: vscode.ExtensionContext) {
	
	console.info('OPGen is now running...');

	OPGenInstance = new OPGen();

	registerCommand(context, 'runInCurrentContext', () => OPGenInstance.runInCurrentContext());
	registerCommand(context, 'runInCurrentProject', () => OPGenInstance.runInCurrentProject());
	registerCommand(context, 'startServer', () => OPGenInstance.startServer());

}

// this method is called when extension is deactivated
export function deactivate() {
	OPGenInstance.release();
}

function registerCommand(activateContext: vscode.ExtensionContext, command: string, func: Function){
	activateContext.subscriptions.push(vscode.commands.registerCommand(`opgen-ext.${command}`, () => func()))
}
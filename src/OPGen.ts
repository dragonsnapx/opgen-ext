const {exec} = require('child_process');
const fs = require('fs');
const path = require('path');
import * as vscode from 'vscode';
import { ILaunchRequestArguments } from './opgenDebug';

type ExecErr = {
    err: Error;
    stdout: string | Buffer;
    stderr: string | Buffer;
};

class OPGen{

    // If null it means that it is not installed.
    installed_path?: string;

    constructor(force_install: boolean = false){

        this.spawnLoadingMessage({message: 'Installing OPGen...'});

        // Intialization process
        // First, check if OPGen is installed in the User's PC
        let install_path: string;
        switch(process.platform){
            case 'win32':
                // Windows - I don't have a Windows computer right now to test out where this would be stored
                // Only OS X works as intended (for now)
                return;
                break;
            case 'darwin':
                // OS X - installs to the ~/Document folder
                const home_path: string = require('os').homedir();
                install_path = path.join(home_path, '/Documents');
                break;
            default:
                // Need to figure out the installation paths for Linux, etc.
                return;
                break;
        }
        
        const files = fs.readdirSync(install_path);

        // Also should validate if the user has necessary packages - npm, NodeJS, Python
        // And ensure that environment variables are properly configured
        
        // Pulls from git - when this is released, it would pull from a gist, or a zip of releases
        // This also assumes the user has authentication to pull from the repo.
        // Finally, it would also check if the user has the latest version.
        if(!files.includes('OPGen') || force_install){
            // Again, this assumes that user is running in Mac or Linux-like environments.
            // As the && argument does not work on windows.
            exec(`cd ${install_path} && 
                git clone https://github.com/Song-Li/JSCPG &&
                cd JSCPG &&
                git checkout solver  && 
                ./install.sh`);
        }

        // Finally, it should validate file integrity to make sure it is properly installed.

        this.installed_path = path.join(install_path, '/OPGen');
        this.spawnLoadingMessage({despawn: true});
    }

    release(): void{
        // Run cleanup script...
        exec(`cd ${this.installed_path} && ./clean.sh`, (err: ExecErr) => {
            // Report any errors...
            console.log(err);
        });
    }

    startServer(){
        exec(`cd ${this.installed_path} && python ./start_server.py`, (err: ExecErr) => {
            this.spawnErrorModal("Cannot Start Server");
        })
    }

    // Runs for the current file
    runInCurrentContext(filePath: string, launchArgs: ILaunchRequestArguments){
        // Call OPGenRuntime...
    }

    // Runts for the current project
    runInCurrentProject(){

    }

    // OPGen has broke 
    breakOn(){

    }

    spawnErrorModal(message: string){
        vscode.window.showErrorMessage(message);
    }

    spawnLoadingMessage({message, despawn} : {message?: string, despawn?: boolean}): void{
        vscode.window.withProgress({
            location: vscode.ProgressLocation.Window,
            cancellable: false,
            title: message
        }, async progress => {
            progress.report({ increment: despawn ? 0 : 100 });
        });
    }
}

export default OPGen;
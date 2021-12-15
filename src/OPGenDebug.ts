import { LoggingDebugSession } from 'vscode-debugadapter';
import { DebugProtocol } from "vscode-debugprotocol";
import { OPGenRuntime } from './opgenRuntime';

export type VulnerabilityType = "os_command" | "proto_pollution" | "ipt" | "path_traversal";

export interface ILaunchRequestArguments extends DebugProtocol.LaunchRequestArguments {
    program: string;
    vulnerabilityType?: VulnerabilityType;
    printToConsole?: boolean;
    moduleMode?: boolean;
    exitWhenFound?: boolean;
    singleBranchMode?: boolean;
    runAll?: boolean;
    timeout?: number;
    listOfFile?: boolean;
    install?: boolean;
    maxRep?: number;
    noPrioritizedFunctions?: boolean;
    nodeJsMode?: boolean;
    entraceFunc?: Function | string;
    preTimeout?: number;
    maxFileStack?: number;
    skipFunc?: string;
    runEnv?: string;
    noFileBased?: boolean;
    parallelMode?: boolean;
}

export class OPGenDebugSession extends LoggingDebugSession{
    private static threadID = 1;

    private _runtime: OPGenRuntime;

    constructor(fileAccessor: FileAccessor){
        //
    }

    protected async launchRequest(response: DebugProtocol.LaunchResponse, args: ILaunchRequestArguments, request?: DebugProtocol.Request): void {
        
    }
}
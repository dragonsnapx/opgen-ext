import { EventEmitter } from 'events';

export interface IRuntimeBreakpoint {
    id: number;
    line: number;
    verified: boolean;
}

export interface FileAccessor{
    readFile(path: string): Promise<string>;
}

export interface Token{
    name: string;
    line: number;
    index: number;
}

export class OPGenRuntime extends EventEmitter{

    private _sourceFile: string = '';
    private get sourceFile(){ return this._sourceFile; }

    // Lines for the files active for debugging
    private _sourceLines: string[] = [];
    private _instructions: Token[] = [];
    private _starts: number[] = [];
    private _ends: number[] = [];

    // Breakpoint lines & col
    private _currentLine: number = 0;
    private _currentColumn: number | undefined;

    private breakPoints = new Map<string, IRuntimeBreakpoint[]>();

    private get currentLine() { return this._currentLine };
    private set currentLine(x){ 
        this._currentLine = x;
        this._instructions = this._starts[x];
    }

    private _breakpointId = 1;
    private _breakMessage: string = "";

    constructor(private fileAccessor: FileAccessor){
        super();
    }

    public async init(programPath: string): Promise<void>{
        await this.loadProgram(programPath);
    }

    public async loadProgram(file: string): Promise<void>{
        if(this._sourceFile !== file){
            this._sourceFile = file;
            const contents = await this.fileAccessor.readFile(file);
            this._sourceLines = contents.split('/\r?\n/');

            this._instructions = [];

            for(let idx = 0; idx < this._sourceLines.length; idx++){
                this._starts.push(this._instructions.length);
                const tokens: Token[] = this.parseTokens(idx, this._sourceLines[idx]);
                for(const token of tokens)
                    this._instructions.push(token);
                this._ends.push(this._instructions.length);
            }
        }
    }

    public gotoNextBreakpoint(){
        
    }

    private parseTokens(index: number, line: string): Token[]{
        let match: RegExpExecArray | null;
        let tokens: Token[] = [];
        while(match = /[a-z]+/ig.exec(line)){
            tokens.push({
                name: match[0],
                line: index,
                index: match.index
            });
        }
        return tokens;
    }
}
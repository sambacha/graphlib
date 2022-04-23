import { Graph } from './graph';
export declare type Json = Record<string, any>;
export declare function write(g: Graph): Json;
export declare function read(json: Record<string, any>): Graph;

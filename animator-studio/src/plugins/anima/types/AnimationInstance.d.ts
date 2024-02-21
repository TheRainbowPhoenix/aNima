export default class AnimationInstance extends Dispatcher {
    constructor(actor: any, animation: any);
    _Actor: any;
    _Animation: any;
    _Time: number;
    _Min: number;
    _Max: number;
    _Loop: any;
    _Range: number;
    set loop(arg: any);
    get loop(): any;
    set time(arg: number);
    get time(): number;
    get isOver(): boolean;
    reset(): void;
    advance(seconds: any): any[];
    apply(actor: any, mix: any): void;
}
import Dispatcher from "./Dispatcher.js";

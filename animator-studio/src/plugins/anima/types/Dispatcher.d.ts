export default class Dispatcher {
    events: {};
    addEventListener(event: any, callback: any): void;
    removeEventListener(event: any, callback: any): boolean;
    dispatch(event: any, data: any, extraContext: any): void;
}

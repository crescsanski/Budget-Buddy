export class Alert {
    id: string = "";
    type: AlertType = <AlertType>{};
    message: string = "";
    autoClose: boolean = true;
    keepAfterRouteChange?:boolean = true;
    fade:boolean = true;

    constructor(init?:Partial<Alert>) {
        Object.assign(this, init);
    }
}

export enum AlertType {
    Success,
    Error,
    Info,
    Warning
}
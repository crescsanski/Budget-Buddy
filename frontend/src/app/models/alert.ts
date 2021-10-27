export class Alert {
    id: string = <string>{};
    type: AlertType = <AlertType>{};
    message: string = <string>{};
    autoClose: boolean = <boolean>{};
    keepAfterRouteChange?:boolean = <boolean>{};
    fade:boolean = <boolean>{};

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
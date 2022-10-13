export class ApiReturn {
    constructor() {
    }
    code: number;
    message: boolean;
    data: any;
}

export class ApiLoginReturn {
    constructor() {
    }
    success: boolean;
    message: string;
    token: string;
    refresh_token: string;
    userId: string;
    custId: string;
}

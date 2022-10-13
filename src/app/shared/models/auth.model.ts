export class LoginModel {
    constructor() {
    }
    username: string;
    password: string;
}

export class LoginReponseModel {
    constructor() {
    }
    accessToken: string;
}

export class ChangePasswordDto {
    username: string
    password: string
    passwordNew: string
    confirm: string
}

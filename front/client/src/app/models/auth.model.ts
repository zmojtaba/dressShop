export class LoginModel{
    constructor(private refresh: string,
        private access:string,
        public email:string,
        public refreshExp : number,
        public accessExp : number,

        ){}
        get token(){
            return this.refresh
        }
}

export class SignUpModel {
    constructor(
        public message:string,
        private refresh_token : string,
        private access_token : string,

    ){}
}
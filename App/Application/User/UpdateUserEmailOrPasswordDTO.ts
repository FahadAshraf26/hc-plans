
class UpdateUserEmailOrPasswordDTO { 
    private readonly userId:string;
    private readonly email:string;
    private readonly password:string
    constructor(userId:string,email:string,password:string){
        this.userId = userId;
        this.email = email;
        this.password = password;
    }
    getEmail(){
        return this.email;
    }
    getPassword(){
        return this.password;
    }
    getUserId(){
        return this.userId;
    }
}

export default  UpdateUserEmailOrPasswordDTO;
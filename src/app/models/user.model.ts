export class User {

    private _id: string;
    private _username: string;
    private _picture: string;

    constructor(_id: string,
                _username: string,
                _password: string,
                _picture: string) 
    {
        this._id = _id;
        this._username = _username;
        this._picture = _picture;
    }

	public get username(): string {
		return this._username;
	}

	public get picture(): string {
		return this._picture;
	}
    
	public get id(): string {
		return this._id;
    }
    
}
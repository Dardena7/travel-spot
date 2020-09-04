import { Injectable } from '@angular/core';
import { User } from '../../models/user.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({providedIn:'root'})
export class AuthService 
{

    private _user: User = new User('3', 'Dinho', 'secret', 'assets/profil-default.png');
    private _userSubject: Subject<User> = new Subject<User>();

    constructor(private router: Router) {}

    public get user(): User  
    {
		return this._user;
	}
    
    public signIn() 
    {
        this._user = new User('1', 'Alex', '1234', 'assets/profil-default.png');
        this._userSubject.next(this._user);
        this.router.navigate(['']);
    }

    public logOut() 
    {
        this._user = null;
        this._userSubject.next(this._user);
        this.router.navigate(['']);
    }

	public get userSubject(): Subject<User>  {
		return this._userSubject;
	}

}
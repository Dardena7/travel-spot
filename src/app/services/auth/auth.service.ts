import { Injectable } from '@angular/core';
import { User } from '../../models/user.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';


@Injectable({providedIn:'root'})
export class AuthService 
{

    private _user: User = null;
    private _userSubject: Subject<User> = new Subject<User>();
    private _token: string = null;
    private tokenTimer: any;

    constructor(private http: HttpClient, private router: Router) {}

    public get user(): User  
    {
		return this._user;
	}
    
    public signIn(email: string, password: string): void 
    {
        const signinData = { email: email, password: password };
        this.http.post('http://localhost:3000/api/user/signin', signinData).subscribe(
            response => { 
                this.authSucceed(response);
             },
             error => {
                 console.log(error);
             }   
        );
    }

    public signUp(name: string, email: string, password: string): void 
    {
        const signupData = {'name': name, 'email': email, 'password': password};
        this.http.post('http://localhost:3000/api/user/signup', signupData).subscribe(
            response => {
                this.authSucceed(response);
            },
            error => {
                console.log(error);
            }
        );
    }

    public logOut(): void
    {
        this._token = null;
        this._user = null;
        clearTimeout(this.tokenTimer);
        this.clearAuthData();
        this._userSubject.next(this._user);
        this.router.navigate(['']);
    }

	public get userSubject(): Subject<User>  {
		return this._userSubject;
    }
    
    public get token(): string
    {
        return this._token;
    }

    public autoAuthUser()
    {
        const authInformations = this.getAuthData();
        if (!authInformations)
            return;
        const now = new Date();
        const expiresIn = authInformations.expirationDate.getTime() - now.getTime();
        if (expiresIn > 0) {
            this._token = authInformations.token;
            this.setAuthTimer(expiresIn / 1000);
        }
        this.router.navigate(['']);
    }

    private setAuthTimer(expiresIn: number)
    {
        console.log(expiresIn);
        
        this.tokenTimer = setTimeout(() => {
            this.logOut();
        }, expiresIn * 1000);
    }

    private getAuthData(): any
    {
        const token = localStorage.getItem('token');
        const expirationDate = localStorage.getItem('expirationDate');
        console.log(token);
        console.log(expirationDate);
        
        if (!token || !expirationDate) {
            return false;
        }
        return {
            token: token,
            expirationDate: new Date(expirationDate)
        }
    }

    private authSucceed(response: any)
    {
        this._token = response.token;
        const user = response.user;
        this._user = new User(user.id, user.name, user.password, user.picture);
        this._userSubject.next(this._user);
        this.setAuthTimer(response.expiresIn);
        const now = new Date();
        const expirationDate = new Date(now.getTime() + response.expiresIn * 1000);
        this.saveAuthData(this._token, expirationDate);
        this.router.navigate(['']);
    }

    private saveAuthData(token: string, expirationDate: Date)
    {
        localStorage.setItem('token', token);
        localStorage.setItem('expirationDate', expirationDate.toISOString());
    }

    private clearAuthData()
    {
        localStorage.removeItem('token');
        localStorage.removeItem('expirationDate');
    }
}
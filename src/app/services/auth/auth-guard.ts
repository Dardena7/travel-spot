import { Injectable } from "@angular/core";
import { AuthService } from './auth.service';
import { CanActivate, UrlTree, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
        console.log("auth");
        
        const user = this.authService.user;
        console.log("inter");
        
        console.log(user);
        
        if (user) {
            return true;
        }

        return this.router.createUrlTree(['/']);
    }
    
}
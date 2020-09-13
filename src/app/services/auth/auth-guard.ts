import { Injectable } from "@angular/core";
import { AuthService } from './auth.service';
import { CanActivate, UrlTree, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
        const user = this.authService.user;

        if (user) {
            return true;
        }

        return this.router.createUrlTree(['/']);
    }
    
}
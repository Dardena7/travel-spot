import { Injectable } from "@angular/core";
import { AuthService } from './auth.service';
import { CanActivate, UrlTree, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { PostService } from '../post.service';
import { Post } from 'src/app/models/post.model';

@Injectable()
export class EditPostGuard implements CanActivate {

    constructor(private authService: AuthService, private postService: PostService, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
        
        const userId = this.authService.user.id;
        const postAuthorId  = route.paramMap.get('author_id');

        if (userId === postAuthorId) {
            return true;
        }

        return this.router.createUrlTree(['/']);
    }
    
}
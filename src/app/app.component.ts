import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from './models/user.model';
import { Subscription } from 'rxjs';
import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'travel-spot';

  user: User = null;
  private userSub: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit(): void 
  {
    this.userSub = this.authService.userSubject.subscribe(
      user => {this.user = user;}
    );
    console.log("AA");
    this.authService.autoAuthUser();
  }

  ngOnDestroy(): void 
  {
    this.userSub.unsubscribe();
  }

  onLogOut(): void 
  {
    this.authService.logOut();
  }
}

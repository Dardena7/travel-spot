import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  user: User = null;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.userSubject.subscribe(
      user => { this.user = user; }
    );
    this.user = this.authService.user;
  }
}

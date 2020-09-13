import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    if (this.authService.user) 
      this.router.navigate(["user","account"]);
  }

  onSubmit(form: NgForm) {
    if (!form.valid)
      return;

    this.authService.signIn(form.value.email, form.value.password);   
  }

}

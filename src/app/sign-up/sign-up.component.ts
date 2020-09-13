import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  confirmPassword: boolean = true;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    if (this.authService.user) 
      this.router.navigate(["user","account"]);
  }

  onSubmit(form: NgForm) {
    if (!form.valid)
      return;
    
    if (form.value.password !== form.value.confirmPassword) {
      this.confirmPassword = false;
      return;
    }
    this.confirmPassword = true;

    this.authService.signUp(
      form.value.name,
      form.value.email,
      form.value.password
    );  
  }
  
}

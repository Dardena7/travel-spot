import { Component, OnInit, HostListener } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { PostService } from '../services/post.service';
import { Subscription } from 'rxjs';
import { User } from '../models/user.model';
import { Post } from "../models/post.model";
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FileCheck } from "angular-file-validator";
import { fileSize } from "../shared/filesize.validator";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  form: FormGroup;
  imagePreview: string;
  hasChanged: boolean;

  user: User = null;
  private userSub: Subscription;
  posts: Post[] = [];
  private postsSub: Subscription;

  loading = false;
  private loadingSub: Subscription;

  constructor(
    private authService: AuthService,
    private postService: PostService,
    private router: Router) { }

  ngOnInit(): void {
    this.userSub = this.authService.userSubject.subscribe(
      user => {this.user = user;}
    );
    this.user = this.authService.user;
    
    this.loadingSub = this.postService.loadSubject.subscribe(
      loading => { this.loading = loading; }
    );
    
    this.postsSub = this.postService.postsSubject.subscribe(
      posts => { 
        this.hasChanged = this.posts.length != posts.length;
        this.posts = posts; 
      }
    );
    if (this.user) {
      this.postService.fetchPosts(this.posts.length);
    }

    this.form = new FormGroup({
      country : new FormControl(null, {validators: [Validators.required]}),
      city : new FormControl(null, {validators: [Validators.required]}),
      picture : new FormControl(null, {
        validators: [Validators.required, fileSize(500)],
        asyncValidators: [FileCheck.ngFileValidator(['jpeg','jpg','png'])]
      }),
      description : new FormControl(null, {validators: [Validators.required]})
    });
  }

  ngOnDestroy(): void 
  {
    this.userSub.unsubscribe();
    this.postsSub.unsubscribe();
  }

  onChange(event: Event) 
  {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({picture: file})
    this.form.get('picture').updateValueAndValidity();
    console.log(file);
    
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.onloadend = () => {
      console.log(reader.result);
    };
    reader.readAsDataURL(file);
  }

  onSubmit()
  {
    if (!this.form.valid) {
      return;
    }
    this.postService.addPost(
        this.user,
        this.form.value.country,
        this.form.value.city,
        this.form.value.picture,
        this.form.value.description
    );
    this.form.reset();
  }

  onDelete(id: string)
  {
    this.postService.deletePost(id); 
  }

  onEdit(id: string)
  {
    this.router.navigate(['/edit-post', id]);
  }

  @HostListener("window:scroll", [])
  onScroll(): void {
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 100) {
      if (!this.loading && this.hasChanged)
        this.postService.fetchPosts(this.posts.length);
    }
  }

}

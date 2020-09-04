import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/services/post.service';
import { Post } from 'src/app/models/post.model';
import { Subscription } from 'rxjs';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { fileSize } from 'src/app/shared/filesize.validator';
import { FileCheck } from 'angular-file-validator';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.css']
})
export class EditPostComponent implements OnInit {

  private post: Post = null;
  country: string = "";
  city: string = "";
  picture: string = "";
  description: string = "";
  postSub: Subscription = new Subscription();
  form: FormGroup;
  imagePreview: string = "";

  constructor(
    private postService: PostService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void 
  {
    this.form = new FormGroup({
      country : new FormControl(null, {validators: [Validators.required]}),
      city : new FormControl(null, {validators: [Validators.required]}),
      picture : new FormControl(null, {
        validators: [Validators.required, fileSize(500)],
        asyncValidators: [FileCheck.ngFileValidator(['jpeg','jpg','png'])]
      }),
      description : new FormControl(null, {validators: [Validators.required]})
    });

    this.postSub = this.postService.postSubject.subscribe(
      post => {
        if (!post) {
          this.router.navigate(['/']);
        }
        this.post = post;
        this.setInput();
        
        this.form.setValue({
          'country' : this.country,
          'city' : this.city,
          'picture' : this.picture,
          'description' : this.description
        });      
      }
    );
    
    this.route.paramMap.subscribe(
      (paramMap: ParamMap) => {
        this.postService.getPost(paramMap.get('id'));
      }
    );
  }

  private setInput()
  {
    if (!this.post) {
      return;
    }
    this.imagePreview = this.post.picture;
    this.country = this.post.country;
    this.city = this.post.city;
    this.picture = this.post.picture;
    this.description = this.post.description;
  }

  onSubmit()
  {
    console.log(this.form);
    
    if (!this.form.valid || !this.post) {
      return;
    }
    this.postService.updatePost(
      this.post.id,
      this.post.author,
      this.form.value.country,
      this.form.value.city,
      this.form.value.picture,
      this.form.value.description
    );
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

  onReset()
  {
    this.setInput();
  }

}

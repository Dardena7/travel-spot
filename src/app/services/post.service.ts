import { Injectable } from '@angular/core';
import { Post } from '../models/post.model';
import { Subject, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';

@Injectable({providedIn:'root'})
export class PostService {

    private _post: Post = null;
    private _posts: Post[] = [];
    private _postSubject: Subject<Post> = new Subject<Post>();
    private _postsSubject: Subject<Post[]> = new Subject<Post[]>();
    private _loadSubject: Subject<boolean> = new Subject<boolean>();

    constructor(private http: HttpClient) {}
    
    public get posts(): Post[]
    {
        return this._posts.slice();
    }

    public get postsSubject(): Subject<Post[]>  {
		return this._postsSubject;
    }

    public get loadSubject(): Subject<boolean>  {
		return this._loadSubject;
    }

    public get postSubject(): Subject<Post>  {
		return this._postSubject;
    }
    
    public fetchPosts(): void
    {
        this.loadSubject.next(true);
        this.http.get<{message:string, posts: any[]}>("http://localhost:3000/api/posts")
        .pipe(
            catchError(err => {
                return throwError(err);
            }),
            map(postData => {
                return postData.posts.map(post => {
                    return new Post(
                        post._id,
                        new User(
                            "authorId",
                            post.author,
                            "secret",
                            "assets/profil-default.png"
                        ),
                        post.country,
                        post.city,
                        post.picture,
                        post.description
                    );
                })
            })
        )
        .subscribe(
            posts => {
                setTimeout(() => {
                    this._posts = posts;
                    this.postsSubject.next(this._posts.slice());
                    this.loadSubject.next(false);
                }, 1000)
            }
        );
    }

    addPost(author: User, country: string, city: string, picture: File, description: string)
    {
        const postData = new FormData();
        postData.append("author", author.username);
        postData.append("country",country);
        postData.append("city",city);
        postData.append("picture",picture);
        postData.append("description",description);
        this.http.post<{message:string,postId:string,postPicture:string}>("http://localhost:3000/api/posts", postData)
        .pipe(
            catchError(err => {
                return throwError(err);
            })
        )
        .subscribe(
            response => {
                const post = new Post(
                    response.postId,
                    new User("","Alexis","secret", "assets/profil-default.png"),
                    country,
                    city,
                    response.postPicture,
                    description
                ); 
                this._posts.push(post);
                this._postsSubject.next(this._posts.slice());
            }
        );
    }

    deletePost(id: string)
    {
        this.http.delete("http://localhost:3000/api/posts/"+id)
        .pipe(
            catchError(err => {
                return throwError(err);
            })
        )
        .subscribe(
            response => { 
                this._posts = this._posts.filter(post => post.id !== id);
                this._postsSubject.next(this._posts.slice());
            }
        );
    }

    updatePost(id: string, author: User, country: string, city: string, picture: File | string, description: string)
    {
        const postData = new FormData();
        postData.append("id", id);
        postData.append("author", author.username);
        postData.append("country",country);
        postData.append("city",city);
        postData.append("picture",picture);
        postData.append("description",description);
        
        this.http.put<{message:string, postPicture:string}>("http://localhost:3000/api/posts", postData)
        .pipe(
            catchError(err => {
                return throwError(err);
            })
        )
        .subscribe(
            response => { 
                this._post = new Post(id, author, country, city, response.postPicture, description);
                this._postSubject.next(this._post);
            }
        );
    }

    getPost(id: string)
    {
        this.http.get<{message: string, post: any}>("http://localhost:3000/api/posts/" + id)
        .pipe(
            catchError(err => {
                this._post = null;
                this._postSubject.next(this._post);
                return throwError(err);
            })
        )
        .subscribe(
            response => {
                const post = response.post; 
                this._post = new Post(
                    post._id,
                    new User(
                        "authorId",
                        post.author,
                        "secret",
                        "assets/profil-default.png"
                    ),
                    post.country,
                    post.city,
                    post.picture,
                    post.description
                );
                this._postSubject.next(this._post);
            }
        );
    }
}
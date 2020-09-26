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
        const queryParams = `?currentAmount=${this._posts.length}`;
        this.loadSubject.next(true);
        this.http.get<{message:string, posts: any[]}>("http://localhost:3000/api/posts"+queryParams)
        .pipe(
            catchError(err => {
                return throwError(err);
            }),
            map(response => {
                return response.posts.map(postData => {
                    return new Post(
                        postData.post._id,
                        new User(
                            postData.author.id,
                            postData.author.name,
                            postData.author.picture
                        ),
                        postData.post.country,
                        postData.post.city,
                        postData.post.picture,
                        postData.post.description
                    );
                })
            })
        )
        .subscribe(
            posts => {
                console.log(posts);
                
                setTimeout(() => {
                    this._posts = this._posts.concat(posts);
                    this.postsSubject.next(this._posts.slice());
                    this.loadSubject.next(false);
                }, 1000)
            }
        );
    }

    addPost(user: User, country: string, city: string, picture: File, description: string)
    {
        const postData = new FormData();
        postData.append("country",country);
        postData.append("city",city);
        postData.append("picture",picture);
        postData.append("description",description);
        this.http.post<{success: boolean,message:string,postId:string,postPicture:string}>("http://localhost:3000/api/posts", postData)
        .pipe(
            catchError(err => {
                return throwError(err);
            })
        )
        .subscribe(
            response => {
                const post = new Post(
                    response.postId,
                    new User(user.id, user.username, user.picture),
                    country,
                    city,
                    response.postPicture,
                    description
                ); 
                this._posts.unshift(post);
                this._postsSubject.next(this._posts.slice());
            }
        );
    }

    deletePost(id: string)
    {
        this.http.delete<{message: string}>("http://localhost:3000/api/posts/"+id)
        .pipe(
            catchError(err => {
                return throwError(err);
            })
        )
        .subscribe(
            response => { 
                console.log(response.message);
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

        this.http.put<{success: boolean, message:string, postPicture:string}>("http://localhost:3000/api/posts", postData)
        .pipe(
            catchError(err => {
                return throwError(err);
            })
        )
        .subscribe(
            response => {
                console.log(response.message); 
                if (response.success) {
                    this._post = new Post(id, author, country, city, response.postPicture, description);
                    this._postSubject.next(this._post);
                }
            }
        );
    }

    getPost(id: string)
    {
        this.http.get<{message: string, postData: any}>("http://localhost:3000/api/posts/" + id)
        .pipe(
            catchError(err => {
                this._post = null;
                this._postSubject.next(this._post);
                return throwError(err);
            })
        )
        .subscribe(
            response => {
                const post = response.postData.post;
                const author = response.postData.author; 
                this._post = new Post(
                    post._id,
                    new User(
                        author.id,
                        author.name,
                        author.picture
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
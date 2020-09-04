import { User } from "./user.model";

export class Post {

  private _id: string;
  private _author: User;
  private _country: string;
  private _city: string;
  private _picture: string;
  private _description: string;

  constructor(
    id: string,
    author: User,
    country: string,
    city: string,
    picture: string,
    description: string
  ) 
  {
    this._id = id;
    this._author = author;
    this._country = country;
    this._city = city;
    this._picture = picture;
    this._description = description;
  }

	public get id(): string {
		return this._id;
    }

	public get author(): User {
		return this._author;
    }
    
	public get country(): string {
		return this._country;
    }
    
	public get city(): string {
		return this._city;
    }

    public get picture(): string {
		return this._picture;
	}
    
	public get description(): string {
		return this._description;
  }
  
  public set id(value: string) {
		this._id = value;
	}
    

}
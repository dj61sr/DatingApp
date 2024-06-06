import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../_models/user';
import { BehaviorSubject, map } from 'rxjs';
import { JsonPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  //services can hold state because they
  //are singletons and are not destroyed until the application is shutdown.

  baseUrl = 'http://localhost:5025/api/';
  private currentUserSource = new BehaviorSubject<User | null>(null); //"User | null" this is known as a user type
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient) { }

  login(model: any) {
    return this.http.post<User>(this.baseUrl + 'account/login', model).pipe( //pipe is the observable
      map((response: User) => { //map is from the RxJS
        const user = response; //this stores the response in a variable called user
        if (user) {
          localStorage.setItem('user', JSON.stringify(user)); //need to use stringify to create a key/value pair
          this.currentUserSource.next(user); //this let us know that the user is loggedIn
        }
      })
    )
  }

  register(model: any) {
    return this.http.post<User>(this.baseUrl + 'account/register', model).pipe(
      map(user => {
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSource.next(user);
        }
        //return user; when you use map you have to explicitly return
      })
    )
  }

  setCurrentUser (user: User) {
    this.currentUserSource.next(user);
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(null); //this let's us know that the user is loggedOut
  }
}

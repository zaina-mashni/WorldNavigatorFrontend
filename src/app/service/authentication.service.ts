import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {ReplyInterface} from '../interface/reply.interface';
import {environment} from '../../environments/environment';
import {PlayerInterface} from '../interface/player.interface';



@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {
  constructor(private http: HttpClient,
              private router: Router) { }

  login(username: string, password: string) {
    const request = {
      username: username,
      password: password
    };
    return this.http.post<ReplyInterface<string>>(environment.apiUrl + '/api/auth/login', JSON.stringify(request));
  }
  isLoggedIn(): boolean {
    return localStorage.getItem('WorldNavigator') !== null;
  }

  Register(username: string, password: string) {
    const request = {
      username: username,
      password: password
    };
    console.log(JSON.stringify(request));
  //  return this.http.post<ReplyInterface<Register>>(environment.apiUrl + '/api/user/register', JSON.stringify(request)).pipe();
  }
  logout() {
    localStorage.removeItem('WorldNavigator');
    this.router.navigate(['/login']);
  }

  onLogin(player: PlayerInterface) {
    localStorage.setItem('WorldNavigator', JSON.stringify(player));
  }

  getCurrentUser(): PlayerInterface {
    if (this.isLoggedIn() === false) {
      return null;
    }
    return JSON.parse(localStorage.getItem('WorldNavigator'));
  }

  updateLocalStorage(player: PlayerInterface) {
    localStorage.setItem('WorldNavigator', JSON.stringify(player));
  }

  register(username: string, password: string){
    const request = {
      username: username,
      password: password
    };
    return this.http.post<ReplyInterface<string>>(environment.apiUrl + '/api/auth/register', JSON.stringify(request));
  }


}

import {EventEmitter, Injectable, Output} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment';
import {PlayerInterface} from '../interface/player.interface';
import {DefaultReplyInterface} from '../interface/defaultReply.interface';


@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {
  @Output() getLoggedIn: EventEmitter<PlayerInterface> = new EventEmitter();

  constructor(private http: HttpClient,
              private router: Router) {
  }

  login(username: string, password: string) {
    const request = {
      username: username,
      password: password
    };
    return this.http.post<DefaultReplyInterface>(environment.apiUrl + 'api/auth/login', JSON.stringify(request));
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('WorldNavigator') !== null;
  }

  logout() {
    const request = {
      username: this.getCurrentUser().username,
      password: this.getCurrentUser().password
    };
    this.http.post<DefaultReplyInterface>(environment.apiUrl + 'api/auth/logout', JSON.stringify(request)).subscribe(result => {
        localStorage.removeItem('WorldNavigator');
        this.getLoggedIn.emit(undefined);
        this.router.navigate(['/login']);
    });
  }

  onLogin(player: PlayerInterface) {
    localStorage.setItem('WorldNavigator', JSON.stringify(player));
    this.getLoggedIn.emit(player);
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

  register(username: string, password: string) {
    const request = {
      username: username,
      password: password
    };
    return this.http.post<DefaultReplyInterface>(environment.apiUrl + 'api/auth/register', JSON.stringify(request));
  }


}

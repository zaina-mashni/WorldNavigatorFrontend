import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {AuthenticationService} from './authentication.service';
import {EventEmitter, Injectable, Output} from '@angular/core';
import {ListGamesInterface} from '../interface/listGames.interface';
import {MapFileInterface} from '../interface/mapFile.interface';
import {GameReplyInterface} from '../interface/gameReply.interface';
import {DefaultReplyInterface} from '../interface/defaultReply.interface';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  @Output() getJoined: EventEmitter<string> = new EventEmitter();

  constructor(private http: HttpClient, private authService: AuthenticationService) {
  }

  listGames() {
    const request = {
      username: this.authService.getCurrentUser().username,
      password: this.authService.getCurrentUser().password,
    };
    return this.http.post<ListGamesInterface>(environment.apiUrl + '/api/game/list', JSON.stringify(request));
  }

  joinGame(username: string, worldName: string) {
    const request = {
      username: username,
      worldName: worldName
    };
    this.getJoined.emit(worldName);
    return this.http.post<DefaultReplyInterface>(environment.apiUrl + '/api/game/join', JSON.stringify(request));
  }

  unJoinGame(username: string, worldName: string) {
    const request = {
      username: username,
      worldName: worldName
    };
    this.getJoined.emit('');
    return this.http.post<DefaultReplyInterface>(environment.apiUrl + '/api/game/unjoin', JSON.stringify(request));
  }

  startGame(username: string, worldName: string) {
    const request = {
      username: username,
      worldName: worldName,
    };
    return this.http.post<DefaultReplyInterface>(environment.apiUrl + '/api/game/start', JSON.stringify(request));
  }

  createGame(username: string, worldName: string, mapFile: string) {
    const request = {
      username: username,
      worldName: worldName,
      mapFile: mapFile
    };
    this.getJoined.emit(worldName);
    return this.http.post<DefaultReplyInterface>(environment.apiUrl + '/api/game/create', JSON.stringify(request));
  }

  listMapFiles() {
    const request = {
      username: this.authService.getCurrentUser().username,
      password: this.authService.getCurrentUser().password,
    };
    return this.http.post<MapFileInterface>(environment.apiUrl + '/api/game/map', JSON.stringify(request));
  }

  executeCommand(username: string, command: string) {
    const request = {
      username: username,
      command: command,
    };
    return this.http.post<GameReplyInterface>(environment.apiUrl + '/api/game/command', JSON.stringify(request));
  }

  quitGame(username: string, worldName: string) {
    const request = {
      username: username,
      worldName: worldName
    };
    this.getJoined.emit('');
    return this.http.post<GameReplyInterface>(environment.apiUrl + '/api/game/quit', JSON.stringify(request));
  }
}

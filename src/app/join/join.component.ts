import { Component, OnInit } from '@angular/core';
import {GameinfoInterface} from '../interface/gameinfo.interface';
import {GameService} from '../service/game.service';
import {environment} from '../../environments/environment';
import {AuthenticationService} from '../service/authentication.service';
import {Router} from '@angular/router';
import {PlayerInterface} from '../interface/player.interface';

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.css']
})
export class JoinComponent implements OnInit {
  gameInfo: GameinfoInterface[] = [];
  constructor(private gameService: GameService, private authService: AuthenticationService, private router: Router) {
    if (!authService.isLoggedIn()) {
      router.navigate(['/login']);
    } else if (authService.getCurrentUser().worldName !== '') {
      router.navigate(['/start']);
    }
  }

  ngOnInit(): void {
    this.gameService.listGames().subscribe(result => {
      console.log(result);
      this.gameInfo = result.availableGames;
    });
  }

  onJoin(worldName: string) {
    this.gameService.joinGame(this.authService.getCurrentUser().username, worldName).subscribe(result => {
      console.log(result);
      const player: PlayerInterface = {
        username: this.authService.getCurrentUser().username,
        password: this.authService.getCurrentUser().password,
        worldName: worldName,
        isAdmin: false
      };
      this.authService.updateLocalStorage(player);
      this.router.navigate(['/start']);
    });
  }

  onCreate() {
    this.router.navigate(['/create']);
  }
}

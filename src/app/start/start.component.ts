import {Component, OnInit, Pipe, PipeTransform} from '@angular/core';
import {AuthenticationService} from '../service/authentication.service';
import {environment} from '../../environments/environment';
import {GameService} from '../service/game.service';
import * as SockJS from 'sockjs-client';
import {Stomp} from '@stomp/stompjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription, timer} from 'rxjs';
import {PlayerInterface} from '../interface/player.interface';
import {Router} from '@angular/router';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit {
  timeUp = false;
  inventory = '';
  commandList: string[] = [];
  availableCommands = '';
  facingDirection = '';
  commandForm: FormGroup;
  countDown: Subscription;
  counter = 0;
  fightCounter = 10;
  isFighting = false;
  fightCountDown: Subscription;
  fightCommand = '';
  tick = 1000;
  isPlaying = false;


  constructor(public authService: AuthenticationService,
              private gameService: GameService,
              private formBuilder: FormBuilder,
              private router: Router) {
    console.log('in constructor');
    this.commandForm = this.formBuilder.group({
      command: ['', [Validators.required]],
    });
    if (!authService.isLoggedIn()) {
      router.navigate(['/login']);
    } else if (authService.getCurrentUser().worldName === '') {
      router.navigate(['/join']);
    }
    const socket = new SockJS(environment.apiUrl + '/socket');
    const stompClient = Stomp.over(socket);
    stompClient.connect({}, (frame) => {
      stompClient.subscribe('/socket/start/' + this.authService.getCurrentUser().username, (result) => {
        console.log('in subscription: ' + result.body);
        const response = JSON.parse(result.body);
        this.inventory = response.inventory;
        this.availableCommands = response.availableCommands;
        this.facingDirection = response.facingDirection;
        if (this.isPlaying === false) {
          this.counter = response.timeLeftInMinutes * 60;
        }
        this.isFighting = response.isFighting;
        this.fightCounter = 10;
        this.fightCommand = '';
        this.isPlaying = response.isPlaying;
        if (this.isPlaying === false) {
          this.counter = 0;
        }
        this.addToList(response.message, false);
        const player: PlayerInterface = {
          username: this.authService.getCurrentUser().username,
          password: this.authService.getCurrentUser().password,
          worldName: this.authService.getCurrentUser().worldName,
          isAdmin: this.authService.getCurrentUser().isAdmin,
          isPlaying: this.isPlaying
        };
        this.authService.updateLocalStorage(player);
      });
    });
  }


  ngOnInit(): void {
    console.log('in ngoninit');
    this.timeUp = false;
    this.countDown = timer(0, this.tick).subscribe(() => {
      if (this.counter > 0 && this.isPlaying) {
        --this.counter;
      }
      if (this.counter === 0 && this.isPlaying) {
        console.log('in timeup');
        this.timeUp = true;
        const player: PlayerInterface = {
          username: this.authService.getCurrentUser().username,
          password: this.authService.getCurrentUser().password,
          worldName: '',
          isAdmin: false,
          isPlaying: false
        };
        this.gameService.getJoined.emit('');
        this.authService.updateLocalStorage(player);
      }
    });

    this.fightCountDown = timer(0, this.tick).subscribe(() => {
      if (this.fightCounter > 0 && this.isFighting) {
        --this.fightCounter;
      }
      if (this.fightCounter === 0 && this.isFighting) {
        this.onCommand(this.fightCommand);
      }
    });
  }

  onStart() {
    this.gameService.startGame(this.authService.getCurrentUser().username,
      this.authService.getCurrentUser().worldName).subscribe(result => {
      console.log(result);
    });
  }

  addToList(command: string, byPlayer: boolean) {
    let newCommand = '';
    if (byPlayer === true) {
      newCommand = '< ' + command;
    } else {
      newCommand = '> ' + command;
    }
    this.commandList.push(newCommand);
    if (this.commandList.length > 17) {
      this.commandList.shift();
    }
  }

  getCorrectFightCommand(command: string) {
    const randomNum = Math.floor(Math.random() * 3) + 1;
    if (Number.isNaN(Number(command)) || command === '') {
      if (command !== 'rock' && command !== 'paper' && command !== 'scissor') {
        return randomNum.toString();
      }
    } else if (Number(command) < 1 && Number(command) > 3) {
      return randomNum.toString();
    }
    return command;
  }

  onCommand(command: string) {
    this.addToList(command, true);
    if (this.fightCounter > 0 && this.isFighting) {
      this.fightCommand = command;
    }
    if (this.fightCounter === 0 && this.isFighting) {
      command = this.getCorrectFightCommand(command);
    }
    console.log(command);
    this.gameService.executeCommand(this.authService.getCurrentUser().username, command).subscribe(result => {
      console.log(JSON.stringify(result));
      this.inventory = result.inventory;
      this.availableCommands = result.availableCommands;
      this.facingDirection = result.facingDirection;
      this.isFighting = result.isFighting;
      this.fightCounter = 7;
      this.fightCommand = '';
      this.isPlaying = result.isPlaying;
      this.addToList(result.message, false);
    });
  }

  onQuit() {
    this.gameService.quitGame(this.authService.getCurrentUser().username,
      this.authService.getCurrentUser().worldName).subscribe(result => {
      console.log(JSON.stringify(result));
      this.inventory = result.inventory;
      this.availableCommands = result.availableCommands;
      this.facingDirection = result.facingDirection;
      this.isFighting = result.isFighting;
      this.isPlaying = result.isPlaying;
      if (this.isPlaying === false) {
        this.counter = 0;
      }
      this.addToList(result.message, false);
      const player: PlayerInterface = {
        username: this.authService.getCurrentUser().username,
        password: this.authService.getCurrentUser().password,
        worldName: '',
        isAdmin: false,
        isPlaying: false
      };
      this.authService.updateLocalStorage(player);
      this.router.navigate(['/join']);
    });
  }

  unJoin() {
    this.gameService.unJoinGame(this.authService.getCurrentUser().username,this.authService.getCurrentUser().worldName).subscribe(result => {
      console.log(result);
      const player: PlayerInterface = {
        username: this.authService.getCurrentUser().username,
        password: this.authService.getCurrentUser().password,
        worldName: '',
        isAdmin: false,
        isPlaying: false
      };
      this.authService.updateLocalStorage(player);
      this.router.navigate(['/join']);
    });
  }
}

@Pipe({
  name: 'formatTime'
})
export class FormatTimePipe implements PipeTransform {
  transform(value: number): string {
    const hours: number = Math.floor(value / 3600);
    const minutes: number = Math.floor((value % 3600) / 60);
    return (
      ('00' + hours).slice(-2) +
      ':' +
      ('00' + minutes).slice(-2) +
      ':' +
      ('00' + Math.floor(value - minutes * 60)).slice(-2)
    );
  }
}

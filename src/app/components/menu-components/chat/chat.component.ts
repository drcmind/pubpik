import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  goToHome = () => this.router.navigate(['pubpik/accueil']);
}

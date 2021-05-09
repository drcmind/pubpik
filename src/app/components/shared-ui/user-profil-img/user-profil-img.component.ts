import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-user-profil-img',
  templateUrl: './user-profil-img.component.html',
  styleUrls: ['./user-profil-img.component.scss'],
})
export class UserProfilImgComponent implements OnInit {
  @Input() fxLayoutAlign?: string;
  @Input() fontSize?: string;
  @Input() marginTop?: string;
  @Input() background?: string;
  @Input() isDarkTheme?: BehaviorSubject<boolean>;
  @Input() userData?: User | null;
  constructor() {}

  ngOnInit(): void {}
}

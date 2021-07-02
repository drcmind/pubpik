import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/database/user.service';

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
  @Input() textColor?: string;
  @Input() isDarkTheme?: BehaviorSubject<boolean>;
  @Input() userID?: string;
  @Input() userData?: User | null;
  constructor() {}

  ngOnInit(): void {}
}

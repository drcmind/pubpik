import { BehaviorSubject } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-explorer',
  templateUrl: './explorer.component.html',
  styleUrls: ['./explorer.component.scss'],
})
export class ExplorerComponent implements OnInit {
  @Input() activeViewPort?: string;
  @Input() isDarkTheme?: BehaviorSubject<boolean>;
  @Input() userID = '';
  constructor() {}

  ngOnInit(): void {}
}

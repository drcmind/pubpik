import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-explorer',
  templateUrl: './explorer.component.html',
  styleUrls: ['./explorer.component.scss'],
})
export class ExplorerComponent implements OnInit {
  @Input() activeViewPort?: string;
  @Input() isDarkTheme?: boolean;
  @Input() userID = '';
  constructor() {}

  ngOnInit(): void {}
}

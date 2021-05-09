import { AddPubPikComponent } from './../../menu-components/home-page/add-pub-pik/add-pub-pik.component';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UtilitiesService } from 'src/app/services/utilities/utilities.service';
import { Category } from 'src/app/models/category.model';
import { MatDialog } from '@angular/material/dialog';
import { User } from 'src/app/models/user.model';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {
  @Input() title?: string;
  @Input() pageName = '';
  @Input() activeViewPort?: string;
  @Input() isDarkTheme?: BehaviorSubject<boolean>;
  @Input() interestCenters?: Promise<Category[]>;
  @Input() userData?: User | null;
  @Output() newPubpiksFilterEvent = new EventEmitter<string>();

  constructor(private uts: UtilitiesService, private dialog: MatDialog) {}

  ngOnInit(): void {}

  toggleMenu = () => this.uts.toogleSidenav();

  refreshPage = () => this.uts.refreshPage('');

  switchTheme = () => this.uts.switchTheme();

  openAddPubPikDialog(): void {
    this.dialog.open(AddPubPikComponent, {
      width: '30rem',
      hasBackdrop: true,
      disableClose: true,
      data: {
        categoriesData: this.interestCenters,
        userData: this.userData,
        title: this.title,
      },
    });
  }

  onFilterByCategory(categoryName: string): void {
    this.newPubpiksFilterEvent.emit(categoryName);
  }
}

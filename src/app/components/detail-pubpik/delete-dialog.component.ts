import { UtilitiesService } from '../../services/utilities.service';
import { PubpikService } from 'src/app/services/database/pubpik.service';
import { Inject } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';

@Component({
  selector: 'app-delete-dialog',
  template: `
    <div fxLayout="column" fxLayoutAlign="end">
      <h2 mat-dialog-title align="center">
        Voulez-vous vraiment supprimer ce {{ title }}
      </h2>
      <button
        mat-flat-button
        color="warn"
        (click)="onDeletePubpik(data.pubpikID)"
      >
        Supprimer
      </button>
    </div>
  `,
  styles: [],
})
export class DeleteDialogComponent implements OnInit {
  title: string;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { pubpikID: string },
    private ps: PubpikService,
    private uts: UtilitiesService,
    private location: Location,
    private dialog: MatDialog
  ) {
    this.title = this.uts.title;
  }

  ngOnInit(): void {}

  async onDeletePubpik(pubpikID: string): Promise<void> {
    this.dialog.closeAll();
    await this.ps.deletePupiks(pubpikID);
    this.uts.showNotification(`${this.title} supprimé avec succès`);
    this.location.back();
  }
}

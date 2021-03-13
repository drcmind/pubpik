import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AngularFireStorage } from '@angular/fire/storage';
import { User } from 'src/app/models/user.model';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Category } from 'src/app/models/category.model';
import { PubPik } from 'src/app/models/pubpik.model';
import { PubpikService } from 'src/app/services/database/pubpik.service';
import { UtilitiesService } from 'src/app/services/utilities/utilities.service';
import { title } from 'src/global_variables';

@Component({
  selector: 'app-add-pub-pik',
  templateUrl: './add-pub-pik.component.html',
  styleUrls: ['./add-pub-pik.component.scss'],
})
export class AddPubPikComponent implements OnInit {
  title = title;
  isInvalidForm = true;
  downloadURL?: Observable<string>;
  imagesUrls: string[] = [];
  isImageLoading = false;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { categoriesData: Category[]; userData: User },
    private formBuilder: FormBuilder,
    private pubpikService: PubpikService,
    private storage: AngularFireStorage,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private utilitiesService: UtilitiesService
  ) {}

  addPubPikForm = this.formBuilder.group({
    titleFormControl: ['', [Validators.required]],
    descriptionFormControl: [''],
    visilibityControlName: ['public'],
    categoryControlName: ['', [Validators.required]],
  });

  get titleFormControl(): AbstractControl | null {
    return this.addPubPikForm.get('titleFormControl');
  }
  get descriptionFormControl(): AbstractControl | null {
    return this.addPubPikForm.get('descriptionFormControl');
  }
  get visilibityControlName(): AbstractControl | null {
    return this.addPubPikForm.get('visilibityControlName');
  }
  get categoryControlName(): AbstractControl | null {
    return this.addPubPikForm.get('categoryControlName');
  }

  selectFiles(event: any): void {
    if (event.target.files) {
      this.isImageLoading = true;
      for (let i = 0; i < File.length; i++) {
        const file = event.target.files[i];
        const filePath = `pubpik/${Date.now()}_${file.name}`;
        const fileRef = this.storage.ref(filePath);
        const task = this.storage.upload(filePath, file);
        task
          .snapshotChanges()
          .pipe(
            finalize(() => {
              this.downloadURL = fileRef.getDownloadURL();
              this.downloadURL.subscribe((url) => {
                this.imagesUrls.push(url);
                this.imagesUrls.length >= 0
                  ? (this.isInvalidForm = false)
                  : (this.isInvalidForm = true);
                this.isImageLoading = false;
              });
            })
          )
          .subscribe();
      }
    }
  }

  removeSelectedImage(imageToRemove: string): void {
    const resteImages = this.imagesUrls.filter((image) => {
      return imageToRemove !== image;
    });
    this.imagesUrls = resteImages;
    this.imagesUrls.length > 0
      ? (this.isInvalidForm = false)
      : (this.isInvalidForm = true);
  }

  ngOnInit(): void {}

  async onSubmit(userData: User): Promise<void> {
    if (this.addPubPikForm.valid) {
      const pubpik: PubPik = {
        pubpikTitle: this.addPubPikForm.get('titleFormControl')?.value,
        pubpikDescription: this.addPubPikForm.get('descriptionFormControl')
          ?.value,
        pubpikCategory: this.addPubPikForm.get('categoryControlName')?.value,
        pubpikVisibility: this.addPubPikForm.get('visilibityControlName')
          ?.value,
        pubpikUserData: userData,
        pubpikFavoriteCount: 0,
        pubpikTimestamp: firebase.default.firestore.FieldValue.serverTimestamp(),
        pubpikImages: this.imagesUrls,
      };
      try {
        this.dialog.closeAll();
        await this.pubpikService.addPubPik(pubpik);
        const snackBarRef = this.snackBar.open(
          `${title} ajouté avec succès`,
          'Voir',
          {
            duration: 5000,
          }
        );
        snackBarRef.onAction().subscribe(() => {
          this.utilitiesService.refreshPage('');
        });
      } catch (error) {
        this.isImageLoading = false;
        this.snackBar.open(`Une erreur s'est produite, ${error}`, 'Réessayer');
      }
    }
  }
}

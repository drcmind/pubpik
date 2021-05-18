import { Router } from '@angular/router';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AngularFireStorage } from '@angular/fire/storage';
import { User } from 'src/app/models/user.model';
import * as firebase from 'firebase/app';
import { BehaviorSubject, Observable } from 'rxjs';
import { Category } from 'src/app/models/category.model';
import { PubPik } from 'src/app/models/pubpik.model';
import { PubpikService } from 'src/app/services/database/pubpik.service';
import { UtilitiesService } from 'src/app/services/utilities/utilities.service';

@Component({
  selector: 'app-add-pub-pik',
  templateUrl: './add-pub-pik.component.html',
  styleUrls: ['./add-pub-pik.component.scss'],
})
export class AddPubPikComponent implements OnInit {
  isInvalidForm = true;
  downloadURL?: Observable<string>;
  imagesUrls: string[] = [];
  isImageLoading = false;
  isDarkTheme?: BehaviorSubject<boolean>;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      categoriesData: Promise<Category[]>;
      userData: User;
      title: string;
    },
    private formBuilder: FormBuilder,
    private pubpikService: PubpikService,
    private storage: AngularFireStorage,
    private dialog: MatDialog,
    private uts: UtilitiesService,
    private router: Router
  ) {
    this.isDarkTheme = this.uts.observeDarkMode;
  }

  addPubPikForm = this.formBuilder.group({
    title: ['', [Validators.required]],
    description: [''],
    category: ['', [Validators.required]],
  });

  get title(): AbstractControl | null {
    return this.addPubPikForm.get('title');
  }
  get description(): AbstractControl | null {
    return this.addPubPikForm.get('description');
  }
  get category(): AbstractControl | null {
    return this.addPubPikForm.get('category');
  }

  async selectFiles(event: any): Promise<void> {
    if (event.target.files) {
      this.isImageLoading = true;
      for (let i = 0; i < File.length; i++) {
        const file = event.target.files[i];
        const filePath = `pubpik/${Date.now()}_${file.name}`;
        const task = this.storage.upload(filePath, file);
        const uploadTaskSnapshot = await task;
        const url = await uploadTaskSnapshot.ref.getDownloadURL();
        this.imagesUrls.push(url);
        this.imagesUrls.length >= 0
          ? (this.isInvalidForm = false)
          : (this.isInvalidForm = true);
        this.isImageLoading = false;
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
        pubpikTitle: this.addPubPikForm.get('title')?.value,
        pubpikDescription: this.addPubPikForm.get('description')?.value,
        pubpikCategory: this.addPubPikForm.get('category')?.value,
        pubpikUserData: userData,
        pubpikFavoriteCount: 0,
        pubpikTimestamp:
          firebase.default.firestore.FieldValue.serverTimestamp(),
        pubpikImages: this.imagesUrls,
      };
      try {
        this.dialog.closeAll();
        const docRef = await this.pubpikService.addPubPik(pubpik);
        const snackBarRef = this.uts.showNotification(
          `Album ajouté avec succès`,
          'Voir'
        );
        snackBarRef
          .onAction()
          .subscribe(() => this.router.navigate(['pubpik-detail', docRef.id]));
      } catch (error) {
        this.isImageLoading = false;
        this.uts.showNotification(`Une erreur s'est produite, ${error}`);
      }
    }
  }
}

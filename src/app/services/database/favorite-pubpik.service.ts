import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { PubPik } from 'src/app/models/pubpik.model';
import { User } from 'src/app/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class FavoritePubpikService {
  pubpikCollection: AngularFirestoreCollection<PubPik>;
  usersCollection: AngularFirestoreCollection<User>;
  constructor(private readonly afs: AngularFirestore) {
    this.pubpikCollection = this.afs.collection('pubpiks');
    this.usersCollection = this.afs.collection('users');
  }

  addFavorite(
    pubpik: PubPik,
    userID: string,
    pubpikFavoriteCount: number
  ): void {
    this.pubpikCollection
      .doc(pubpik.pubpikId)
      .update({ pubpikFavoriteCount: pubpikFavoriteCount + 1 });

    this.usersCollection
      .doc(userID)
      .collection('favorites')
      .doc(pubpik.pubpikId)
      .set(pubpik);
  }

  removeFavorite(
    pubpik: PubPik,
    userID: string,
    pubpikFavoriteCount: number
  ): void {
    this.pubpikCollection
      .doc(pubpik.pubpikId)
      .update({ pubpikFavoriteCount: pubpikFavoriteCount - 1 });

    this.usersCollection
      .doc(userID)
      .collection('favorites')
      .doc(pubpik.pubpikId)
      .delete();
  }

  favoritePubpikDoc = (pubpikId?: string, userID?: string) =>
    this.usersCollection
      .doc(userID)
      .collection('favorites')
      .doc(pubpikId)
      .get();
}

import { PubPik } from './../../models/pubpik.model';
import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { User } from 'src/app/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class FavoritePubpikService {
  pubpikCollection: AngularFirestoreCollection<PubPik>;
  userCollection: AngularFirestoreCollection<User>;

  constructor(private readonly afs: AngularFirestore) {
    this.pubpikCollection = this.afs.collection('pubpiks');
    this.userCollection = this.afs.collection('users');
  }

  async isFavoritePubpik(pubpik: PubPik, userID: string): Promise<void> {
    const userDoc = this.afs.firestore.collection('users').doc(userID);
    const userFavoritePubPiks = userDoc.collection('favorites');
    const fpDoc = await userFavoritePubPiks.doc(pubpik.pubpikId).get();
    pubpik.isMyFavorite = fpDoc.exists;
  }

  addFavorite(pubpik: PubPik, userID: string, pubpikFC: number): void {
    const pubpikDoc = this.pubpikCollection.doc(pubpik.pubpikId);
    pubpikDoc.update({ pubpikFavoriteCount: pubpikFC });
    const userDoc = this.userCollection.doc(userID);
    const userFavoritePubPiks = userDoc.collection('favorites');
    userFavoritePubPiks.doc(pubpik.pubpikId).set(pubpik);
  }

  removeFavorite(pubpik: PubPik, userID: string, pubpikFC: number): void {
    const pubpikDoc = this.pubpikCollection.doc(pubpik.pubpikId);
    pubpikDoc.update({ pubpikFavoriteCount: pubpikFC });
    const userDoc = this.userCollection.doc(userID);
    const userFavoritePubPiks = userDoc.collection('favorites');
    userFavoritePubPiks.doc(pubpik.pubpikId).delete();
  }

  async getUserFavoritePubpiks(userID: string): Promise<PubPik[]> {
    const userDoc = this.afs.firestore.collection('users').doc(userID);
    const querySnapshot = await userDoc.collection('favorites').get();
    return querySnapshot.docs.map((doc) => {
      const data = doc.data() as PubPik;
      const pubpikId = doc.id;
      return { pubpikId, ...data };
    });
  }
}

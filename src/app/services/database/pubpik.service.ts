import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentReference,
} from '@angular/fire/firestore';
import { PubPik } from 'src/app/models/pubpik.model';

@Injectable({
  providedIn: 'root',
})
export class PubpikService {
  pubpikCollection: AngularFirestoreCollection<PubPik>;

  constructor(private afs: AngularFirestore) {
    this.pubpikCollection = this.afs.collection('pubpiks');
  }

  async addPubPik(pubpik: PubPik): Promise<void> {
    await this.pubpikCollection.add(pubpik);
  }
}

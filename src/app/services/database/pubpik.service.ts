import { PubPik } from './../../models/pubpik.model';
import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PubpikService {
  pubpikCollection: AngularFirestoreCollection<PubPik>;
  constructor(private readonly afs: AngularFirestore) {
    this.pubpikCollection = this.afs.collection('pubpiks', (ref) =>
      ref.orderBy('pubpikFavoriteCount', 'desc')
    );
  }

  addPubPik = (pubpik: PubPik) => this.pubpikCollection.add(pubpik);

  deletePupiks(pubpikID: string): Promise<void> {
    return this.pubpikCollection.doc(pubpikID).delete();
  }

  async getPubPiks(): Promise<PubPik[]> {
    const pubpikCollection = this.afs.firestore.collection('pubpiks');
    const orderingPub = pubpikCollection.orderBy('pubpikFavoriteCount', 'desc');
    return (await orderingPub.get()).docs.map((doc) => {
      const data = doc.data() as PubPik;
      const pubpikId = doc.id;
      return { pubpikId, ...data };
    });
  }

  getSinglePubpik(pubpikID: string): Observable<PubPik | undefined> {
    return this.pubpikCollection.doc(pubpikID).valueChanges();
  }
}

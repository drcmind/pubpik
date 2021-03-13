import { map } from 'rxjs/operators';
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
  initialPubpik$: Observable<PubPik[]>;
  constructor(private readonly afs: AngularFirestore) {
    this.pubpikCollection = this.afs.collection('pubpiks');
    this.initialPubpik$ = this.pubpikCollection.snapshotChanges().pipe(
      map((actions) =>
        actions.map((a) => {
          const data = a.payload.doc.data() as PubPik;
          const pubpikId = a.payload.doc.id;
          return { pubpikId, ...data };
        })
      )
    );
  }

  addPubPik = (pubpik: PubPik) => this.pubpikCollection.add(pubpik);

  getPubPiks = () => this.initialPubpik$;

  getSinglePubpik(pubpikID: any): Observable<PubPik | undefined> {
    return this.pubpikCollection.doc(pubpikID).valueChanges();
  }

  getFilterPubPiks(categoryName: any): Observable<PubPik[]> {
    return this.afs
      .collection<PubPik>('pubpiks', (ref) =>
        ref
          .where('pubpikCategory.categoryName', '==', categoryName)
          .orderBy('pubpikTimestamp', 'desc')
      )
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as PubPik;
            const pubpikId = a.payload.doc.id;
            return { pubpikId, ...data };
          })
        )
      );
  }
}
